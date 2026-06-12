import { useState } from 'react'
import { Form, Modal, App } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSemesterApi, updateSemesterApi, deleteSemesterApi } from '@/apis/semester'
import type { SemesterDto } from '@/apis/types'
import { queryKeys } from '@/constants/queryKeys'

export const useSemesterForm = () => {
  const [open, setOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<SemesterDto | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.semester.all })

  const createMutation = useMutation({
    mutationFn: createSemesterApi,
    onSuccess: () => {
      invalidate()
      message.success('新增成功')
      closeForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; name: string; display_name: string }) =>
      updateSemesterApi(data.id, { name: data.name, display_name: data.display_name }),
    onSuccess: () => {
      invalidate()
      message.success('更新成功')
      closeForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSemesterApi,
    onSuccess: () => {
      invalidate()
      message.success('删除成功')
    },
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  const openForm = (record?: SemesterDto) => {
    if (record) {
      setEditingRecord(record)
      form.setFieldsValue(record)
    } else {
      setEditingRecord(null)
      form.resetFields()
    }
    setOpen(true)
  }

  const closeForm = () => {
    setOpen(false)
    setEditingRecord(null)
    form.resetFields()
  }

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingRecord) {
        updateMutation.mutate({
          id: editingRecord.id,
          name: values.name,
          display_name: values.display_name,
        })
      } else {
        createMutation.mutate(values)
      }
    })
  }

  const handleDelete = (record: SemesterDto) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除学期"${record.display_name}"吗？`,
      onOk: () => deleteMutation.mutate(record.id),
    })
  }

  return { open, editingRecord, form, isPending, openForm, closeForm, handleSubmit, handleDelete }
}
