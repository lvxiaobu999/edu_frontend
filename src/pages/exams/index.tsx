import React from 'react'
import { Button, Space, Typography } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { getSemestersApi } from '@/apis/semester'
import { useChoicesStore } from '@/store'
import { useExamList } from './hooks/useExamList'
import { useExamForm } from './hooks/useExamForm'
import ExamSearch from './components/ExamSearch'
import ExamTable from './components/ExamTable'
import ExamForm from './components/ExamForm'

const { Title } = Typography

const ExamsManagement: React.FC = () => {
  const { getOptions } = useChoicesStore()
  const {
    data,
    isLoading,
    pagination,
    searchInput,
    handleSearch,
    handleReset,
    handleSearchInputChange,
    handlePageChange,
  } = useExamList()
  const { open, editingRecord, form, isPending, openForm, closeForm, handleSubmit, handleDelete } =
    useExamForm()

  const { data: semestersData } = useQuery({
    queryKey: ['semesters'],
    queryFn: () => getSemestersApi(),
  })

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>考试管理</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm()}>
            新增考试
          </Button>
        </Space>
      </div>

      <ExamSearch
        searchInput={searchInput}
        typeOptions={getOptions('exam_types')}
        gradeOptions={getOptions('grades')}
        semesterOptions={(semestersData?.results || []).map(s => ({
          value: s.id,
          label: s.display_name,
        }))}
        onInputChange={handleSearchInputChange}
        onSearch={handleSearch}
      />

      <ExamTable
        dataSource={data?.results || []}
        loading={isLoading}
        pagination={{
          current: data?.page || pagination.current,
          pageSize: data?.pageSize || pagination.pageSize,
          total: data?.total || 0,
          onChange: handlePageChange,
        }}
        onEdit={openForm}
        onDelete={handleDelete}
      />

      <ExamForm
        open={open}
        isEdit={!!editingRecord}
        form={form}
        confirmLoading={isPending}
        onOk={handleSubmit}
        onCancel={closeForm}
        typeOptions={getOptions('exam_types')}
        gradeOptions={getOptions('grades')}
        semesterOptions={(semestersData?.results || []).map(s => ({
          value: s.id,
          label: s.display_name,
        }))}
      />
    </div>
  )
}

export default ExamsManagement
