import React from 'react'
import { Button, Space, Table } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { ScoreDto } from '@/apis/types'

interface Props {
  dataSource: ScoreDto[]
  loading: boolean
  pagination: false | TablePaginationConfig
  onEdit: (record: ScoreDto) => void
  onDelete: (record: ScoreDto) => void
}

const ScoreTable: React.FC<Props> = ({ dataSource, loading, pagination, onEdit, onDelete }) => {
  const columns: ColumnsType<ScoreDto> = [
    { title: '学生', dataIndex: 'student_name', key: 'student_name' },
    { title: '学号', dataIndex: 'student_no', key: 'student_no' },
    { title: '考试', dataIndex: 'exam_name', key: 'exam', ellipsis: true },
    { title: '科目', dataIndex: 'subject_name', key: 'subject' },
    {
      title: '成绩',
      dataIndex: 'score',
      key: 'score',
      render: (v: number) => <span className="font-medium">{v}</span>,
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

export default ScoreTable
