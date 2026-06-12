import { useQuery } from '@tanstack/react-query'
import { getSemestersApi } from '@/apis/semester'
import { usePagination } from '@/hooks/usePagination'
import { queryKeys } from '@/constants/queryKeys'

export const useSemesterList = () => {
  const { pagination, handlePageChange, resetPagination } = usePagination()

  const queryParams = { ...pagination }
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.semester.list(queryParams),
    queryFn: () =>
      getSemestersApi({
        page: pagination.current,
        pageSize: pagination.pageSize,
      }),
  })

  return { data, isLoading, pagination, handleRefresh: resetPagination, handlePageChange }
}
