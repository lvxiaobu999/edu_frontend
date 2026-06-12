import { useState } from 'react'
import { Form, Modal, App } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createScoreApi, updateScoreApi, deleteScoreApi } from '@/apis/score'
import type { ScoreDto } from '@/apis/types'
import { queryKeys } from '@/constants/queryKeys'

export const useScoreForm = () => {
  const [open, setOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ScoreDto | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.scores.all })

  const createMutation = useMutation({
    mutationFn: createScoreApi,
    onSuccess: () => {
      invalidate()
      message.success('录入成功')
      closeForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: {
      id: string
      student: string
      exam: string
      subject: string
      score: number
    }) =>
      updateScoreApi(data.id, {
        student: data.student,
        exam: data.exam,
        subject: data.subject,
        score: data.score,
      }),
    onSuccess: () => {
      invalidate()
      message.success('更新成功')
      closeForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteScoreApi,
    onSuccess: () => {
      invalidate()
      message.success('删除成功')
    },
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  const openForm = (record?: ScoreDto) => {
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

  const handleDelete = (record: ScoreDto) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除"${record.student_name}"的${record.subject_name}成绩吗？`,
      onOk: () => deleteMutation.mutate(record.id),
    })
  }

  return { open, editingRecord, form, isPending, openForm, closeForm, handleSubmit, handleDelete }
}
