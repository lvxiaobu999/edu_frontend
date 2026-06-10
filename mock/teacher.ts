import type { MockMethod } from 'vite-plugin-mock'
import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from './store'
import { createErrorResponse, createPaginatedData, createResponse } from './util'

export default [
  {
    url: '/api/teachers/',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      const list = getAllTeachers()
      return createResponse(createPaginatedData(list, request), request)
    },
  },
  {
    url: '/api/teachers/:id/',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      const teacher = getTeacherById(request.params.id)
      return teacher ? createResponse(teacher, request) : createErrorResponse('教师不存在', 404)
    },
  },
  {
    url: '/api/teachers/',
    method: 'post',
    timeout: 300,
    response: (request: any) => createResponse(createTeacher(request.body), request),
  },
  {
    url: '/api/teachers/:id/',
    method: 'put',
    timeout: 300,
    response: (request: any) => {
      const updated = updateTeacher(request.params.id, request.body)
      return updated ? createResponse(updated, request) : createErrorResponse('教师不存在', 404)
    },
  },
  {
    url: '/api/teachers/:id/',
    method: 'delete',
    timeout: 300,
    response: (request: any) => {
      deleteTeacher(request.params.id)
      return createResponse(null, request)
    },
  },
] as MockMethod[]
