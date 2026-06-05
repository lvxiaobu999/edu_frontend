import React from 'react'
import { Avatar, Button, Divider, Popover, Select, type PopoverProps } from 'antd'
import { useAuthStore } from '@/store'
import { useI18n } from '@/i18n'
import { UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { logoutApi } from '@/apis/auth'
import { useChoicesStore } from '@/store'

const UserInfo: React.FC = () => {
  const { user, accessToken, refreshToken, clearAuth } = useAuthStore()
  const { getLabel } = useChoicesStore()
  const { locale, setLocale, t } = useI18n()
  const navigate = useNavigate()

  const logout = async () => {
    if (refreshToken) {
      await logoutApi({ refreshToken })
    }
    clearAuth()
  }

  const styles: PopoverProps['styles'] = {
    container: {
      width: 220,
    },
    content: {
      color: '#262626',
    },
  }

  const userInfoContent = (
    <div className="flex flex-col">
      <div className="flex items-center gap-3">
        <Avatar icon={<UserOutlined />} size={36} />
        <div className="text-[12px] text-[var(--el-text-color-regular)] leading-[18px]">
          <p>{user?.username}</p>
          <p>{user?.role ? getLabel('roles', user.role) : ''}</p>
        </div>
      </div>
      <Divider orientation="horizontal" className="my-[20px]" />
      <div className="flex flex-col gap-[8px]">
        <span className="text-[12px] text-[#8c8c8c]">{t('common.language')}</span>
        <Select
          value={locale}
          onChange={value => setLocale(value)}
          options={[
            { value: 'zh-CN', label: t('common.chinese') },
            { value: 'en-US', label: t('common.english') },
          ]}
        />
      </div>
      <Divider orientation="horizontal" className="my-[20px]" />
      <Button onClick={logout} danger>
        {t('common.logout')}
      </Button>
    </div>
  )

  const loginBtn = (
    <Button type="primary" className="w-full" onClick={() => navigate('/login')}>
      {t('common.goLogin')}
    </Button>
  )

  return (
    <Popover styles={styles} content={accessToken ? userInfoContent : loginBtn} trigger="click">
      <Button type="primary" shape="circle" aria-label={t('user.profileAria')}>
        <Avatar icon={<UserOutlined />} />
      </Button>
    </Popover>
  )
}

export default UserInfo
