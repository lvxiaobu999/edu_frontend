import type { TablePaginationConfig } from 'antd'
import { useState } from 'react'

export const usePagination = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })

  const handlePageChange = (page: TablePaginationConfig) => {
    setPagination(prev => ({
      ...prev,
      current: page.current || prev.current,
      pageSize: page.pageSize || prev.pageSize,
    }))
  }

  return {
    pagination,
    handlePageChange,
  }
}
