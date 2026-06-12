import React from 'react'
import { Button, Space, Typography } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { getClassesApi, getGradeClassApi } from '@/apis/classes'
import { useChoicesStore } from '@/store'
import { useStudentList } from './hooks/useStudentList'
import { useStudentForm } from './hooks/useStudentForm'
import StudentSearch from './components/StudentSearch'
import StudentTable from './components/StudentTable'
import StudentForm from './components/StudentForm'

const { Title } = Typography

const StudentProfilePage: React.FC = () => {
  const { getLabel, getOptions } = useChoicesStore()
  const {
    data,
    isLoading,
    pagination,
    searchInput,
    handleSearch,
    handleReset,
    handleSearchInputChange,
    handlePageChange,
  } = useStudentList()
  const { open, editingRecord, form, isPending, openForm, closeForm, handleSubmit, handleDelete } =
    useStudentForm()

  const { data: classesData } = useQuery({ queryKey: ['classes'], queryFn: () => getClassesApi() })
  const { data: gradeClassData } = useQuery({
    queryKey: ['grade-classes'],
    queryFn: () => getGradeClassApi(),
  })

  const classOptions = (gradeClassData || [])
    .filter(g => !searchInput.grade || g.grade_id === searchInput.grade)
    .flatMap(g =>
      g.classes.map(c => ({ value: c.class_id, label: `${g.grade_name}${c.class_name}` })),
    )

  const formClassOptions = (classesData?.results || []).map(
    (c: { id: string; name: string; grade_display: string }) => ({
      value: c.id,
      label: `${c.grade_display}${c.name}`,
    }),
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>学生管理</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm()}>
            新增学生
          </Button>
        </Space>
      </div>

      <StudentSearch
        searchInput={searchInput}
        gradeOptions={getOptions('grades')}
        classOptions={classOptions}
        onInputChange={handleSearchInputChange}
        onSearch={handleSearch}
      />

      <StudentTable
        dataSource={data?.results || []}
        loading={isLoading}
        pagination={{
          current: data?.page || pagination.current,
          pageSize: data?.pageSize || pagination.pageSize,
          total: data?.total || 0,
          onChange: handlePageChange,
        }}
        getLabel={getLabel}
        onEdit={openForm}
        onDelete={handleDelete}
      />

      <StudentForm
        open={open}
        isEdit={!!editingRecord}
        form={form}
        confirmLoading={isPending}
        onOk={handleSubmit}
        onCancel={closeForm}
        classOptions={formClassOptions}
        genderOptions={getOptions('genders')}
      />
    </div>
  )
}

export default StudentProfilePage
