import React from 'react'
import { Form, InputNumber, Modal, Select } from 'antd'
import type { FormInstance } from 'antd/es/form'

interface Props {
  open: boolean
  isEdit: boolean
  form: FormInstance
  confirmLoading: boolean
  onOk: () => void
  onCancel: () => void
  studentOptions: { value: string; label: string }[]
  examOptions: { value: string; label: string }[]
  subjectOptions: { value: string; label: string }[]
}

const ScoreForm: React.FC<Props> = ({
  open,
  isEdit,
  form,
  confirmLoading,
  onOk,
  onCancel,
  studentOptions,
  examOptions,
  subjectOptions,
}) => (
  <Modal
    title={isEdit ? '编辑成绩' : '录入成绩'}
    open={open}
    onOk={onOk}
    onCancel={onCancel}
    confirmLoading={confirmLoading}
  >
    <Form form={form} layout="vertical">
      <Form.Item name="student" label="学生" rules={[{ required: true, message: '请选择学生' }]}>
        <Select
          options={studentOptions}
          placeholder="请选择学生"
          showSearch
          optionFilterProp="label"
        />
      </Form.Item>
      <Form.Item name="exam" label="考试" rules={[{ required: true, message: '请选择考试' }]}>
        <Select
          options={examOptions}
          placeholder="请选择考试"
          showSearch
          optionFilterProp="label"
        />
      </Form.Item>
      <Form.Item name="subject" label="科目" rules={[{ required: true, message: '请选择科目' }]}>
        <Select options={subjectOptions} placeholder="请选择科目" />
      </Form.Item>
      <Form.Item name="score" label="成绩" rules={[{ required: true, message: '请输入成绩' }]}>
        <InputNumber
          min={0}
          max={999.9}
          step={0.5}
          style={{ width: '100%' }}
          placeholder="请输入成绩"
        />
      </Form.Item>
    </Form>
  </Modal>
)

export default ScoreForm
