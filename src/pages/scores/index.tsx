import React, { useState } from 'react'
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  Typography,
  App,
} from 'antd'
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnsType } from 'antd/es/table'
import { getScoresApi, createScoreApi, updateScoreApi, deleteScoreApi } from '@/apis/score'
import { getExamsApi } from '@/apis/exam'
import { getSubjectsApi } from '@/apis/subject'
import { getAllStudentsApi } from '@/apis/student'
import type { ScoreDto } from '@/apis/types'

const { Title } = Typography

const ScoresManagement: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ScoreDto | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [searchInput, setSearchInput] = useState({ exam: '', subject: '', student: '' })
  const [filters, setFilters] = useState({ exam: '', subject: '', student: '' })

  const { data: examsData } = useQuery({
    queryKey: ['exams'],
    queryFn: () => getExamsApi(),
  })

  const { data: subjectsData } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => getSubjectsApi(),
  })

  const { data: studentsData } = useQuery({
    queryKey: ['students'],
    queryFn: () => getAllStudentsApi(),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['scores', pagination, filters],
    queryFn: () =>
      getScoresApi({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...(filters.exam && { exam: filters.exam }),
        ...(filters.subject && { subject: filters.subject }),
        ...(filters.student && { student: filters.student }),
      }),
  })

  const createMutation = useMutation({
    mutationFn: createScoreApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores'] })
      message.success('录入成功')
      setOpen(false)
      form.resetFields()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; student: string; exam: string; subject: string; score: number }) =>
      updateScoreApi(data.id, {
        student: data.student,
        exam: data.exam,
        subject: data.subject,
        score: data.score,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores'] })
      message.success('更新成功')
      setOpen(false)
      setEditingRecord(null)
      form.resetFields()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteScoreApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores'] })
      message.success('删除成功')
    },
  })

  const examOptions = (examsData?.results || []).map((e: { id: string; name: string }) => ({
    value: e.id,
    label: e.name,
  }))

  const subjectOptions = (subjectsData?.results || []).map((s: { id: string; name: string }) => ({
    value: s.id,
    label: s.name,
  }))

  const studentOptions = (studentsData?.results || []).map(
    (s: { id: string; realname: string; stu_no: string }) => ({
      value: s.id,
      label: `${s.realname} (${s.stu_no})`,
    }),
  )

  const columns: ColumnsType<ScoreDto> = [
    { title: '学生', dataIndex: 'student_name', key: 'student_name' },
    { title: '学号', dataIndex: 'student_no', key: 'student_no' },
    { title: '考试', dataIndex: 'exam_name', key: 'exam', ellipsis: true },
    { title: '科目', dataIndex: 'subject_name', key: 'subject' },
    {
      title: '成绩',
      dataIndex: 'score',
      key: 'score',
      render: (v: number) => <span className="font-medium">{v}</span>,
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
                content: `确定要删除"${record.student_name}"的${record.subject_name}成绩吗？`,
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

  const handleSearch = () => {
    setFilters({ ...searchInput })
    setPagination(prev => ({ ...prev, current: 1 }))
    queryClient.invalidateQueries({ queryKey: ['scores'] })
  }

  const handleReset = () => {
    setSearchInput({ exam: '', subject: '', student: '' })
    setFilters({ exam: '', subject: '', student: '' })
    setPagination({ current: 1, pageSize: 10 })
    queryClient.invalidateQueries({ queryKey: ['scores'] })
  }

  const handleSearchInputChange = (key: keyof typeof searchInput, value: string) => {
    setSearchInput(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>成绩管理</Title>
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
            录入成绩
          </Button>
        </Space>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Select
          value={searchInput.exam || undefined}
          onChange={v => handleSearchInputChange('exam', v || '')}
          allowClear
          placeholder="选择考试"
          style={{ width: 240 }}
          options={examOptions}
          showSearch
          optionFilterProp="label"
        />
        <Select
          value={searchInput.subject || undefined}
          onChange={v => handleSearchInputChange('subject', v || '')}
          allowClear
          placeholder="选择科目"
          style={{ width: 160 }}
          options={subjectOptions}
        />
        <Input
          value={searchInput.student}
          onChange={e => handleSearchInputChange('student', e.target.value)}
          allowClear
          placeholder="学生姓名"
          style={{ width: 140 }}
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
        title={editingRecord ? '编辑成绩' : '录入成绩'}
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
            name="student"
            label="学生"
            rules={[{ required: true, message: '请选择学生' }]}
          >
            <Select
              options={studentOptions}
              placeholder="请选择学生"
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.Item
            name="exam"
            label="考试"
            rules={[{ required: true, message: '请选择考试' }]}
          >
            <Select
              options={examOptions}
              placeholder="请选择考试"
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.Item
            name="subject"
            label="科目"
            rules={[{ required: true, message: '请选择科目' }]}
          >
            <Select options={subjectOptions} placeholder="请选择科目" />
          </Form.Item>
          <Form.Item
            name="score"
            label="成绩"
            rules={[{ required: true, message: '请输入成绩' }]}
          >
            <InputNumber
              min={0}
              max={999.9}
              step={0.5}
              style={{ width: '100%' }}
              placeholder="请输入成绩"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ScoresManagement
