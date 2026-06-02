import type { MockMethod } from 'vite-plugin-mock'
import {
  createResearchGroup,
  deleteResearchGroup,
  getResearchGroupById,
  getResearchGroups,
  updateResearchGroup,
} from './store'
import { createErrorResponse, createPaginatedData, createResponse } from './util'

export default [
  {
    url: '/api/research-groups/',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      const list = getResearchGroups()
      return createResponse(createPaginatedData(list, request), request)
    },
  },
  {
    url: '/api/research-groups/:id/',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      const group = getResearchGroupById(request.params.id)
      return group ? createResponse(group, request) : createErrorResponse('教研组不存在', 404)
    },
  },
  {
    url: '/api/research-groups/',
    method: 'post',
    timeout: 300,
    response: (request: any) => createResponse(createResearchGroup(request.body), request),
  },
  {
    url: '/api/research-groups/:id/',
    method: 'put',
    timeout: 300,
    response: (request: any) => {
      const updated = updateResearchGroup(request.params.id, request.body)
      return updated ? createResponse(updated, request) : createErrorResponse('教研组不存在', 404)
    },
  },
  {
    url: '/api/research-groups/:id/',
    method: 'delete',
    timeout: 300,
    response: (request: any) => {
      deleteResearchGroup(request.params.id)
      return createResponse(null, request)
    },
  },
] as MockMethod[]
