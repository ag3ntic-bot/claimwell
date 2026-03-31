import { create } from 'zustand';
import type { DraftTone } from '@/types';

interface DraftState {
  selectedTone: DraftTone;
  isEditing: boolean;
  draftContent: string;
  setTone: (tone: DraftTone) => void;
  setEditing: (editing: boolean) => void;
  setContent: (content: string) => void;
  resetDraft: () => void;
}

export const useDraftStore = create<DraftState>((set) => ({
  selectedTone: 'assertive',
  isEditing: false,
  draftContent: '',

  setTone: (tone) => set({ selectedTone: tone }),
  setEditing: (editing) => set({ isEditing: editing }),
  setContent: (content) => set({ draftContent: content }),
  resetDraft: () =>
    set({
      selectedTone: 'assertive',
      isEditing: false,
      draftContent: '',
    }),
}));
