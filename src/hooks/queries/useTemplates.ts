import { useQuery } from '@tanstack/react-query';
import type { Template } from '@/types';
import { fetchTemplates, searchTemplates } from '@/services/api/templates';

export function useTemplates() {
  return useQuery<Template[]>({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
  });
}

export function useSearchTemplates(query: string) {
  return useQuery<Template[]>({
    queryKey: ['templates', 'search', query],
    queryFn: () => searchTemplates(query),
    enabled: query.trim().length > 0,
  });
}
