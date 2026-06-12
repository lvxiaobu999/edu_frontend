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

const SubjectForm: React.FC<Props> = ({ open, isEdit, form, confirmLoading, onOk, onCancel }) => (
  <Modal
    title={isEdit ? '编辑科目' : '新增科目'}
    open={open}
    onOk={onOk}
    onCancel={onCancel}
    confirmLoading={confirmLoading}
  >
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label="科目名称"
        rules={[{ required: true, message: '请输入科目名称' }]}
      >
        <Input placeholder="请输入科目名称" />
      </Form.Item>
    </Form>
  </Modal>
)

export default SubjectForm
