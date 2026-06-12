import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getClassesApi } from '@/apis/classes'
import { usePagination } from '@/hooks/usePagination'
import { queryKeys } from '@/constants/queryKeys'

export const useClassesList = () => {
  const { pagination, handlePageChange, resetPagination } = usePagination()

  const [searchInput, setSearchInput] = useState({ grade: '', name: '', headmaster: '' })
  const [filters, setFilters] = useState({ grade: '', name: '', headmaster: '' })

  const queryParams = { ...pagination, ...filters }
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.classes.list(queryParams),
    queryFn: () =>
      getClassesApi({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...(filters.grade && { grade: filters.grade }),
        ...(filters.name && { name: filters.name }),
        ...(filters.headmaster && { headmaster: filters.headmaster }),
      }),
  })

  const handleSearch = () => {
    setFilters({ ...searchInput })
    resetPagination()
  }

  const handleReset = () => {
    setSearchInput({ grade: '', name: '', headmaster: '' })
    setFilters({ grade: '', name: '', headmaster: '' })
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
