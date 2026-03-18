import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'

interface SearchBarProps {
  onSearch: (keyword: string) => void
  placeholder?: string
}

const SearchBar = ({ onSearch, placeholder = '搜索菜品名称...' }: SearchBarProps) => {
  const [keyword, setKeyword] = useState('')

  // 防抖处理
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(keyword)
    }, 300)

    return () => clearTimeout(timer)
  }, [keyword, onSearch])

  return (
    <Input
      size="large"
      placeholder={placeholder}
      prefix={<SearchOutlined />}
      value={keyword}
      onChange={e => setKeyword(e.target.value)}
      allowClear
      style={{ maxWidth: 400 }}
    />
  )
}

export default SearchBar
