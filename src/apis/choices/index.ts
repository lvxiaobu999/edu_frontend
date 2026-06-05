import { httpClient } from '@/utils'
import type { ChoicesDto } from './type'

// 获取后端定义的枚举列表，例如：角色枚举、年级枚举、考试类型、性别

export function getChoicesApi() {
  return httpClient.get<ChoicesDto>('/api/choices')
}
