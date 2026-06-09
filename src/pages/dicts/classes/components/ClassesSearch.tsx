import React from 'react'
import { Button, Input, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

interface SearchFilters {
  grade: string
  name: string
  headmaster: string
}

interface Props {
  searchInput: SearchFilters
  onSearchInputChange: (key: keyof SearchFilters, value: string) => void
  onSearch: () => void
  gradeOptions: { value: string; label: string }[]
}

const ClassesSearch: React.FC<Props> = ({
  searchInput,
  onSearchInputChange,
  onSearch,
  gradeOptions,
}) => (
  <div className="flex items-center gap-3 mb-4">
    <Select
      value={searchInput.grade || undefined}
      onChange={v => onSearchInputChange('grade', v || '')}
      allowClear
      placeholder="选择年级"
      style={{ width: 140 }}
      options={gradeOptions}
    />
    <Input
      value={searchInput.name}
      onChange={e => onSearchInputChange('name', e.target.value)}
      allowClear
      placeholder="班级名称"
      style={{ width: 160 }}
    />
    <Input
      value={searchInput.headmaster}
      onChange={e => onSearchInputChange('headmaster', e.target.value)}
      allowClear
      placeholder="班主任"
      style={{ width: 160 }}
    />
    <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
      查询
    </Button>
  </div>
)

export default ClassesSearch
