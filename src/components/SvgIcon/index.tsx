// src/components/Icon/SvgIcon.tsx
import React, { type CSSProperties } from 'react'
import styleModule from './svg-icon.module.less' // 样式文件见下文

interface SvgIconProps {
  name: string // 图标名称 (文件名)
  size?: string | number
  color?: string
  spin?: boolean
  className?: string // 允许外部传入 class
  style?: CSSProperties
}

const SvgIcon: React.FC<SvgIconProps> = ({
  name,
  size = '1em',
  color = 'currentColor',
  spin = false,
  className = '',
  style,
}) => {
  // 计算类名
  const svgClass = [styleModule['svg-icon'], spin ? styleModule['svg-icon-spin'] : '', className]
    .filter(Boolean)
    .join(' ')

  // 计算样式
  const svgStyle: CSSProperties = {
    width: size,
    height: size,
    color,
    ...style,
  }

  return (
    <svg className={svgClass} style={svgStyle} aria-hidden="true">
      <use xlinkHref={`#icon-${name}`} />
    </svg>
  )
}

export default SvgIcon
