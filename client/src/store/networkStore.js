import { create } from 'zustand'

export const useNetworkStore = create((set) => ({
  slowRequestCount: 0,
  incrementSlow: () => set((state) => ({ slowRequestCount: state.slowRequestCount + 1 })),
  decrementSlow: () =>
    set((state) => ({ slowRequestCount: Math.max(0, state.slowRequestCount - 1) })),
}))
