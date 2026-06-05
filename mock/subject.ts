import type { MockMethod } from 'vite-plugin-mock'
import {
  createSubject,
  deleteSubject,
  getSubjectById,
  getSubjects,
  updateSubject,
} from './store'
import { createErrorResponse, createPaginatedData, createResponse } from './util'

export default [
  {
    url: '/api/subjects/',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      const list = getSubjects()
      return createResponse(createPaginatedData(list, request), request)
    },
  },
  {
    url: '/api/subjects/:id/',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      const subject = getSubjectById(request.params.id)
      return subject ? createResponse(subject, request) : createErrorResponse('科目不存在', 404)
    },
  },
  {
    url: '/api/subjects/',
    method: 'post',
    timeout: 300,
    response: (request: any) => createResponse(createSubject(request.body), request),
  },
  {
    url: '/api/subjects/:id/',
    method: 'put',
    timeout: 300,
    response: (request: any) => {
      const updated = updateSubject(request.params.id, request.body)
      return updated ? createResponse(updated, request) : createErrorResponse('科目不存在', 404)
    },
  },
  {
    url: '/api/subjects/:id/',
    method: 'delete',
    timeout: 300,
    response: (request: any) => {
      deleteSubject(request.params.id)
      return createResponse(null, request)
    },
  },
] as MockMethod[]
