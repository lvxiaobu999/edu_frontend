import React from 'react'
import { Button, Space, Typography } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useResearchGroupList } from './hooks/useResearchGroupList'
import { useResearchGroupForm } from './hooks/useResearchGroupForm'
import ResearchGroupTable from './components/ResearchGroupTable'
import ResearchGroupForm from './components/ResearchGroupForm'

const { Title } = Typography

const ResearchGroup: React.FC = () => {
  const { data, isLoading, pagination, handleRefresh, handlePageChange } = useResearchGroupList()
  const { open, editingRecord, form, isPending, openForm, closeForm, handleSubmit, handleDelete } =
    useResearchGroupForm()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>教研组管理</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm()}>
            新增教研组
          </Button>
        </Space>
      </div>

      <ResearchGroupTable
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

      <ResearchGroupForm
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

export default ResearchGroup
