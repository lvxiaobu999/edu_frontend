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
  classOptions: { value: string; label: string }[]
  genderOptions: { value: string; label: string }[]
}

const StudentForm: React.FC<Props> = ({
  open,
  isEdit,
  form,
  confirmLoading,
  onOk,
  onCancel,
  classOptions,
  genderOptions,
}) => (
  <Modal
    title={isEdit ? '编辑学生' : '新增学生'}
    open={open}
    onOk={onOk}
    onCancel={onCancel}
    confirmLoading={confirmLoading}
    width={640}
  >
    <Form form={form} layout="vertical">
      <Form.Item name="stu_no" label="学号" rules={[{ required: true }]}>
        <Input placeholder="请输入学号" />
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
      <Form.Item name="class_id" label="所属班级">
        <Select placeholder="请选择班级" allowClear options={classOptions} />
      </Form.Item>
      <Form.Item name="address" label="家庭住址">
        <Input placeholder="请输入家庭住址" />
      </Form.Item>
    </Form>
  </Modal>
)

export default StudentForm
