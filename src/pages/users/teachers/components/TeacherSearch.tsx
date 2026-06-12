import React from 'react'
import { Button, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

interface SearchInput {
  emp_no: string
  realname: string
}

interface Props {
  searchInput: SearchInput
  onInputChange: (key: keyof SearchInput, value: string) => void
  onSearch: () => void
}

const TeacherSearch: React.FC<Props> = ({ searchInput, onInputChange, onSearch }) => (
  <div className="flex items-center gap-3 mb-4">
    <Input
      value={searchInput.emp_no}
      onChange={e => onInputChange('emp_no', e.target.value)}
      allowClear
      placeholder="工号"
      style={{ width: 140 }}
    />
    <Input
      value={searchInput.realname}
      onChange={e => onInputChange('realname', e.target.value)}
      allowClear
      placeholder="姓名"
      style={{ width: 140 }}
    />
    <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
      查询
    </Button>
  </div>
)

export default TeacherSearch
