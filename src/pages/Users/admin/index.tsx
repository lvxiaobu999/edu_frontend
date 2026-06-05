import React, { useState } from 'react'
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  App,
  Tabs,
} from 'antd'
import { PlusOutlined, CheckOutlined, ReloadOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnsType } from 'antd/es/table'
import {
  getUsersApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  approveUserApi,
  getPendingUsersApi,
} from '@/apis/user'
import type { UserDto } from '@/apis/types'
import { useChoicesStore } from '@/store'

const { Title } = Typography

const UserManagement: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserDto | null>(null)
  const [activeTab, setActiveTab] = useState<string>('all')
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  const { getLabel, getOptions } = useChoicesStore()

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

  const { data, isLoading } = useQuery({
    queryKey: ['users', pagination, activeTab],
    queryFn: () => {
      if (activeTab === 'pending') {
        return getPendingUsersApi({ page: pagination.current, pageSize: pagination.pageSize })
      }
      return getUsersApi({ page: pagination.current, pageSize: pagination.pageSize })
    },
  })

  const createMutation = useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      message.success('创建成功')
      setOpen(false)
      form.resetFields()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => {
      const { id, ...rest } = data
      return updateUserApi(id as string, rest)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      message.success('更新成功')
      setOpen(false)
      setEditingUser(null)
      form.resetFields()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      message.success('删除成功')
    },
  })

  const approveMutation = useMutation({
    mutationFn: approveUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      message.success('审核通过')
    },
  })

  const columns: ColumnsType<UserDto> = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '真实姓名', dataIndex: 'real_name', key: 'real_name' },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const colors: Record<string, string> = { ADMIN: 'red', TEACHER: 'blue', STUDENT: 'green' }
        return <Tag color={colors[role] || 'default'}>{getLabel('roles', role) || role}</Tag>
      },
    },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '电话', dataIndex: 'phone', key: 'phone' },
    {
      title: '审核状态',
      dataIndex: 'is_approved',
      key: 'is_approved',
      render: (v: boolean) => <Tag color={v ? 'green' : 'orange'}>{v ? '已审核' : '待审核'}</Tag>,
    },
    {
      title: '启用',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (v: boolean) => <Tag color={v ? 'green' : 'red'}>{v ? '启用' : '禁用'}</Tag>,
    },
    { title: '注册时间', dataIndex: 'date_joined', key: 'date_joined' },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {!record.is_approved && (
            <Button
              type="link"
              icon={<CheckOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: '确认审核',
                  content: `审核通过用户"${record.username}"？`,
                  onOk: () => approveMutation.mutate(record.id),
                })
              }}
            >
              审核
            </Button>
          )}
          <Button
            type="link"
            onClick={() => {
              setEditingUser(record)
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
                content: `确定要删除用户"${record.username}"吗？`,
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
      if (editingUser) {
        updateMutation.mutate({ ...values, id: editingUser.id } as any)
      } else {
        createMutation.mutate(values as any)
      }
    })
  }

  const tabItems = [
    { key: 'all', label: '全部用户' },
    { key: 'pending', label: '待审核' },
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>用户管理</Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
          >
            刷新
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingUser(null)
              form.resetFields()
              setOpen(true)
            }}
          >
            新增用户
          </Button>
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

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
        title={editingUser ? '编辑用户' : '新增用户'}
        open={open}
        onOk={handleSubmit}
        onCancel={() => {
          setOpen(false)
          setEditingUser(null)
          form.resetFields()
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="password" label="密码">
            <Input.Password placeholder={editingUser ? '留空则不修改' : '请输入密码'} />
          </Form.Item>
          <Form.Item name="real_name" label="真实姓名">
            <Input placeholder="请输入真实姓名" />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Select options={getOptions('roles')} placeholder="请选择角色" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="phone" label="电话">
            <Input placeholder="请输入电话" />
          </Form.Item>
          <Form.Item name="is_approved" label="审核" valuePropName="checked" initialValue={false}>
            <Switch checkedChildren="已审核" unCheckedChildren="待审核" />
          </Form.Item>
          <Form.Item name="is_active" label="状态" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UserManagement
