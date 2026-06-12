import React from 'react'
import { Button, Space, Typography } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useSubjectList } from './hooks/useSubjectList'
import { useSubjectForm } from './hooks/useSubjectForm'
import SubjectTable from './components/SubjectTable'
import SubjectForm from './components/SubjectForm'

const { Title } = Typography

const SubjectDict: React.FC = () => {
  const { data, isLoading, pagination, handleRefresh, handlePageChange } = useSubjectList()
  const { open, editingRecord, form, isPending, openForm, closeForm, handleSubmit, handleDelete } =
    useSubjectForm()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>科目管理</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm()}>
            新增科目
          </Button>
        </Space>
      </div>

      <SubjectTable
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

      <SubjectForm
        open={open}
        isEdit={!!editingRecord}
        form={form}
        confirmLoading={isPending}
        onOk={handleSubmit}
        onCancel={closeForm}
      />
    </div>
  )
}

export default SubjectDict
