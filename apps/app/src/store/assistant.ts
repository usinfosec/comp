import { create } from "zustand";

interface AssistantState {
  isOpen: boolean;
  message?: string;
  setOpen: (value: boolean | string | undefined) => void;
  setClose: () => void;
}

export const useAssistantStore = create<AssistantState>()((set) => ({
  isOpen: false,
  message: undefined,
  setOpen: (value) =>
    set({
      isOpen: typeof value === "boolean" ? value : true,
      message: typeof value === "string" ? value : undefined,
    }),
  setClose: () => set({ isOpen: false, message: undefined }),
}));
