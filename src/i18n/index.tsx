import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { messages } from './messages'
import { useLocaleStore, type Locale } from '@/store/modules/useLocaleStore'

type Primitive = string | number

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, Primitive>) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

// 根据点分路径从语言包中读取对应文案，例如 `common.login`。
const resolveMessage = (locale: Locale, key: string) =>
  key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, messages[locale])

// 将文案中的占位符替换为实际参数，例如 `{username}`。
const interpolate = (template: string, params?: Record<string, Primitive>) => {
  if (!params) return template

  return template.replace(/\{(\w+)\}/g, (_, token: string) => {
    const value = params[token]
    return value === undefined ? `{${token}}` : String(value)
  })
}

// 为整棵 React 组件树提供当前语言和翻译方法。
export function I18nProvider({ children }: { children: ReactNode }) {
  const { locale, setLocale } = useLocaleStore()

  // 同步 HTML 的 `lang` 属性，便于浏览器和辅助功能识别当前语言。
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  // 记忆化上下文值，避免无关渲染导致消费者重复更新。
  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      // 统一的翻译入口；如果找不到文案，则回退为 key，便于排查缺失项。
      t: (key, params) => {
        const message = resolveMessage(locale, key)
        return typeof message === 'string' ? interpolate(message, params) : key
      },
    }),
    [locale, setLocale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

// 在组件中读取当前语言和 `t` 方法的便捷 Hook。
export function useI18n() {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }

  return context
}
