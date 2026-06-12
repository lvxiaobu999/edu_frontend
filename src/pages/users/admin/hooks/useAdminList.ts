import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getUsersApi, getPendingUsersApi } from '@/apis/user'
import { usePagination } from '@/hooks/usePagination'
import { queryKeys } from '@/constants/queryKeys'

export const useAdminList = () => {
  const { pagination, handlePageChange, resetPagination } = usePagination()
  const [activeTab, setActiveTab] = useState<string>('all')

  const queryParams = { ...pagination, tab: activeTab }
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.admins.list(queryParams),
    queryFn: () => {
      if (activeTab === 'pending') {
        return getPendingUsersApi({ page: pagination.current, pageSize: pagination.pageSize })
      }
      return getUsersApi({ page: pagination.current, pageSize: pagination.pageSize })
    },
  })

  const handleRefresh = () => {
    resetPagination()
  }

  return {
    data,
    isLoading,
    pagination,
    activeTab,
    setActiveTab,
    handleRefresh,
    handlePageChange,
  }
}
