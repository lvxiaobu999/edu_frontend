import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAllStudentsApi } from '@/apis/student'
import { usePagination } from '@/hooks/usePagination'
import { queryKeys } from '@/constants/queryKeys'

export const useStudentList = () => {
  const { pagination, handlePageChange, resetPagination } = usePagination()

  const [searchInput, setSearchInput] = useState({
    stu_no: '',
    realname: '',
    grade: '',
    class_id: '',
  })
  const [filters, setFilters] = useState({
    stu_no: '',
    realname: '',
    grade: '',
    class_id: '',
  })

  const queryParams = { ...pagination, ...filters }
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.students.list(queryParams),
    queryFn: () =>
      getAllStudentsApi({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...(filters.stu_no && { stu_no: filters.stu_no }),
        ...(filters.realname && { realname: filters.realname }),
        ...(filters.grade && { grade: filters.grade }),
        ...(filters.class_id && { class_id: filters.class_id }),
      }),
  })

  const handleSearch = () => {
    setFilters({ ...searchInput })
    resetPagination()
  }

  const handleReset = () => {
    setSearchInput({ stu_no: '', realname: '', grade: '', class_id: '' })
    setFilters({ stu_no: '', realname: '', grade: '', class_id: '' })
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
