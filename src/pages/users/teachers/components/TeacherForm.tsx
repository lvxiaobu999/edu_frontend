import React from 'react'
import { Form, Input, InputNumber, Modal, Select } from 'antd'
import type { FormInstance } from 'antd/es/form'

interface Props {
  open: boolean
  isEdit: boolean
  form: FormInstance
  confirmLoading: boolean
  onOk: () => void
  onCancel: () => void
  groupOptions: { value: string; label: string }[]
  classOptions: { value: string; label: string }[]
  genderOptions: { value: string; label: string }[]
}

const TeacherForm: React.FC<Props> = ({
  open,
  isEdit,
  form,
  confirmLoading,
  onOk,
  onCancel,
  groupOptions,
  classOptions,
  genderOptions,
}) => (
  <Modal
    title={isEdit ? '编辑教师' : '新增教师'}
    open={open}
    onOk={onOk}
    onCancel={onCancel}
    confirmLoading={confirmLoading}
    width={640}
  >
    <Form form={form} layout="vertical">
      <Form.Item name="emp_no" label="工号" rules={[{ required: true }]}>
        <Input placeholder="请输入工号" />
      </Form.Item>
      <Form.Item name="realname" label="姓名" rules={[{ required: true }]}>
        <Input placeholder="请输入姓名" />
      </Form.Item>
      <Form.Item name="email" label="邮箱">
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      <Form.Item name="phone" label="电话">
        <Input placeholder="请输入电话" />
      </Form.Item>
      <Form.Item name="gender" label="性别">
        <Select options={genderOptions} placeholder="请选择性别" allowClear />
      </Form.Item>
      <Form.Item name="age" label="年龄">
        <InputNumber min={1} max={150} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="address" label="家庭住址">
        <Input placeholder="请输入家庭住址" />
      </Form.Item>
      <Form.Item name="research_groups" label="所属教研组">
        <Select mode="multiple" placeholder="请选择教研组" options={groupOptions} />
      </Form.Item>
      <Form.Item name="class_ids" label="所管班级">
        <Select mode="multiple" placeholder="请选择所管班级" options={classOptions} />
      </Form.Item>
    </Form>
  </Modal>
)

export default TeacherForm
