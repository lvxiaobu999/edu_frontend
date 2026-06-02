import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'

import '@/assets/styles/tailwind.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import { I18nProvider } from './i18n'
import 'virtual:svg-icons-register'

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then(module => ({
        default: module.ReactQueryDevtools,
      })),
    )
  : null

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        {ReactQueryDevtools ? (
          <Suspense fallback={null}>
            <ReactQueryDevtools initialIsOpen={false} />
          </Suspense>
        ) : null}
      </QueryClientProvider>
    </I18nProvider>
  </StrictMode>,
)
