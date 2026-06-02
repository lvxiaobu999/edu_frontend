import type { LoginResponse, UserDto } from '@/apis/types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AuthState {
  user: UserDto | null
  accessToken: string | null
  refreshToken: string | null
  isInitialized: boolean
  getToken: () => string | null
  getRefreshToken: () => string | null
  setInitialized: (initialized: boolean) => void
  clearAuth: () => void
  setAuth: (loginResponse: LoginResponse) => void
  updateAccessToken: (token: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isInitialized: false,
      getToken: () => get().accessToken,
      getRefreshToken: () => get().refreshToken,
      setInitialized: initialized => set({ isInitialized: initialized }),
      clearAuth: () => {
        localStorage.removeItem('auth-store')
        set({ user: null, accessToken: null, refreshToken: null, isInitialized: true })
      },
      setAuth: loginResponse =>
        set({
          user: loginResponse.user,
          accessToken: loginResponse.access,
          refreshToken: loginResponse.refresh,
          isInitialized: true,
        }),
      updateAccessToken: token => set({ accessToken: token }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ isInitialized: true })
      },
    },
  ),
)
