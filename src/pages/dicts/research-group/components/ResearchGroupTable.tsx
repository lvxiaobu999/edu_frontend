import React from 'react'
import { Button, Space, Table } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { ResearchGroupDto } from '@/apis/types'

interface Props {
  dataSource: ResearchGroupDto[]
  loading: boolean
  pagination: false | TablePaginationConfig
  onEdit: (record: ResearchGroupDto) => void
  onDelete: (record: ResearchGroupDto) => void
}

const ResearchGroupTable: React.FC<Props> = ({
  dataSource,
  loading,
  pagination,
  onEdit,
  onDelete,
}) => {
  const columns: ColumnsType<ResearchGroupDto> = [
    { title: '教研组名称', dataIndex: 'name', key: 'name' },
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

export default ResearchGroupTable
