import type { MockMethod } from 'vite-plugin-mock'
import {
  createClass,
  deleteClass,
  getClassById,
  getClasses,
  updateClass,
} from './store'
import { createErrorResponse, createPaginatedData, createResponse } from './util'

export default [
  {
    url: '/api/classes/',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      const query = request.query || {}
      const list = getClasses(query)
      return createResponse(createPaginatedData(list, request), request)
    },
  },
  {
    url: '/api/classes/:id/',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      const cls = getClassById(request.params.id)
      return cls ? createResponse(cls, request) : createErrorResponse('班级不存在', 404)
    },
  },
  {
    url: '/api/classes/',
    method: 'post',
    timeout: 300,
    response: (request: any) => createResponse(createClass(request.body), request),
  },
  {
    url: '/api/classes/:id/',
    method: 'put',
    timeout: 300,
    response: (request: any) => {
      const updated = updateClass(request.params.id, request.body)
      return updated ? createResponse(updated, request) : createErrorResponse('班级不存在', 404)
    },
  },
  {
    url: '/api/classes/:id/',
    method: 'delete',
    timeout: 300,
    response: (request: any) => {
      deleteClass(request.params.id)
      return createResponse(null, request)
    },
  },
] as MockMethod[]
