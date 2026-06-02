import type { MockMethod } from 'vite-plugin-mock'
import { createLoginResponse } from './store'
import { createErrorResponse, createResponse } from './util'

export default [
  {
    url: '/api/auth/login',
    method: 'post',
    timeout: 300,
    response: ({ body }: any) => {
      const loginData = createLoginResponse(body.username)

      if (!loginData) {
        return createErrorResponse('账号不存在或已停用', 401)
      }

      return createResponse(loginData)
    },
  },
  {
    url: '/api/auth/logout',
    method: 'post',
    timeout: 300,
    response: () => createResponse(null),
  },
] as MockMethod[]
