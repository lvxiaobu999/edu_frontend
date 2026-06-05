import type { MockMethod } from 'vite-plugin-mock'
import {
  createSemester,
  deleteSemester,
  getSemesterById,
  getSemesters,
  updateSemester,
} from './store'
import { createErrorResponse, createPaginatedData, createResponse } from './util'

export default [
  {
    url: '/api/semesters/',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      const list = getSemesters()
      return createResponse(createPaginatedData(list, request), request)
    },
  },
  {
    url: '/api/semesters/:id/',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      const semester = getSemesterById(request.params.id)
      return semester ? createResponse(semester, request) : createErrorResponse('学期不存在', 404)
    },
  },
  {
    url: '/api/semesters/',
    method: 'post',
    timeout: 300,
    response: (request: any) => createResponse(createSemester(request.body), request),
  },
  {
    url: '/api/semesters/:id/',
    method: 'put',
    timeout: 300,
    response: (request: any) => {
      const updated = updateSemester(request.params.id, request.body)
      return updated ? createResponse(updated, request) : createErrorResponse('学期不存在', 404)
    },
  },
  {
    url: '/api/semesters/:id/',
    method: 'delete',
    timeout: 300,
    response: (request: any) => {
      deleteSemester(request.params.id)
      return createResponse(null, request)
    },
  },
] as MockMethod[]
