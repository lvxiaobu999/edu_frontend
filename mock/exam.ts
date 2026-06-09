import type { MockMethod } from 'vite-plugin-mock'
import { createExam, deleteExam, getExamById, getExams, updateExam } from './store'
import { createErrorResponse, createPaginatedData, createResponse } from './util'

export default [
  {
    url: '/api/exams/',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      const query = request.query || {}
      const list = getExams(query)
      return createResponse(createPaginatedData(list, request), request)
    },
  },
  {
    url: '/api/exams/:id/',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      const exam = getExamById(request.params.id)
      return exam ? createResponse(exam, request) : createErrorResponse('考试不存在', 404)
    },
  },
  {
    url: '/api/exams/',
    method: 'post',
    timeout: 300,
    response: (request: any) => createResponse(createExam(request.body), request),
  },
  {
    url: '/api/exams/:id/',
    method: 'put',
    timeout: 300,
    response: (request: any) => {
      const updated = updateExam(request.params.id, request.body)
      return updated ? createResponse(updated, request) : createErrorResponse('考试不存在', 404)
    },
  },
  {
    url: '/api/exams/:id/',
    method: 'delete',
    timeout: 300,
    response: (request: any) => {
      deleteExam(request.params.id)
      return createResponse(null, request)
    },
  },
] as MockMethod[]
