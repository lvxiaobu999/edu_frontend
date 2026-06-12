import React from 'react'
import { Form, Input, Modal, Select } from 'antd'
import type { FormInstance } from 'antd/es/form'

interface Props {
  open: boolean
  isEdit: boolean
  form: FormInstance
  confirmLoading: boolean
  onOk: () => void
  onCancel: () => void
  gradeOptions: { value: string; label: string }[]
}

const ClassesForm: React.FC<Props> = ({
  open,
  isEdit,
  form,
  confirmLoading,
  onOk,
  onCancel,
  gradeOptions,
}) => (
  <Modal
    title={isEdit ? '编辑班级' : '新增班级'}
    open={open}
    onOk={onOk}
    onCancel={onCancel}
    confirmLoading={confirmLoading}
  >
    <Form form={form} layout="vertical">
      <Form.Item name="grade" label="年级" rules={[{ required: true, message: '请选择年级' }]}>
        <Select options={gradeOptions} placeholder="请选择年级" />
      </Form.Item>
      <Form.Item
        name="name"
        label="班级名称"
        rules={[{ required: true, message: '请输入班级名称' }]}
      >
        <Input placeholder="如：1班" />
      </Form.Item>
    </Form>
  </Modal>
)

export default ClassesForm
