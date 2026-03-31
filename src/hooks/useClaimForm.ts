import { useCallback, useEffect, useMemo } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getItem, setItem, removeItem } from '@/services/storage/mmkv';
import type { ClaimCategory } from '@/types';

// Step schemas
const step1Schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  category: z.enum(['refund', 'warranty', 'subscription', 'delivery', 'other'] as const),
});

const step2Schema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  amountClaimed: z.number().positive('Amount must be positive'),
});

const step3Schema = z.object({
  description: z.string().min(20, 'Description must be at least 20 characters'),
});

const step4Schema = z.object({
  policyNumber: z.string().nullable().optional(),
  serialNumber: z.string().nullable().optional(),
});

const step5Schema = z.object({
  confirmation: z.boolean().refine((v) => v === true, 'You must confirm the details'),
});

const stepSchemas = [step1Schema, step2Schema, step3Schema, step4Schema, step5Schema] as const;

const fullSchema = z.object({
  title: step1Schema.shape.title,
  category: step1Schema.shape.category,
  companyName: step2Schema.shape.companyName,
  amountClaimed: step2Schema.shape.amountClaimed,
  description: step3Schema.shape.description,
  policyNumber: step4Schema.shape.policyNumber,
  serialNumber: step4Schema.shape.serialNumber,
  confirmation: step5Schema.shape.confirmation,
});

export type ClaimFormData = z.infer<typeof fullSchema>;

const STORAGE_KEY = 'claimDrafts' as const;
const TOTAL_STEPS = 5;

interface UseClaimFormReturn {
  form: UseFormReturn<ClaimFormData>;
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  next: () => Promise<boolean>;
  prev: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
}

// Map step index to the field names validated in that step
const STEP_FIELDS: Record<number, (keyof ClaimFormData)[]> = {
  0: ['title', 'category'],
  1: ['companyName', 'amountClaimed'],
  2: ['description'],
  3: ['policyNumber', 'serialNumber'],
  4: ['confirmation'],
};

export function useClaimForm(initialStep = 0): UseClaimFormReturn {
  // Load saved draft from MMKV
  const savedDraft = useMemo(() => {
    const data = getItem(STORAGE_KEY);
    return data as Partial<ClaimFormData> | undefined;
  }, []);

  const form = useForm<ClaimFormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      title: '',
      category: 'other' as ClaimCategory,
      companyName: '',
      amountClaimed: 0,
      description: '',
      policyNumber: null,
      serialNumber: null,
      confirmation: false,
      ...savedDraft,
    },
    mode: 'onTouched',
  });

  // Track current step in form state to avoid extra state
  const currentStepField = useForm<{ step: number }>({
    defaultValues: { step: initialStep },
  });
  const currentStep = currentStepField.watch('step');

  // Auto-save to MMKV on value changes
  useEffect(() => {
    const subscription = form.watch((values) => {
      setItem(STORAGE_KEY, values as Record<string, unknown>);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const next = useCallback(async (): Promise<boolean> => {
    const schema = stepSchemas[currentStep];
    const fields = STEP_FIELDS[currentStep];
    if (!schema || !fields) return false;

    // Validate current step's fields against the step-specific schema
    const values: Record<string, unknown> = {};
    for (const field of fields) {
      values[field] = form.getValues(field);
    }

    const result = schema.safeParse(values);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] as keyof ClaimFormData;
        form.setError(fieldName, { message: issue.message });
      }
      return false;
    }

    // Clear any previous errors for these fields
    for (const field of fields) {
      form.clearErrors(field);
    }

    if (currentStep < TOTAL_STEPS - 1) {
      currentStepField.setValue('step', currentStep + 1);
    }
    return true;
  }, [currentStep, form, currentStepField]);

  const prev = useCallback(() => {
    if (currentStep > 0) {
      currentStepField.setValue('step', currentStep - 1);
    }
  }, [currentStep, currentStepField]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < TOTAL_STEPS) {
        currentStepField.setValue('step', step);
      }
    },
    [currentStepField],
  );

  const reset = useCallback(() => {
    form.reset({
      title: '',
      category: 'other',
      companyName: '',
      amountClaimed: 0,
      description: '',
      policyNumber: null,
      serialNumber: null,
      confirmation: false,
    });
    currentStepField.setValue('step', 0);
    removeItem(STORAGE_KEY);
  }, [form, currentStepField]);

  return {
    form,
    currentStep,
    totalSteps: TOTAL_STEPS,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === TOTAL_STEPS - 1,
    next,
    prev,
    goToStep,
    reset,
  };
}
