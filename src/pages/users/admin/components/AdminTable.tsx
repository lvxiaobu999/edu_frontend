import React from 'react'
import { Button, Space, Table, Tag } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { UserDto } from '@/apis/types'

interface Props {
  dataSource: UserDto[]
  loading: boolean
  pagination: false | TablePaginationConfig
  getLabel: (type: 'genders' | 'roles' | 'grades' | 'exam_types', value: string) => string
  onEdit: (record: UserDto) => void
  onDelete: (record: UserDto) => void
  onApprove: (record: UserDto) => void
}

const AdminTable: React.FC<Props> = ({
  dataSource,
  loading,
  pagination,
  getLabel,
  onEdit,
  onDelete,
  onApprove,
}) => {
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
            <Button type="link" icon={<CheckOutlined />} onClick={() => onApprove(record)}>
              审核
            </Button>
          )}
          <Button type="link" onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => onDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      loading={loading}
      pagination={pagination}
    />
  )
}

export default AdminTable
