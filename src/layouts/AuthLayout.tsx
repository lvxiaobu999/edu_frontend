import React, { useEffect } from 'react'
import { Divider, Layout } from 'antd'
import { Outlet, useLocation, useNavigation } from 'react-router-dom'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { motion, AnimatePresence } from 'framer-motion'
import { PrimaryColor, DarkSwitch, Logo } from './components'
import { useThemeStore } from '@/store'
import style from './styles/auth-layout.module.less'

const { Header, Content } = Layout

const AppLayout: React.FC = () => {
  const { pathname } = useLocation()
  const { isDark } = useThemeStore()

  // 优化点：获取全局路由状态，处理加载中的 Loading
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'

  // 在组件内部监听
  useEffect(() => {
    if (isLoading) {
      nProgress.start()
    } else {
      nProgress.done()
    }
  }, [isLoading])

  return (
    <Layout className={[style['auth-layout'], isDark ? style['auth-layout-dark'] : ''].join(' ')}>
      <Header className={'w-full flex justify-between items-center gap-4 !bg-transparent'}>
        <Logo />
        <div className="flex items-center gap-4">
          <DarkSwitch />
          <Divider vertical />
          <PrimaryColor />
        </div>
      </Header>
      <Content>
        {/* AnimatePresence 负责处理组件卸载时的动画 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname} // 关键：路径变了，动画才会触发
            initial={{ opacity: 0, x: 10 }} // 初始状态：透明且向右偏一点
            animate={{ opacity: 1, x: 0 }} // 进入状态：完全显示
            exit={{ opacity: 0, x: -10 }} // 退出状态：透明且向左偏一点
            transition={{ duration: 0.3 }} // 动画时长
            style={{ width: '100%' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Content>
    </Layout>
  )
}

export default AppLayout
