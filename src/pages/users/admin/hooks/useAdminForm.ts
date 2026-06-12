import { useState } from 'react'
import { Form, Modal, App } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUserApi, updateUserApi, deleteUserApi, approveUserApi } from '@/apis/user'
import type { UserDto } from '@/apis/types'
import { queryKeys } from '@/constants/queryKeys'

export const useAdminForm = () => {
  const [open, setOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserDto | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.admins.all })

  const createMutation = useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      invalidate()
      message.success('创建成功')
      closeForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => {
      const { id, ...rest } = data
      return updateUserApi(id as string, rest)
    },
    onSuccess: () => {
      invalidate()
      message.success('更新成功')
      closeForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      invalidate()
      message.success('删除成功')
    },
  })

  const approveMutation = useMutation({
    mutationFn: approveUserApi,
    onSuccess: () => {
      invalidate()
      message.success('审核通过')
    },
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  const openForm = (record?: UserDto) => {
    if (record) {
      setEditingUser(record)
      form.setFieldsValue(record)
    } else {
      setEditingUser(null)
      form.resetFields()
    }
    setOpen(true)
  }

  const closeForm = () => {
    setOpen(false)
    setEditingUser(null)
    form.resetFields()
  }

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingUser) {
        updateMutation.mutate({ ...values, id: editingUser.id } as any)
      } else {
        createMutation.mutate(values as any)
      }
    })
  }

  const handleDelete = (record: UserDto) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除用户"${record.username}"吗？`,
      onOk: () => deleteMutation.mutate(record.id),
    })
  }

  const handleApprove = (record: UserDto) => {
    Modal.confirm({
      title: '确认审核',
      content: `审核通过用户"${record.username}"？`,
      onOk: () => approveMutation.mutate(record.id),
    })
  }

  return {
    open,
    editingUser,
    form,
    isPending,
    openForm,
    closeForm,
    handleSubmit,
    handleDelete,
    handleApprove,
  }
}
