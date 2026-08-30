import { create } from 'zustand'
import { registerUnauthorizedHandler } from '../services/api'

export const useAuthStore = create((set) => ({
  user: null,
  status: 'idle', // idle | loading | authenticated | unauthenticated
  setUser: (user) => set({ user, status: user ? 'authenticated' : 'unauthenticated' }),
  setStatus: (status) => set({ status }),
  logout: () => set({ user: null, status: 'unauthenticated' }),
}))

registerUnauthorizedHandler(() => {
  useAuthStore.getState().logout()
})
