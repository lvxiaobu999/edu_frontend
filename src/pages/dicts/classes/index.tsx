import React, { useState } from 'react'
import { Button, Form, Input, Modal, Select, Space, Table, Typography, App } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnsType } from 'antd/es/table'
import { getClassesApi, createClassApi, updateClassApi, deleteClassApi } from '@/apis/classes'
import type { ClassesDto } from '@/apis/types'
import { GradeOptions } from '@/apis/types'

const { Title } = Typography

const ClassesManagement: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ClassesDto | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

  const { data, isLoading } = useQuery({
    queryKey: ['classes', pagination],
    queryFn: () =>
      getClassesApi({
        page: pagination.current,
        pageSize: pagination.pageSize,
      }),
  })

  const createMutation = useMutation({
    mutationFn: createClassApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
      message.success('新增成功')
      setOpen(false)
      form.resetFields()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; grade: string; name: string; headmaster?: string }) =>
      updateClassApi(data.id, { grade: data.grade, name: data.name, headmaster: data.headmaster }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
      message.success('更新成功')
      setOpen(false)
      setEditingRecord(null)
      form.resetFields()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteClassApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
      message.success('删除成功')
    },
  })

  const columns: ColumnsType<ClassesDto> = [
    {
      title: '年级',
      dataIndex: 'grade_display',
      key: 'grade_display',
    },
    { title: '班级名称', dataIndex: 'name', key: 'name' },
    {
      title: '班主任',
      dataIndex: 'headmaster_name',
      key: 'headmaster_name',
      render: (v: string) => v || '未指定',
    },
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
                content: `确定要删除班级"${record.grade_display}${record.name}"吗？`,
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
        updateMutation.mutate({ id: editingRecord.id, ...values })
      } else {
        createMutation.mutate(values)
      }
    })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>班级管理</Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => queryClient.invalidateQueries({ queryKey: ['classes'] })}
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
            新增班级
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
        title={editingRecord ? '编辑班级' : '新增班级'}
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
          <Form.Item name="grade" label="年级" rules={[{ required: true, message: '请选择年级' }]}>
            <Select options={GradeOptions} placeholder="请选择年级" />
          </Form.Item>
          <Form.Item
            name="name"
            label="班级名称"
            rules={[{ required: true, message: '请输入班级名称' }]}
          >
            <Input placeholder="如：1班" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ClassesManagement
