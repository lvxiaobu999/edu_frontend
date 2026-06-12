import { useState } from 'react'
import { Form, Modal, App } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSubjectApi, updateSubjectApi, deleteSubjectApi } from '@/apis/subject'
import type { SubjectDto } from '@/apis/types'
import { queryKeys } from '@/constants/queryKeys'

export const useSubjectForm = () => {
  const [open, setOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<SubjectDto | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.subject.all })

  const createMutation = useMutation({
    mutationFn: createSubjectApi,
    onSuccess: () => {
      invalidate()
      message.success('新增成功')
      closeForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; name: string }) =>
      updateSubjectApi(data.id, { name: data.name }),
    onSuccess: () => {
      invalidate()
      message.success('更新成功')
      closeForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSubjectApi,
    onSuccess: () => {
      invalidate()
      message.success('删除成功')
    },
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  const openForm = (record?: SubjectDto) => {
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
      if (editingRecord) updateMutation.mutate({ id: editingRecord.id, name: values.name })
      else createMutation.mutate(values)
    })
  }

  const handleDelete = (record: SubjectDto) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除科目"${record.name}"吗？`,
      onOk: () => deleteMutation.mutate(record.id),
    })
  }

  return { open, editingRecord, form, isPending, openForm, closeForm, handleSubmit, handleDelete }
}
