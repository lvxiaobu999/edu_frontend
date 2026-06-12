import { useState } from 'react'
import { Form, App } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClassApi, updateClassApi, deleteClassApi } from '@/apis/classes'
import type { ClassesDto } from '@/apis/types'
import { queryKeys } from '@/constants/queryKeys'

export const useClassesForm = () => {
  const [open, setOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ClassesDto | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.classes.all })

  const createMutation = useMutation({
    mutationFn: createClassApi,
    onSuccess: () => {
      invalidate()
      message.success('新增成功')
      closeForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; grade: string; name: string; headmaster?: string }) =>
      updateClassApi(data.id, { grade: data.grade, name: data.name, headmaster: data.headmaster }),
    onSuccess: () => {
      invalidate()
      message.success('更新成功')
      closeForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteClassApi,
    onSuccess: () => {
      invalidate()
      message.success('删除成功')
    },
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  const openForm = (record?: ClassesDto) => {
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
      if (editingRecord) updateMutation.mutate({ id: editingRecord.id, ...values })
      else createMutation.mutate(values)
    })
  }

  const handleDelete = (record: ClassesDto) => {
    deleteMutation.mutate(record.id)
  }

  return { open, editingRecord, form, isPending, openForm, closeForm, handleSubmit, handleDelete }
}
