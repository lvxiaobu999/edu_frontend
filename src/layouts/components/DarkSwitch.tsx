import { useThemeStore } from '@/store'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import type React from 'react'
import '../styles/dark-switch.less'

const DarkSwitch: React.FC = () => {
  const { isDark, toggleDark } = useThemeStore()
  return (
    <div
      className={[
        'dark-toggle h-[22px] w-[40px] relative block cursor-pointer rounded-full border transition-colors duration-300',
        isDark ? 'is-dark' : '',
      ].join(' ')}
      onClick={() => toggleDark()}
    >
      <span className="toggle-thumb">
        {isDark ? (
          <MoonOutlined className="!text-yellow-400" />
        ) : (
          <SunOutlined className="!text-gray-700" />
        )}
      </span>
    </div>
  )
}

export default DarkSwitch
