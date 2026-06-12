import React from 'react'
import { Button, Space, Table } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { SubjectDto } from '@/apis/types'

interface Props {
  dataSource: SubjectDto[]
  loading: boolean
  pagination: false | TablePaginationConfig
  onEdit: (record: SubjectDto) => void
  onDelete: (record: SubjectDto) => void
}

const SubjectTable: React.FC<Props> = ({ dataSource, loading, pagination, onEdit, onDelete }) => {
  const columns: ColumnsType<SubjectDto> = [
    { title: '科目名称', dataIndex: 'name', key: 'name' },
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

export default SubjectTable
