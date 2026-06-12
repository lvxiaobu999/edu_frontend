import { useState } from 'react'
import { Form, Modal, App } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveTeacherApi, updateTeacherApi, deleteTeacherApi } from '@/apis/teacher'
import type { TeacherDto } from '@/apis/types'
import { queryKeys } from '@/constants/queryKeys'

export const useTeacherForm = () => {
  const [open, setOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<TeacherDto | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.teachers.all })

  const createMutation = useMutation({
    mutationFn: saveTeacherApi,
    onSuccess: () => {
      invalidate()
      message.success('新增成功')
      closeForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateTeacherApi,
    onSuccess: () => {
      invalidate()
      message.success('更新成功')
      closeForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTeacherApi,
    onSuccess: () => {
      invalidate()
      message.success('删除成功')
    },
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  const openForm = (record?: TeacherDto) => {
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
        updateMutation.mutate({ ...values, id: editingRecord.id } as any)
      } else {
        createMutation.mutate(values as any)
      }
    })
  }

  const handleDelete = (record: TeacherDto) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除教师"${record.realname}"吗？`,
      onOk: () => deleteMutation.mutate(record.id),
    })
  }

  return {
    open,
    editingRecord,
    form,
    isPending,
    openForm,
    closeForm,
    handleSubmit,
    handleDelete,
  }
}
