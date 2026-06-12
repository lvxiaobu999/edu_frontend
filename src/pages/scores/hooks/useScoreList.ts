import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getScoresApi } from '@/apis/score'
import { usePagination } from '@/hooks/usePagination'
import { queryKeys } from '@/constants/queryKeys'

export const useScoreList = () => {
  const { pagination, handlePageChange, resetPagination } = usePagination()

  const [searchInput, setSearchInput] = useState({ exam: '', subject: '', student: '' })
  const [filters, setFilters] = useState({ exam: '', subject: '', student: '' })

  const queryParams = { ...pagination, ...filters }
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.scores.list(queryParams),
    queryFn: () =>
      getScoresApi({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...(filters.exam && { exam: filters.exam }),
        ...(filters.subject && { subject: filters.subject }),
        ...(filters.student && { student: filters.student }),
      }),
  })

  const handleSearch = () => {
    setFilters({ ...searchInput })
    resetPagination()
  }

  const handleReset = () => {
    setSearchInput({ exam: '', subject: '', student: '' })
    setFilters({ exam: '', subject: '', student: '' })
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
