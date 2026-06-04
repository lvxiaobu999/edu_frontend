export function createResponse<T>(data: T, request?: any) {
  const params = request?.query || request?.body || {}

  if (
    data &&
    typeof data === 'object' &&
    'results' in data &&
    Array.isArray((data as any).results)
  ) {
    return {
      code: 0,
      success: true,
      message: 'success',
      data: {
        ...data,
        page: params.page ? Number(params.page) : (data as any).page || 1,
        pageSize: params.pageSize ? Number(params.pageSize) : (data as any).pageSize || 10,
      },
    }
  }

  return {
    code: 0,
    success: true,
    message: 'success',
    data,
  }
}

export function createErrorResponse(message = 'failed', code = 500) {
  return {
    code,
    success: false,
    message,
    data: null,
  }
}

export function createPaginatedData<T>(list: T[], request?: any) {
  const query = request?.query || {}
  const page = Number(query.page || query.current || 1)
  const pageSize = Number(query.pageSize || 10)
  const start = (page - 1) * pageSize
  const pagedList = list.slice(start, start + pageSize)

  return {
    results: pagedList,
    total: list.length,
    page,
    pageSize,
    totalPages: Math.ceil(list.length / pageSize),
  }
}
