import React from 'react'
import { Button, Input, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

interface SearchInput {
  exam: string
  subject: string
  student: string
}

interface Props {
  searchInput: SearchInput
  examOptions: { value: string; label: string }[]
  subjectOptions: { value: string; label: string }[]
  onInputChange: (key: keyof SearchInput, value: string) => void
  onSearch: () => void
}

const ScoreSearch: React.FC<Props> = ({
  searchInput,
  examOptions,
  subjectOptions,
  onInputChange,
  onSearch,
}) => (
  <div className="flex items-center gap-3 mb-4">
    <Select
      value={searchInput.exam || undefined}
      onChange={v => onInputChange('exam', v || '')}
      allowClear
      placeholder="选择考试"
      style={{ width: 240 }}
      options={examOptions}
      showSearch
      optionFilterProp="label"
    />
    <Select
      value={searchInput.subject || undefined}
      onChange={v => onInputChange('subject', v || '')}
      allowClear
      placeholder="选择科目"
      style={{ width: 160 }}
      options={subjectOptions}
    />
    <Input
      value={searchInput.student}
      onChange={e => onInputChange('student', e.target.value)}
      allowClear
      placeholder="学生姓名"
      style={{ width: 140 }}
    />
    <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
      查询
    </Button>
  </div>
)

export default ScoreSearch
