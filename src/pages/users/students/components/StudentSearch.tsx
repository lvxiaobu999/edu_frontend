import React from 'react'
import { Button, Input, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

interface SearchInput {
  stu_no: string
  realname: string
  grade: string
  class_id: string
}

interface Props {
  searchInput: SearchInput
  gradeOptions: { value: string; label: string }[]
  classOptions: { value: string; label: string }[]
  onInputChange: (key: keyof SearchInput, value: string) => void
  onSearch: () => void
}

const StudentSearch: React.FC<Props> = ({
  searchInput,
  gradeOptions,
  classOptions,
  onInputChange,
  onSearch,
}) => (
  <div className="flex items-center gap-3 mb-4">
    <Input
      value={searchInput.stu_no}
      onChange={e => onInputChange('stu_no', e.target.value)}
      allowClear
      placeholder="学号"
      style={{ width: 140 }}
    />
    <Input
      value={searchInput.realname}
      onChange={e => onInputChange('realname', e.target.value)}
      allowClear
      placeholder="姓名"
      style={{ width: 140 }}
    />
    <Select
      value={searchInput.grade || undefined}
      onChange={v => {
        onInputChange('grade', v || '')
        onInputChange('class_id', '')
      }}
      allowClear
      placeholder="选择年级"
      style={{ width: 140 }}
      options={gradeOptions}
    />
    <Select
      value={searchInput.class_id || undefined}
      onChange={v => onInputChange('class_id', v || '')}
      allowClear
      placeholder="选择班级"
      style={{ width: 180 }}
      options={classOptions}
      showSearch
      optionFilterProp="label"
    />
    <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
      查询
    </Button>
  </div>
)

export default StudentSearch
