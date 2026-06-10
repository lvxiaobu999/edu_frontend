import type { MockMethod } from 'vite-plugin-mock'
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
} from './store'
import { createErrorResponse, createPaginatedData, createResponse } from './util'

export default [
  {
    url: '/api/students/',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      const list = getAllStudents()
      return createResponse(createPaginatedData(list, request), request)
    },
  },
  {
    url: '/api/students/:id/',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      const student = getStudentById(request.params.id)
      return student ? createResponse(student, request) : createErrorResponse('学生不存在', 404)
    },
  },
  {
    url: '/api/students/',
    method: 'post',
    timeout: 300,
    response: (request: any) => createResponse(createStudent(request.body), request),
  },
  {
    url: '/api/students/:id/',
    method: 'put',
    timeout: 300,
    response: (request: any) => {
      const updated = updateStudent(request.params.id, request.body)
      return updated ? createResponse(updated, request) : createErrorResponse('学生不存在', 404)
    },
  },
  {
    url: '/api/students/:id/',
    method: 'delete',
    timeout: 300,
    response: (request: any) => {
      deleteStudent(request.params.id)
      return createResponse(null, request)
    },
  },
] as MockMethod[]
