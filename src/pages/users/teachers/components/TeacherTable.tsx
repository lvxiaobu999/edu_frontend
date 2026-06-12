import React from 'react'
import { Button, Space, Table, Tag } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { TeacherDto } from '@/apis/types'

interface Props {
  dataSource: TeacherDto[]
  loading: boolean
  pagination: false | TablePaginationConfig
  getLabel: (type: 'genders' | 'roles' | 'grades' | 'exam_types', value: string) => string
  classMap: Map<string, string>
  onEdit: (record: TeacherDto) => void
  onDelete: (record: TeacherDto) => void
}

const TeacherTable: React.FC<Props> = ({
  dataSource,
  loading,
  pagination,
  getLabel,
  classMap,
  onEdit,
  onDelete,
}) => {
  const columns: ColumnsType<TeacherDto> = [
    { title: '工号', dataIndex: 'emp_no', key: 'emp_no' },
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
    { title: '地址', dataIndex: 'address', key: 'address', ellipsis: true },
    {
      title: '所属教研组',
      dataIndex: 'research_group_names',
      key: 'research_group_names',
      render: (names: string[]) => (names?.length ? names.map(n => <Tag key={n}>{n}</Tag>) : '-'),
    },
    {
      title: '所管班级',
      dataIndex: 'class_ids',
      key: 'class_ids',
      render: (ids: string[]) =>
        ids?.length ? ids.map(id => <Tag key={id}>{classMap.get(id) || id}</Tag>) : '-',
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
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

export default TeacherTable
