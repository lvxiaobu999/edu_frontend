import type { MockMethod } from 'vite-plugin-mock'
import {
  approveUser,
  createUser,
  deleteUser,
  getPendingUsers,
  getUserById,
  getUsers,
  updateUser,
} from './store'
import { createErrorResponse, createPaginatedData, createResponse } from './util'

export default [
  {
    url: '/api/',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      const query = request.query || {}
      const list = getUsers(query)
      return createResponse(createPaginatedData(list, request), request)
    },
  },
  {
    url: '/api/pending/',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      const list = getPendingUsers()
      return createResponse(createPaginatedData(list, request), request)
    },
  },
  {
    url: '/api/register/',
    method: 'post',
    timeout: 300,
    response: (request: any) => createResponse(createUser(request.body), request),
  },
  {
    url: '/api/:id/',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      const user = getUserById(request.params.id)
      return user ? createResponse(user, request) : createErrorResponse('用户不存在', 404)
    },
  },
  {
    url: '/api/',
    method: 'post',
    timeout: 300,
    response: (request: any) => createResponse(createUser(request.body), request),
  },
  {
    url: '/api/:id/',
    method: 'put',
    timeout: 300,
    response: (request: any) => {
      const user = updateUser(request.params.id, request.body)
      return user ? createResponse(user, request) : createErrorResponse('用户不存在', 404)
    },
  },
  {
    url: '/api/:id/',
    method: 'delete',
    timeout: 300,
    response: (request: any) => {
      deleteUser(request.params.id)
      return createResponse(null, request)
    },
  },
  {
    url: '/api/:id/approve/',
    method: 'post',
    timeout: 300,
    response: (request: any) => {
      const user = approveUser(request.params.id)
      return user ? createResponse(user, request) : createErrorResponse('用户不存在', 404)
    },
  },
] as MockMethod[]
