import React, { useEffect } from 'react'
import { Divider, Layout } from 'antd'
import { Outlet, useLocation, useNavigation } from 'react-router-dom'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { motion, AnimatePresence } from 'framer-motion'
import { PrimaryColor, UserInfo, Logo, SideMenu, DarkSwitch } from './components'
import { useThemeStore } from '@/store'
import Style from './styles/style.module.less'

const { Header, Sider, Content } = Layout

const AppLayout: React.FC = () => {
  const { pathname } = useLocation()
  const { isDark } = useThemeStore()

  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'

  useEffect(() => {
    if (isLoading) {
      nProgress.start()
    } else {
      nProgress.done()
    }
  }, [isLoading])

  return (
    <Layout style={{ minHeight: '100vh', width: '100%' }}>
      <Sider width={200} theme="light">
        <div style={{ height: 32, margin: 16 }}>
          <Logo />
        </div>
        <SideMenu />
      </Sider>
      <Layout>
        <Header className={[Style['header'], isDark ? Style['header-dark'] : ''].join(' ')}>
          <div className="w-full flex justify-end items-center gap-4">
            <DarkSwitch />
            <Divider vertical />
            <PrimaryColor />
            <Divider vertical />
            <UserInfo />
          </div>
        </Header>
        <Content style={{ position: 'relative', height: 'calc(100vh - 64px)', overflow: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout
