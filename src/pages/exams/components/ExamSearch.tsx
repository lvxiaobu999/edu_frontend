import React from 'react'
import { Button, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

interface SearchInput {
  exam_type: string
  grade: string
  semester: string
}

interface Props {
  searchInput: SearchInput
  typeOptions: { value: string; label: string }[]
  gradeOptions: { value: string; label: string }[]
  semesterOptions: { value: string; label: string }[]
  onInputChange: (key: keyof SearchInput, value: string) => void
  onSearch: () => void
}

const ExamSearch: React.FC<Props> = ({
  searchInput,
  typeOptions,
  gradeOptions,
  semesterOptions,
  onInputChange,
  onSearch,
}) => (
  <div className="flex items-center gap-3 mb-4">
    <Select
      value={searchInput.exam_type || undefined}
      onChange={v => onInputChange('exam_type', v || '')}
      allowClear
      placeholder="考试类型"
      style={{ width: 140 }}
      options={typeOptions}
    />
    <Select
      value={searchInput.grade || undefined}
      onChange={v => onInputChange('grade', v || '')}
      allowClear
      placeholder="年级"
      style={{ width: 140 }}
      options={gradeOptions}
    />
    <Select
      value={searchInput.semester || undefined}
      onChange={v => onInputChange('semester', v || '')}
      allowClear
      placeholder="学期"
      style={{ width: 200 }}
      options={semesterOptions}
    />
    <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
      查询
    </Button>
  </div>
)

export default ExamSearch
