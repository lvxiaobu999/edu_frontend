import { create } from 'zustand'
import { getChoicesApi } from '@/apis/choices'
import type { ChoicesDto } from '@/apis/choices/type'

type ChoiceKey = keyof ChoicesDto

interface ChoicesState {
  choices: ChoicesDto | null
  loading: boolean
  error: string | null
  fetchChoices: () => Promise<void>
  /** 按 key 获取 Select options 数组 */
  getOptions: (key: ChoiceKey) => Array<{ value: string; label: string }>
  /** 按 key + value 获取显示文案 */
  getLabel: (key: ChoiceKey, value: string) => string
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

  getOptions: key => get().choices?.[key] || [],

  getLabel: (key, value) => {
    const item = get().choices?.[key]?.find(o => o.value === value)
    return item?.label || value
  },
}))
