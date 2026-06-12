import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAllTeachersApi } from '@/apis/teacher'
import { usePagination } from '@/hooks/usePagination'
import { queryKeys } from '@/constants/queryKeys'

export const useTeacherList = () => {
  const { pagination, handlePageChange, resetPagination } = usePagination()

  const [searchInput, setSearchInput] = useState({
    emp_no: '',
    realname: '',
  })
  const [filters, setFilters] = useState({
    emp_no: '',
    realname: '',
  })

  const queryParams = { ...pagination, ...filters }
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.teachers.list(queryParams),
    queryFn: () =>
      getAllTeachersApi({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...(filters.emp_no && { emp_no: filters.emp_no }),
        ...(filters.realname && { realname: filters.realname }),
      }),
  })

  const handleSearch = () => {
    setFilters({ ...searchInput })
    resetPagination()
  }

  const handleReset = () => {
    setSearchInput({ emp_no: '', realname: '' })
    setFilters({ emp_no: '', realname: '' })
    resetPagination()
  }

  const handleSearchInputChange = (key: keyof typeof searchInput, value: string) => {
    setSearchInput(prev => ({ ...prev, [key]: value }))
  }

  return {
    data,
    isLoading,
    pagination,
    searchInput,
    handleSearch,
    handleReset,
    handleSearchInputChange,
    handlePageChange,
  }
}
