import { create } from 'zustand';

export const useStore = create((set) => ({
  count: 0,
  isToast: false,
  message: "",
  transactionData: [],
  showToast: (enabled, message) => set(() => ({ isToast: enabled, message })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setTransactionData: (logs) => set((state) => {
    return { transactionData: [...state.transactionData, logs] }
  })
}));