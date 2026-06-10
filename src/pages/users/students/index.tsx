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
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnsType } from 'antd/es/table'
import {
  getAllStudentsApi,
  saveStudentApi,
  updateStudentApi,
  deleteStudentApi,
} from '@/apis/student'
import { getClassesApi } from '@/apis/classes'
import type { StudentDto } from '@/apis/types'
import { useChoicesStore } from '@/store'

const { Title } = Typography

const StudentProfilePage: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<StudentDto | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  const { getLabel, getOptions } = useChoicesStore()

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

  const { data, isLoading } = useQuery({
    queryKey: ['students', pagination],
    queryFn: () =>
      getAllStudentsApi({
        page: pagination.current,
        pageSize: pagination.pageSize,
      }),
  })

  console.log('students data', data)

  const { data: classesData } = useQuery({
    queryKey: ['classes'],
    queryFn: () => getClassesApi(),
  })

  const createMutation = useMutation({
    mutationFn: saveStudentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      message.success('新增成功')
      setOpen(false)
      form.resetFields()
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateStudentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      message.success('更新成功')
      setOpen(false)
      setEditingRecord(null)
      form.resetFields()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteStudentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      message.success('删除成功')
    },
  })

  const columns: ColumnsType<StudentDto> = [
    { title: '学号', dataIndex: 'stu_no', key: 'stu_no' },
    { title: '姓名', dataIndex: 'realname', key: 'realname' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '电话', dataIndex: 'phone', key: 'phone' },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (v: string) => getLabel('genders', v) || '-',
    },
    { title: '年龄', dataIndex: 'age', key: 'age' },
    { title: '班级', dataIndex: 'class_name', key: 'class_name', render: (v: string) => v || '-' },
    { title: '地址', dataIndex: 'address', key: 'address', ellipsis: true },
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
                content: `确定要删除学生"${record.realname}"吗？`,
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
        updateMutation.mutate({ ...values, id: editingRecord.id } as any)
      } else {
        createMutation.mutate(values as any)
      }
    })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>学生管理</Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => queryClient.invalidateQueries({ queryKey: ['students'] })}
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
            新增学生
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
        title={editingRecord ? '编辑学生' : '新增学生'}
        open={open}
        onOk={handleSubmit}
        onCancel={() => {
          setOpen(false)
          setEditingRecord(null)
          form.resetFields()
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={640}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="stu_no" label="学号" rules={[{ required: true }]}>
            <Input placeholder="请输入学号" />
          </Form.Item>
          <Form.Item name="realname" label="姓名" rules={[{ required: true }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="phone" label="电话">
            <Input placeholder="请输入电话" />
          </Form.Item>
          <Form.Item name="gender" label="性别">
            <Select options={getOptions('genders')} placeholder="请选择性别" allowClear />
          </Form.Item>
          <Form.Item name="age" label="年龄">
            <InputNumber min={1} max={150} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="class_id" label="所属班级">
            <Select
              placeholder="请选择班级"
              allowClear
              options={(classesData?.results || []).map(
                (c: { id: string; name: string; grade_display: string }) => ({
                  value: c.id,
                  label: `${c.grade_display}${c.name}`,
                }),
              )}
            />
          </Form.Item>
          <Form.Item name="address" label="家庭住址">
            <Input placeholder="请输入家庭住址" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default StudentProfilePage
