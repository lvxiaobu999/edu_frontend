import { useState } from 'react'
import { Form, Modal, App } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createResearchGroupApi,
  updateResearchGroupApi,
  deleteResearchGroupApi,
} from '@/apis/research-group'
import type { ResearchGroupDto } from '@/apis/types'
import { queryKeys } from '@/constants/queryKeys'

export const useResearchGroupForm = () => {
  const [open, setOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ResearchGroupDto | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.researchGroup.all })

  const createMutation = useMutation({
    mutationFn: createResearchGroupApi,
    onSuccess: () => {
      invalidate()
      message.success('新增成功')
      closeForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; name: string }) =>
      updateResearchGroupApi(data.id, { name: data.name }),
    onSuccess: () => {
      invalidate()
      message.success('更新成功')
      closeForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteResearchGroupApi,
    onSuccess: () => {
      invalidate()
      message.success('删除成功')
    },
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  const openForm = (record?: ResearchGroupDto) => {
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

  const handleDelete = (record: ResearchGroupDto) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除教研组"${record.name}"吗？`,
      onOk: () => deleteMutation.mutate(record.id),
    })
  }

  return { open, editingRecord, form, isPending, openForm, closeForm, handleSubmit, handleDelete }
}
