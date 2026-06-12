import React from 'react'
import { Form, Input, Modal } from 'antd'
import type { FormInstance } from 'antd/es/form'

interface Props {
  open: boolean
  isEdit: boolean
  form: FormInstance
  confirmLoading: boolean
  onOk: () => void
  onCancel: () => void
}

const SemesterForm: React.FC<Props> = ({ open, isEdit, form, confirmLoading, onOk, onCancel }) => (
  <Modal
    title={isEdit ? '编辑学期' : '新增学期'}
    open={open}
    onOk={onOk}
    onCancel={onCancel}
    confirmLoading={confirmLoading}
  >
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label="学期标识"
        rules={[{ required: true, message: '请输入学期标识' }]}
      >
        <Input placeholder="如：2025-2026-1" />
      </Form.Item>
      <Form.Item
        name="display_name"
        label="展示名称"
        rules={[{ required: true, message: '请输入展示名称' }]}
      >
        <Input placeholder="如：2025-2026学年第一学期" />
      </Form.Item>
    </Form>
  </Modal>
)

export default SemesterForm
