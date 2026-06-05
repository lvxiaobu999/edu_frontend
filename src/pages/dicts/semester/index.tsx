import React, { useState } from 'react'
import { Button, Form, Input, Modal, Space, Table, Typography, App } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnsType } from 'antd/es/table'
import {
  getSemestersApi,
  createSemesterApi,
  updateSemesterApi,
  deleteSemesterApi,
} from '@/apis/semester'
import type { SemesterDto } from '@/apis/types'

const { Title } = Typography

const SemesterDict: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<SemesterDto | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

  const { data, isLoading } = useQuery({
    queryKey: ['semesters', pagination],
    queryFn: () =>
      getSemestersApi({
        page: pagination.current,
        pageSize: pagination.pageSize,
      }),
  })

  const createMutation = useMutation({
    mutationFn: createSemesterApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] })
      message.success('新增成功')
      setOpen(false)
      form.resetFields()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; name: string; display_name: string }) =>
      updateSemesterApi(data.id, { name: data.name, display_name: data.display_name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] })
      message.success('更新成功')
      setOpen(false)
      setEditingRecord(null)
      form.resetFields()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSemesterApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] })
      message.success('删除成功')
    },
  })

  const columns: ColumnsType<SemesterDto> = [
    { title: '学期标识', dataIndex: 'name', key: 'name' },
    { title: '展示名称', dataIndex: 'display_name', key: 'display_name' },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingRecord(record)
              form.setFieldsValue(record)
              setOpen(true)
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: `确定要删除学期"${record.display_name}"吗？`,
                onOk: () => deleteMutation.mutate(record.id),
              })
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingRecord) {
        updateMutation.mutate({ id: editingRecord.id, name: values.name, display_name: values.display_name })
      } else {
        createMutation.mutate(values)
      }
    })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>学期管理</Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => queryClient.invalidateQueries({ queryKey: ['semesters'] })}
          >
            刷新
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingRecord(null)
              form.resetFields()
              setOpen(true)
            }}
          >
            新增学期
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={data?.results || []}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: data?.page || pagination.current,
          pageSize: data?.pageSize || pagination.pageSize,
          total: data?.total || 0,
          onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
        }}
      />

      <Modal
        title={editingRecord ? '编辑学期' : '新增学期'}
        open={open}
        onOk={handleSubmit}
        onCancel={() => {
          setOpen(false)
          setEditingRecord(null)
          form.resetFields()
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="学期标识"
            rules={[{ required: true, message: '请输入学期标识' }]}
          >
            <Input placeholder="如：2025-2026-1" />
          </Form.Item>
          <Form.Item
            name="display_name"
            label="展示名称"
            rules={[{ required: true, message: '请输入展示名称' }]}
          >
            <Input placeholder="如：2025-2026学年第一学期" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default SemesterDict
