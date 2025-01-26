import { create } from 'zustand';

export const useStore = create((set) => ({
  isToast: false,
  message: "",
  transactionData: {},
  submittedData: {},
  showToast: (enabled, message) => set(() => ({ isToast: enabled, message })),
  setTransactionData: (logs) => set((state) => {
    return { transactionData: {...state.transactionData,...logs}}
  }),
  setSubmittedData: (logs) => set((state) => {
    return { submittedData: {...state.submittedData,...logs}}
  })
}));