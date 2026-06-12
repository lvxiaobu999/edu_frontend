import { useQuery } from '@tanstack/react-query'
import { getSubjectsApi } from '@/apis/subject'
import { usePagination } from '@/hooks/usePagination'
import { queryKeys } from '@/constants/queryKeys'

export const useSubjectList = () => {
  const { pagination, handlePageChange, resetPagination } = usePagination()
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.subject.list({ ...pagination }),
    queryFn: () => getSubjectsApi({ page: pagination.current, pageSize: pagination.pageSize }),
  })
  return { data, isLoading, pagination, handleRefresh: resetPagination, handlePageChange }
}
