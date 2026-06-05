import React, { useState } from 'react'
import { Button, Form, Input, Modal, Space, Table, Typography, App } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnsType } from 'antd/es/table'
import {
  getSubjectsApi,
  createSubjectApi,
  updateSubjectApi,
  deleteSubjectApi,
} from '@/apis/subject'
import type { SubjectDto } from '@/apis/types'

const { Title } = Typography

const SubjectDict: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<SubjectDto | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

  const { data, isLoading } = useQuery({
    queryKey: ['subjects', pagination],
    queryFn: () =>
      getSubjectsApi({
        page: pagination.current,
        pageSize: pagination.pageSize,
      }),
  })

  const createMutation = useMutation({
    mutationFn: createSubjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      message.success('新增成功')
      setOpen(false)
      form.resetFields()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; name: string }) =>
      updateSubjectApi(data.id, { name: data.name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      message.success('更新成功')
      setOpen(false)
      setEditingRecord(null)
      form.resetFields()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSubjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      message.success('删除成功')
    },
  })

  const columns: ColumnsType<SubjectDto> = [
    { title: '科目名称', dataIndex: 'name', key: 'name' },
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
                content: `确定要删除科目"${record.name}"吗？`,
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
        updateMutation.mutate({ id: editingRecord.id, name: values.name })
      } else {
        createMutation.mutate(values)
      }
    })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>科目管理</Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => queryClient.invalidateQueries({ queryKey: ['subjects'] })}
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
            新增科目
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
        title={editingRecord ? '编辑科目' : '新增科目'}
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
            label="科目名称"
            rules={[{ required: true, message: '请输入科目名称' }]}
          >
            <Input placeholder="请输入科目名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default SubjectDict
