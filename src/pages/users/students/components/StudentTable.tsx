import React from 'react'
import { Button, Space, Table } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { StudentDto } from '@/apis/types'

interface Props {
  dataSource: StudentDto[]
  loading: boolean
  pagination: false | TablePaginationConfig
  getLabel: (type: 'genders' | 'roles' | 'grades' | 'exam_types', value: string) => string
  onEdit: (record: StudentDto) => void
  onDelete: (record: StudentDto) => void
}

const StudentTable: React.FC<Props> = ({
  dataSource,
  loading,
  pagination,
  getLabel,
  onEdit,
  onDelete,
}) => {
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
    {
      title: '班级',
      dataIndex: 'class_name',
      key: 'class_name',
      render: (v: string, r: StudentDto) => r.grade_display + v || '-',
    },
    { title: '地址', dataIndex: 'address', key: 'address', ellipsis: true },
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

export default StudentTable
