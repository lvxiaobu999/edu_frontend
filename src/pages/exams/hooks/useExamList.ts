import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getExamsApi } from '@/apis/exam'
import { usePagination } from '@/hooks/usePagination'
import { queryKeys } from '@/constants/queryKeys'

export const useExamList = () => {
  const { pagination, handlePageChange, resetPagination } = usePagination()

  const [searchInput, setSearchInput] = useState({
    exam_type: '',
    grade: '',
    semester: '',
  })
  const [filters, setFilters] = useState({
    exam_type: '',
    grade: '',
    semester: '',
  })

  const queryParams = { ...pagination, ...filters }
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.exams.list(queryParams),
    queryFn: () =>
      getExamsApi({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...(filters.exam_type && { exam_type: filters.exam_type }),
        ...(filters.grade && { grade: filters.grade }),
        ...(filters.semester && { semester: filters.semester }),
      }),
  })

  const handleSearch = () => {
    setFilters({ ...searchInput })
    resetPagination()
  }

  const handleReset = () => {
    setSearchInput({ exam_type: '', grade: '', semester: '' })
    setFilters({ exam_type: '', grade: '', semester: '' })
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
