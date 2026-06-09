import React, { useState } from 'react'
import { Button, Form, Input, Modal, Select, Space, Typography, App } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getClassesApi, createClassApi, updateClassApi, deleteClassApi } from '@/apis/classes'
import type { ClassesDto } from '@/apis/types'
import { useChoicesStore } from '@/store'
import ClassesSearch from './components/ClassesSearch'
import ClassesTable from './components/ClassesTable'

const { Title } = Typography

const ClassesManagement: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ClassesDto | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  const { getOptions } = useChoicesStore()

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [searchInput, setSearchInput] = useState({ grade: '', name: '', headmaster: '' })
  const [filters, setFilters] = useState({ grade: '', name: '', headmaster: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['classes', pagination, filters],
    queryFn: () =>
      getClassesApi({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...(filters.grade && { grade: filters.grade }),
        ...(filters.name && { name: filters.name }),
        ...(filters.headmaster && { headmaster: filters.headmaster }),
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

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingRecord) {
        updateMutation.mutate({ id: editingRecord.id, ...values })
      } else {
        createMutation.mutate(values)
      }
    })
  }

  const handleSearch = () => {
    setFilters({ ...searchInput })
    setPagination(prev => ({ ...prev, current: 1 }))
    queryClient.invalidateQueries({ queryKey: ['classes'] })
  }

  const handleReset = () => {
    setSearchInput({ grade: '', name: '', headmaster: '' })
    setFilters({ grade: '', name: '', headmaster: '' })
    setPagination({ current: 1, pageSize: 10 })
    queryClient.invalidateQueries({ queryKey: ['classes'] })
  }

  const handleSearchInputChange = (key: keyof typeof searchInput, value: string) => {
    setSearchInput(prev => ({ ...prev, [key]: value }))
  }

  const handleEdit = (record: ClassesDto) => {
    setEditingRecord(record)
    form.setFieldsValue(record)
    setOpen(true)
  }

  const handleDelete = (record: ClassesDto) => {
    deleteMutation.mutate(record.id)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>班级管理</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
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

      <ClassesSearch
        searchInput={searchInput}
        onSearchInputChange={handleSearchInputChange}
        onSearch={handleSearch}
        gradeOptions={getOptions('grades')}
      />

      <ClassesTable
        dataSource={data?.results || []}
        loading={isLoading}
        pagination={{
          current: data?.page || pagination.current,
          pageSize: data?.pageSize || pagination.pageSize,
          total: data?.total || 0,
          onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
            <Select options={getOptions('grades')} placeholder="请选择年级" />
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
