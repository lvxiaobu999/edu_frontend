import React from 'react'
import { Button, Space, Tabs, Typography } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useChoicesStore } from '@/store'
import { useAdminList } from './hooks/useAdminList'
import { useAdminForm } from './hooks/useAdminForm'
import AdminTable from './components/AdminTable'
import AdminForm from './components/AdminForm'

const { Title } = Typography

const UserManagement: React.FC = () => {
  const { getLabel, getOptions } = useChoicesStore()
  const { data, isLoading, pagination, activeTab, setActiveTab, handleRefresh, handlePageChange } =
    useAdminList()
  const {
    open,
    editingUser,
    form,
    isPending,
    openForm,
    closeForm,
    handleSubmit,
    handleDelete,
    handleApprove,
  } = useAdminForm()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>用户管理</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm()}>
            新增用户
          </Button>
        </Space>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: 'all', label: '全部用户' },
          { key: 'pending', label: '待审核' },
        ]}
      />

      <AdminTable
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
        onApprove={handleApprove}
      />

      <AdminForm
        open={open}
        isEdit={!!editingUser}
        form={form}
        confirmLoading={isPending}
        onOk={handleSubmit}
        onCancel={closeForm}
        roleOptions={getOptions('roles')}
      />
    </div>
  )
}

export default UserManagement
