import { useState } from 'react'
import { Form, Modal, App } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { createExamApi, updateExamApi, deleteExamApi } from '@/apis/exam'
import type { ExamDto } from '@/apis/types'
import { queryKeys } from '@/constants/queryKeys'

export const useExamForm = () => {
  const [open, setOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ExamDto | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.exams.all })

  const createMutation = useMutation({
    mutationFn: createExamApi,
    onSuccess: () => {
      invalidate()
      message.success('新增成功')
      closeForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: {
      id: string
      exam_type: string
      exam_date: string
      grade: string
      semester: string
    }) =>
      updateExamApi(data.id, {
        exam_type: data.exam_type,
        exam_date: data.exam_date,
        grade: data.grade,
        semester: data.semester,
      }),
    onSuccess: () => {
      invalidate()
      message.success('更新成功')
      closeForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteExamApi,
    onSuccess: () => {
      invalidate()
      message.success('删除成功')
    },
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  const openForm = (record?: ExamDto) => {
    if (record) {
      setEditingRecord(record)
      form.setFieldsValue({ ...record, exam_date: dayjs(record.exam_date) })
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
      const payload = { ...values, exam_date: values.exam_date.format('YYYY-MM-DD') }
      if (editingRecord) {
        updateMutation.mutate({ id: editingRecord.id, ...payload })
      } else {
        createMutation.mutate(payload)
      }
    })
  }

  const handleDelete = (record: ExamDto) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除考试"${record.name}"吗？`,
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
