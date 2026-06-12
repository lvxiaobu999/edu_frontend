import React from 'react'
import { Form, Input, Modal, Select, Switch } from 'antd'
import type { FormInstance } from 'antd/es/form'

interface Props {
  open: boolean
  isEdit: boolean
  form: FormInstance
  confirmLoading: boolean
  onOk: () => void
  onCancel: () => void
  roleOptions: { value: string; label: string }[]
}

const AdminForm: React.FC<Props> = ({
  open,
  isEdit,
  form,
  confirmLoading,
  onOk,
  onCancel,
  roleOptions,
}) => (
  <Modal
    title={isEdit ? '编辑用户' : '新增用户'}
    open={open}
    onOk={onOk}
    onCancel={onCancel}
    confirmLoading={confirmLoading}
    width={600}
  >
    <Form form={form} layout="vertical">
      <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item name="password" label="密码">
        <Input.Password placeholder={isEdit ? '留空则不修改' : '请输入密码'} />
      </Form.Item>
      <Form.Item name="real_name" label="真实姓名">
        <Input placeholder="请输入真实姓名" />
      </Form.Item>
      <Form.Item name="role" label="角色" rules={[{ required: true }]}>
        <Select options={roleOptions} placeholder="请选择角色" />
      </Form.Item>
      <Form.Item name="email" label="邮箱">
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      <Form.Item name="phone" label="电话">
        <Input placeholder="请输入电话" />
      </Form.Item>
      <Form.Item name="is_approved" label="审核" valuePropName="checked" initialValue={false}>
        <Switch checkedChildren="已审核" unCheckedChildren="待审核" />
      </Form.Item>
      <Form.Item name="is_active" label="状态" valuePropName="checked" initialValue={true}>
        <Switch checkedChildren="启用" unCheckedChildren="禁用" />
      </Form.Item>
    </Form>
  </Modal>
)

export default AdminForm
