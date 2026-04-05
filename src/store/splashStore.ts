import { create } from 'zustand'

type SplashStatus = 'loading' | 'ready' | 'error'

interface SplashState {
  status: SplashStatus
  isVisible: boolean
  errorMessage: string | null
  setStatus: (status: SplashStatus) => void
  setVisible: (visible: boolean) => void
  setError: (message: string) => void
  reset: () => void
}

export const useSplashStore = create<SplashState>((set) => ({
  status: 'loading',
  isVisible: true,
  errorMessage: null,

  setStatus: (status) => set({ status }),
  setVisible: (visible) => set({ isVisible: visible }),
  setError: (message) => set({ status: 'error', errorMessage: message }),
  reset: () => set({ status: 'loading', isVisible: true, errorMessage: null }),
}))