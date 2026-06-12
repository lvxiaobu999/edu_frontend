import { useState } from 'react'
import { Form, Modal, App } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveStudentApi, updateStudentApi, deleteStudentApi } from '@/apis/student'
import type { StudentDto } from '@/apis/types'
import { queryKeys } from '@/constants/queryKeys'

export const useStudentForm = () => {
  const [open, setOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<StudentDto | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.students.all })

  const createMutation = useMutation({
    mutationFn: saveStudentApi,
    onSuccess: () => {
      invalidate()
      message.success('新增成功')
      closeForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateStudentApi,
    onSuccess: () => {
      invalidate()
      message.success('更新成功')
      closeForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteStudentApi,
    onSuccess: () => {
      invalidate()
      message.success('删除成功')
    },
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  const openForm = (record?: StudentDto) => {
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

  const handleDelete = (record: StudentDto) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除学生"${record.realname}"吗？`,
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
