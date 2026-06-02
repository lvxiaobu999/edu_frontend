import React, { useState } from 'react'
import { Button, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Typography, App } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnsType } from 'antd/es/table'
import { getStudentProfileApi, saveStudentProfileApi } from '@/apis/student'
import { getClassesApi } from '@/apis/classes'
import type { StudentProfileDto } from '@/apis/types'
import { GenderLabel, GenderOptions } from '@/apis/types'

const { Title } = Typography

const StudentProfilePage: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['student-profile'],
    queryFn: () => getStudentProfileApi().then(res => (res as any).data as StudentProfileDto),
  })

  const { data: classesData } = useQuery({
    queryKey: ['classes'],
    queryFn: () => getClassesApi().then(res => (res as any).data),
  })

  const saveMutation = useMutation({
    mutationFn: saveStudentProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-profile'] })
      message.success('保存成功')
      setOpen(false)
    },
  })

  const columns: ColumnsType<StudentProfileDto> = [
    { title: '学号', dataIndex: 'stu_no', key: 'stu_no' },
    { title: '姓名', dataIndex: 'realname', key: 'realname' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '电话', dataIndex: 'phone', key: 'phone' },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (v: string) => GenderLabel[v as keyof typeof GenderLabel] || '-',
    },
    { title: '年龄', dataIndex: 'age', key: 'age' },
    { title: '班级', dataIndex: 'class_name', key: 'class_name', render: (v: string) => v || '-' },
    { title: '地址', dataIndex: 'address', key: 'address', ellipsis: true },
  ]

  const handleSubmit = () => {
    form.validateFields().then(values => {
      saveMutation.mutate(values as any)
    })
  }

  const profile = data

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>学生简介</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>刷新</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              if (profile) form.setFieldsValue(profile)
              else form.resetFields()
              setOpen(true)
            }}
          >
            {profile ? '编辑简介' : '完善简介'}
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={profile ? [profile] : []}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />

      <Modal
        title={profile ? '编辑学生简介' : '完善学生简介'}
        open={open}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
        confirmLoading={saveMutation.isPending}
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
            <Select options={GenderOptions} placeholder="请选择性别" allowClear />
          </Form.Item>
          <Form.Item name="age" label="年龄">
            <InputNumber min={1} max={150} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="class_id" label="所属班级">
            <Select
              placeholder="请选择班级"
              allowClear
              options={(classesData?.list || []).map((c: { id: string; name: string; grade_display: string }) => ({
                value: c.id,
                label: `${c.grade_display}${c.name}`,
              }))}
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
