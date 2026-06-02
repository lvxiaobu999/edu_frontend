import style from './style.module.css'
import { useI18n } from '@/i18n'

interface FullPageLoadingProps {
  title?: string
}

export default function FullPageLoading({ title }: FullPageLoadingProps) {
  const { t } = useI18n()
  const resolvedTitle = title || t('common.loading')

  return (
    <div className={style['full-page-loading-wrapper']}>
      <div className={style['loading-content']}>
        <div className={style['loading-spinner']}></div>
        {resolvedTitle && <p className={style['loading-text']}>{resolvedTitle}</p>}
      </div>
    </div>
  )
}
