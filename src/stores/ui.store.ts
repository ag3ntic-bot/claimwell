import { create } from 'zustand';

interface UIState {
  isBottomSheetOpen: boolean;
  bottomSheetContent: string | null;
  activeTab: string;
  openBottomSheet: (content: string) => void;
  closeBottomSheet: () => void;
  setActiveTab: (tab: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isBottomSheetOpen: false,
  bottomSheetContent: null,
  activeTab: 'home',

  openBottomSheet: (content) => set({ isBottomSheetOpen: true, bottomSheetContent: content }),
  closeBottomSheet: () => set({ isBottomSheetOpen: false, bottomSheetContent: null }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
