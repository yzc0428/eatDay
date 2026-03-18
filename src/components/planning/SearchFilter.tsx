import { useState } from 'react'
import './SearchFilter.css'

interface SearchFilterProps {
  onSearch: (keyword: string) => void
  onDateRangeChange: (startDate: string, endDate: string) => void
  onClearFilters: () => void
}

const SearchFilter = ({ onSearch, onDateRangeChange, onClearFilters }: SearchFilterProps) => {
  const [keyword, setKeyword] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleKeywordChange = (value: string) => {
    setKeyword(value)
    onSearch(value)
  }

  const handleStartDateChange = (value: string) => {
    setStartDate(value)
    onDateRangeChange(value, endDate)
  }

  const handleEndDateChange = (value: string) => {
    setEndDate(value)
    onDateRangeChange(startDate, value)
  }

  const handleClear = () => {
    setKeyword('')
    setStartDate('')
    setEndDate('')
    onClearFilters()
  }

  return (
    <div className="search-filter">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="搜索计划ID、备注、物品名称..."
          value={keyword}
          onChange={(e) => handleKeywordChange(e.target.value)}
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="date-range-wrapper">
        <label className="date-label">创建时间：</label>
        <input
          type="date"
          className="date-input"
          value={startDate}
          onChange={(e) => handleStartDateChange(e.target.value)}
        />
        <span className="date-separator">至</span>
        <input
          type="date"
          className="date-input"
          value={endDate}
          onChange={(e) => handleEndDateChange(e.target.value)}
        />
      </div>

      {(keyword || startDate || endDate) && (
        <button className="clear-filter-btn" onClick={handleClear}>
          清除筛选
        </button>
      )}
    </div>
  )
}

export default SearchFilter
