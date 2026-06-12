import React from 'react'
import { Button, Space, Table } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { ExamDto } from '@/apis/types'

interface Props {
  dataSource: ExamDto[]
  loading: boolean
  pagination: false | TablePaginationConfig
  onEdit: (record: ExamDto) => void
  onDelete: (record: ExamDto) => void
}

const ExamTable: React.FC<Props> = ({ dataSource, loading, pagination, onEdit, onDelete }) => {
  const columns: ColumnsType<ExamDto> = [
    { title: '考试名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '考试类型', dataIndex: 'exam_type_display', key: 'exam_type' },
    { title: '年级', dataIndex: 'grade_display', key: 'grade' },
    { title: '学期', dataIndex: 'semester_display', key: 'semester' },
    { title: '考试日期', dataIndex: 'exam_date', key: 'exam_date' },
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

export default ExamTable
