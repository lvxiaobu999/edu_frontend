import React from 'react'
import { Popover, Space } from 'antd'
import { useThemeStore } from '@/store'

const PrimaryColor: React.FC = () => {
  const { primaryColor, colors, setPrimaryColor } = useThemeStore()
  const ColorList = (
    <div className="w-[240px] p-4">
      <Space wrap size="large">
        {colors.map(color => (
          <span
            key={color}
            className="w-[20px] h-[20px] block cursor-pointer rounded-[19%/24%]"
            style={{ backgroundColor: color }}
            onClick={() => setPrimaryColor(color)}
          />
        ))}
      </Space>
    </div>
  )

  return (
    <Popover content={ColorList}>
      <span
        className="w-[16px] h-[16px] block cursor-pointer rounded-[19%/24%] "
        style={{ background: primaryColor }}
      ></span>
    </Popover>
  )
}
export default PrimaryColor
