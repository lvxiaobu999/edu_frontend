import type { MockMethod } from 'vite-plugin-mock'
import { createScore, deleteScore, getAllStudents, getScoreById, getScores, updateScore } from './store'
import { createErrorResponse, createPaginatedData, createResponse } from './util'

export default [
  {
    url: '/api/scores/',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      const query = request.query || {}
      const list = getScores(query)
      return createResponse(createPaginatedData(list, request), request)
    },
  },
  {
    url: '/api/scores/:id/',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      const score = getScoreById(request.params.id)
      return score ? createResponse(score, request) : createErrorResponse('成绩不存在', 404)
    },
  },
  {
    url: '/api/scores/',
    method: 'post',
    timeout: 300,
    response: (request: any) => createResponse(createScore(request.body), request),
  },
  {
    url: '/api/scores/:id/',
    method: 'put',
    timeout: 300,
    response: (request: any) => {
      const updated = updateScore(request.params.id, request.body)
      return updated ? createResponse(updated, request) : createErrorResponse('成绩不存在', 404)
    },
  },
  {
    url: '/api/scores/:id/',
    method: 'delete',
    timeout: 300,
    response: (request: any) => {
      deleteScore(request.params.id)
      return createResponse(null, request)
    },
  },
  // 学生列表（供成绩录入选择）
  {
    url: '/api/profile/students/',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      const list = getAllStudents()
      return createResponse(createPaginatedData(list, request), request)
    },
  },
] as MockMethod[]
