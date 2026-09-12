import { create } from 'zustand'

let nextId = 1

export const useToastStore = create((set) => ({
  toasts: [],
  addToast: (message, tone = 'success') =>
    set((state) => ({ toasts: [...state.toasts, { id: nextId++, message, tone }] })),
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

export function showToast(message, tone = 'success') {
  useToastStore.getState().addToast(message, tone)
}
