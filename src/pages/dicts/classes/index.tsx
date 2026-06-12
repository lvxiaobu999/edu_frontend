import React from 'react'
import { Button, Space, Typography } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useChoicesStore } from '@/store'
import { useClassesList } from './hooks/useClassesList'
import { useClassesForm } from './hooks/useClassesForm'
import ClassesSearch from './components/ClassesSearch'
import ClassesTable from './components/ClassesTable'
import ClassesForm from './components/ClassesForm'

const { Title } = Typography

const ClassesManagement: React.FC = () => {
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
  } = useClassesList()
  const { open, editingRecord, form, isPending, openForm, closeForm, handleSubmit, handleDelete } =
    useClassesForm()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>班级管理</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm()}>
            新增班级
          </Button>
        </Space>
      </div>

      <ClassesSearch
        searchInput={searchInput}
        onSearchInputChange={handleSearchInputChange}
        onSearch={handleSearch}
        gradeOptions={getOptions('grades')}
      />

      <ClassesTable
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

      <ClassesForm
        open={open}
        isEdit={!!editingRecord}
        form={form}
        confirmLoading={isPending}
        onOk={handleSubmit}
        onCancel={closeForm}
        gradeOptions={getOptions('grades')}
      />
    </div>
  )
}

export default ClassesManagement
