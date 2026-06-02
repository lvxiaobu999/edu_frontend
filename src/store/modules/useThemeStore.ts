import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const colors = [
  '#3e4fef', //
  '#1890ff', // 蚂蚁蓝
  '#52c41a', // 绿色
  '#faad14', // 黄色
  '#f5222d', // 红色
  '#722ed1', // 紫色
  '#13c2c2', // 青色
  '#fa541c', // 橙色
  '#8c8c8c', // 灰色
  '#001529', // 暗色
  '#801529', //
  '#501529', //
  '#012d57', //
]

// 提取类型：ThemeColor 将会是上述字符串的字面量联合类型
type ThemeColor = (typeof colors)[number]

interface UserState {
  primaryColor: ThemeColor
  colors: ThemeColor[]
  isDark: boolean // 建议增加暗黑模式切换
  setPrimaryColor: (color: string) => void
  toggleDark: () => void
}

export const useThemeStore = create<UserState>()(
  persist(
    set => ({
      primaryColor: '#501529',
      colors,
      isDark: false,
      setPrimaryColor: color => set({ primaryColor: color as ThemeColor }),
      toggleDark: () => set(state => ({ isDark: !state.isDark })),
    }),
    {
      name: 'theme-primary-color', // 存储在 localStorage 中的 key
      storage: createJSONStorage(() => localStorage), // 默认就是 localStorage
    },
  ),
)
