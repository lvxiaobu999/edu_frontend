import React from 'react'
import { Button, Space, Typography } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useSemesterList } from './hooks/useSemesterList'
import { useSemesterForm } from './hooks/useSemesterForm'
import SemesterTable from './components/SemesterTable'
import SemesterForm from './components/SemesterForm'

const { Title } = Typography

const SemesterDict: React.FC = () => {
  const { data, isLoading, pagination, handleRefresh, handlePageChange } = useSemesterList()
  const { open, editingRecord, form, isPending, openForm, closeForm, handleSubmit, handleDelete } =
    useSemesterForm()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>学期管理</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm()}>
            新增学期
          </Button>
        </Space>
      </div>

      <SemesterTable
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

      <SemesterForm
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

export default SemesterDict
