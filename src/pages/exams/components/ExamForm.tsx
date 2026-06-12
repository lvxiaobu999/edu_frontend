import React from 'react'
import { DatePicker, Form, Modal, Select } from 'antd'
import type { FormInstance } from 'antd/es/form'

interface Props {
  open: boolean
  isEdit: boolean
  form: FormInstance
  confirmLoading: boolean
  onOk: () => void
  onCancel: () => void
  typeOptions: { value: string; label: string }[]
  gradeOptions: { value: string; label: string }[]
  semesterOptions: { value: string; label: string }[]
}

const ExamForm: React.FC<Props> = ({
  open,
  isEdit,
  form,
  confirmLoading,
  onOk,
  onCancel,
  typeOptions,
  gradeOptions,
  semesterOptions,
}) => (
  <Modal
    title={isEdit ? '编辑考试' : '新增考试'}
    open={open}
    onOk={onOk}
    onCancel={onCancel}
    confirmLoading={confirmLoading}
  >
    <Form form={form} layout="vertical">
      <Form.Item
        name="exam_type"
        label="考试类型"
        rules={[{ required: true, message: '请选择考试类型' }]}
      >
        <Select options={typeOptions} placeholder="请选择考试类型" />
      </Form.Item>
      <Form.Item
        name="exam_date"
        label="考试日期"
        rules={[{ required: true, message: '请选择考试日期' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="grade" label="年级" rules={[{ required: true, message: '请选择年级' }]}>
        <Select options={gradeOptions} placeholder="请选择年级" />
      </Form.Item>
      <Form.Item name="semester" label="学期" rules={[{ required: true, message: '请选择学期' }]}>
        <Select options={semesterOptions} placeholder="请选择学期" />
      </Form.Item>
    </Form>
  </Modal>
)

export default ExamForm
