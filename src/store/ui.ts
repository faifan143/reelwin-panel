import { StateCreator } from 'zustand';

// UI State
export interface UiState {
  isAddingContent: boolean;
  activeTab: string;
}

// UI Actions
export interface UiActions {
  setIsAddingContent: (isAdding: boolean) => void;
  setActiveTab: (tab: string) => void;
}

// UI slice type
export type UiSlice = UiState & UiActions;

// Create UI slice
export const createUiSlice: StateCreator<UiSlice> = (set) => ({
  // Initial state
  isAddingContent: false,
  activeTab: 'content',

  // Actions
  setIsAddingContent: (isAdding) =>
    set({
      isAddingContent: isAdding,
    }),

  setActiveTab: (tab) =>
    set({
      activeTab: tab,
    }),
});