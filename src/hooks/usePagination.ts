import { useState } from 'react'

export const usePagination = (defaultPageSize = 10) => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: defaultPageSize,
  })

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination({ current: page, pageSize })
  }

  const resetPagination = () => {
    setPagination(prev => ({ current: 1, pageSize: prev.pageSize }))
  }

  return {
    pagination,
    setPagination,
    handlePageChange,
    resetPagination,
  }
}
