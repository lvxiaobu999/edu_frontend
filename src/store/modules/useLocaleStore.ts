import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type Locale = 'zh-CN' | 'en-US'

interface LocaleState {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    set => ({
      locale: 'zh-CN',
      setLocale: locale => set({ locale }),
    }),
    {
      name: 'app-locale',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
