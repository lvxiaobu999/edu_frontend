import React from 'react'
import { Button, Space, Typography } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { getExamsApi } from '@/apis/exam'
import { getSubjectsApi } from '@/apis/subject'
import { getAllStudentsApi } from '@/apis/student'
import { useScoreList } from './hooks/useScoreList'
import { useScoreForm } from './hooks/useScoreForm'
import ScoreSearch from './components/ScoreSearch'
import ScoreTable from './components/ScoreTable'
import ScoreForm from './components/ScoreForm'

const { Title } = Typography

const ScoresManagement: React.FC = () => {
  const {
    data,
    isLoading,
    pagination,
    searchInput,
    handleSearch,
    handleReset,
    handleSearchInputChange,
    handlePageChange,
  } = useScoreList()
  const { open, editingRecord, form, isPending, openForm, closeForm, handleSubmit, handleDelete } =
    useScoreForm()

  const { data: examsData } = useQuery({ queryKey: ['exams'], queryFn: () => getExamsApi() })
  const { data: subjectsData } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => getSubjectsApi(),
  })
  const { data: studentsData } = useQuery({
    queryKey: ['students'],
    queryFn: () => getAllStudentsApi(),
  })

  const examOptions = (examsData?.results || []).map((e: { id: string; name: string }) => ({
    value: e.id,
    label: e.name,
  }))
  const subjectOptions = (subjectsData?.results || []).map((s: { id: string; name: string }) => ({
    value: s.id,
    label: s.name,
  }))
  const studentOptions = (studentsData?.results || []).map(
    (s: { id: string; realname: string; stu_no: string }) => ({
      value: s.id,
      label: `${s.realname} (${s.stu_no})`,
    }),
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>成绩管理</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm()}>
            录入成绩
          </Button>
        </Space>
      </div>

      <ScoreSearch
        searchInput={searchInput}
        examOptions={examOptions}
        subjectOptions={subjectOptions}
        onInputChange={handleSearchInputChange}
        onSearch={handleSearch}
      />

      <ScoreTable
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

      <ScoreForm
        open={open}
        isEdit={!!editingRecord}
        form={form}
        confirmLoading={isPending}
        onOk={handleSubmit}
        onCancel={closeForm}
        studentOptions={studentOptions}
        examOptions={examOptions}
        subjectOptions={subjectOptions}
      />
    </div>
  )
}

export default ScoresManagement
