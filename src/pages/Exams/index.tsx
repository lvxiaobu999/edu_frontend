import React, { useState } from 'react'
import { Button, DatePicker, Form, Input, Modal, Select, Space, Table, Typography, App } from 'antd'
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { getExamsApi, createExamApi, updateExamApi, deleteExamApi } from '@/apis/exam'
import { getSemestersApi } from '@/apis/semester'
import type { ExamDto } from '@/apis/types'
import { useChoicesStore } from '@/store'

const { Title } = Typography

const ExamsManagement: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ExamDto | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  const { getOptions } = useChoicesStore()

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [searchInput, setSearchInput] = useState({ exam_type: '', grade: '', semester: '' })
  const [filters, setFilters] = useState({ exam_type: '', grade: '', semester: '' })

  const { data: semestersData } = useQuery({
    queryKey: ['semesters'],
    queryFn: () => getSemestersApi(),
  })

  const semesterOptions = (semestersData?.results || []).map(s => ({
    value: s.id,
    label: s.display_name,
  }))

  const { data, isLoading } = useQuery({
    queryKey: ['exams', pagination, filters],
    queryFn: () =>
      getExamsApi({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...(filters.exam_type && { exam_type: filters.exam_type }),
        ...(filters.grade && { grade: filters.grade }),
        ...(filters.semester && { semester: filters.semester }),
      }),
  })

  const createMutation = useMutation({
    mutationFn: createExamApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] })
      message.success('新增成功')
      setOpen(false)
      form.resetFields()
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
      queryClient.invalidateQueries({ queryKey: ['exams'] })
      message.success('更新成功')
      setOpen(false)
      setEditingRecord(null)
      form.resetFields()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteExamApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] })
      message.success('删除成功')
    },
  })

  const columns: ColumnsType<ExamDto> = [
    { title: '考试名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '考试类型', dataIndex: 'exam_type_display', key: 'exam_type' },
    { title: '年级', dataIndex: 'grade_display', key: 'grade' },
    { title: '学期', dataIndex: 'semester_display', key: 'semester' },
    { title: '考试日期', dataIndex: 'exam_date', key: 'exam_date' },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingRecord(record)
              form.setFieldsValue({ ...record, exam_date: dayjs(record.exam_date) })
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
                content: `确定要删除考试"${record.name}"吗？`,
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
      const payload = { ...values, exam_date: values.exam_date.format('YYYY-MM-DD') }
      if (editingRecord) {
        updateMutation.mutate({ id: editingRecord.id, ...payload })
      } else {
        createMutation.mutate(payload)
      }
    })
  }

  const handleSearch = () => {
    setFilters({ ...searchInput })
    setPagination(prev => ({ ...prev, current: 1 }))
    queryClient.invalidateQueries({ queryKey: ['exams'] })
  }

  const handleReset = () => {
    setSearchInput({ exam_type: '', grade: '', semester: '' })
    setFilters({ exam_type: '', grade: '', semester: '' })
    setPagination({ current: 1, pageSize: 10 })
    queryClient.invalidateQueries({ queryKey: ['exams'] })
  }

  const handleSearchInputChange = (key: keyof typeof searchInput, value: string) => {
    setSearchInput(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>考试管理</Title>
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
            新增考试
          </Button>
        </Space>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Select
          value={searchInput.exam_type || undefined}
          onChange={v => handleSearchInputChange('exam_type', v || '')}
          allowClear
          placeholder="考试类型"
          style={{ width: 140 }}
          options={getOptions('exam_types')}
        />
        <Select
          value={searchInput.grade || undefined}
          onChange={v => handleSearchInputChange('grade', v || '')}
          allowClear
          placeholder="年级"
          style={{ width: 140 }}
          options={getOptions('grades')}
        />
        <Select
          value={searchInput.semester || undefined}
          onChange={v => handleSearchInputChange('semester', v || '')}
          allowClear
          placeholder="学期"
          style={{ width: 200 }}
          options={semesterOptions}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          查询
        </Button>
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
        title={editingRecord ? '编辑考试' : '新增考试'}
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
            name="exam_type"
            label="考试类型"
            rules={[{ required: true, message: '请选择考试类型' }]}
          >
            <Select options={getOptions('exam_types')} placeholder="请选择考试类型" />
          </Form.Item>
          <Form.Item
            name="exam_date"
            label="考试日期"
            rules={[{ required: true, message: '请选择考试日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="grade" label="年级" rules={[{ required: true, message: '请选择年级' }]}>
            <Select options={getOptions('grades')} placeholder="请选择年级" />
          </Form.Item>
          <Form.Item
            name="semester"
            label="学期"
            rules={[{ required: true, message: '请选择学期' }]}
          >
            <Select options={semesterOptions} placeholder="请选择学期" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ExamsManagement
