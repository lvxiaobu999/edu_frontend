import { useQuery } from '@tanstack/react-query'
import { getResearchGroupsApi } from '@/apis/research-group'
import { usePagination } from '@/hooks/usePagination'
import { queryKeys } from '@/constants/queryKeys'

export const useResearchGroupList = () => {
  const { pagination, handlePageChange, resetPagination } = usePagination()
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.researchGroup.list({ ...pagination }),
    queryFn: () =>
      getResearchGroupsApi({ page: pagination.current, pageSize: pagination.pageSize }),
  })
  return { data, isLoading, pagination, handleRefresh: resetPagination, handlePageChange }
}
