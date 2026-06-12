import React from 'react'
import { Button, Space, Typography } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { getResearchGroupsApi } from '@/apis/research-group'
import { getClassesApi } from '@/apis/classes'
import { useChoicesStore } from '@/store'
import { useTeacherList } from './hooks/useTeacherList'
import { useTeacherForm } from './hooks/useTeacherForm'
import TeacherSearch from './components/TeacherSearch'
import TeacherTable from './components/TeacherTable'
import TeacherForm from './components/TeacherForm'

const { Title } = Typography

const TeacherProfilePage: React.FC = () => {
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
  } = useTeacherList()
  const { open, editingRecord, form, isPending, openForm, closeForm, handleSubmit, handleDelete } =
    useTeacherForm()

  const { data: groupsData } = useQuery({
    queryKey: ['research-groups'],
    queryFn: () => getResearchGroupsApi(),
  })
  const { data: classesData } = useQuery({ queryKey: ['classes'], queryFn: () => getClassesApi() })

  const classMap = new Map(
    (classesData?.results || []).map((c: { id: string; name: string; grade_display: string }) => [
      c.id,
      `${c.grade_display}${c.name}`,
    ]),
  )
  const groupOptions = (groupsData?.results || []).map((g: { id: string; name: string }) => ({
    value: g.id,
    label: g.name,
  }))
  const classOptions = (classesData?.results || []).map(
    (c: { id: string; name: string; grade_display: string }) => ({
      value: c.id,
      label: `${c.grade_display}${c.name}`,
    }),
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>教师管理</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm()}>
            新增教师
          </Button>
        </Space>
      </div>

      <TeacherSearch
        searchInput={searchInput}
        onInputChange={handleSearchInputChange}
        onSearch={handleSearch}
      />

      <TeacherTable
        dataSource={data?.results || []}
        loading={isLoading}
        pagination={{
          current: data?.page || pagination.current,
          pageSize: data?.pageSize || pagination.pageSize,
          total: data?.total || 0,
          onChange: handlePageChange,
        }}
        getLabel={getLabel}
        classMap={classMap}
        onEdit={openForm}
        onDelete={handleDelete}
      />

      <TeacherForm
        open={open}
        isEdit={!!editingRecord}
        form={form}
        confirmLoading={isPending}
        onOk={handleSubmit}
        onCancel={closeForm}
        groupOptions={groupOptions}
        classOptions={classOptions}
        genderOptions={getOptions('genders')}
      />
    </div>
  )
}

export default TeacherProfilePage
