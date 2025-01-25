import { create } from 'zustand';

export const useStore = create((set) => ({
  count: 0,
  isToast:false,
  message: "",
  showToast: (enabled, message) => set(() => ({ isToast: enabled , message})),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));