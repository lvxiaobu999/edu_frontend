import type { MockMethod } from 'vite-plugin-mock'
import { getDashboardStats } from './store'
import { createResponse } from './util'

export default [
  {
    url: '/api/dashboard/stats',
    method: 'get',
    timeout: 300,
    response: (request: any) => createResponse(getDashboardStats(), request),
  },
] as MockMethod[]
