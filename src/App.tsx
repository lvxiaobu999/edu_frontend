import { RouterProvider } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'
import router from '@/router'
import { useThemeStore } from './store'
import { useI18n } from './i18n'
import { useMemo } from 'react'

const App = () => {
  const { primaryColor, isDark } = useThemeStore()
  const { locale } = useI18n()

  const antdLocale = useMemo(() => {
    return locale === 'en-US' ? enUS : zhCN
  }, [locale])

  return (
    <ConfigProvider
      locale={antdLocale}
      theme={{
        cssVar: {
          prefix: 'ant',
        },
        token: {
          colorPrimary: primaryColor,
        },
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}

export function HydrateFallback() {
  const { t } = useI18n()

  return (
    <div className="loading-spinner">
      <p>{t('common.loadingApp')}</p>
    </div>
  )
}

export default App
