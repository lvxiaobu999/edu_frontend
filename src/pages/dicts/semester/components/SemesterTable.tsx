import React from 'react'
import { Button, Space, Table } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { SemesterDto } from '@/apis/types'

interface Props {
  dataSource: SemesterDto[]
  loading: boolean
  pagination: false | TablePaginationConfig
  onEdit: (record: SemesterDto) => void
  onDelete: (record: SemesterDto) => void
}

const SemesterTable: React.FC<Props> = ({ dataSource, loading, pagination, onEdit, onDelete }) => {
  const columns: ColumnsType<SemesterDto> = [
    { title: '学期标识', dataIndex: 'name', key: 'name' },
    { title: '展示名称', dataIndex: 'display_name', key: 'display_name' },
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

export default SemesterTable
