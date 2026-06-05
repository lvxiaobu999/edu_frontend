import { create } from 'zustand'
import { getChoicesApi } from '@/apis/choices'
import type { ChoicesDto } from '@/apis/choices/type'

interface ChoicesState {
  choices: ChoicesDto | null
  loading: boolean
  error: string | null
  /** 初始化：从后端拉取枚举数据 */
  fetchChoices: () => Promise<void>
  /** 根据 key 获取选项列表 */
  getOptions: (key: keyof ChoicesDto) => Array<{ value: string; label: string }>
}

export const useChoicesStore = create<ChoicesState>()((set, get) => ({
  choices: null,
  loading: false,
  error: null,

  fetchChoices: async () => {
    if (get().choices) return
    set({ loading: true, error: null })
    try {
      const data = await getChoicesApi()
      set({ choices: data, loading: false })
    } catch (e) {
      set({ error: (e as Error).message || '获取枚举数据失败', loading: false })
    }
  },

  getOptions: key => {
    const list = get().choices?.[key] || []
    return list.map(item => ({
      value: item.name,
      label: item.name,
    }))
  },
}))
