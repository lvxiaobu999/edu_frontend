import React from 'react'
import { Button, Modal, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { ClassesDto } from '@/apis/types'

interface Props {
  dataSource: ClassesDto[]
  loading: boolean
  pagination: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number, pageSize: number) => void
  }
  onEdit: (record: ClassesDto) => void
  onDelete: (record: ClassesDto) => void
}

const ClassesTable: React.FC<Props> = ({ dataSource, loading, pagination, onEdit, onDelete }) => {
  const columns: ColumnsType<ClassesDto> = [
    { title: '年级', dataIndex: 'grade_display', key: 'grade_display' },
    { title: '班级名称', dataIndex: 'name', key: 'name' },
    {
      title: '班主任',
      dataIndex: 'headmaster_name',
      key: 'headmaster_name',
      render: (v: string) => v || '未指定',
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Button
            type="link"
            danger
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: `确定要删除班级"${record.grade_display}${record.name}"吗？`,
                onOk: () => onDelete(record),
              })
            }}
          >
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

export default ClassesTable
