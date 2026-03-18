import { Space, Button, DatePicker } from 'antd'
import { getTodayStart, getWeekStart, getMonthStart } from '@/utils/date'
import dayjs, { Dayjs } from 'dayjs'

const { RangePicker } = DatePicker

interface DateFilterProps {
  dateRange: [number, number] | null
  onDateRangeChange: (range: [number, number] | null) => void
}

const DateFilter = ({ dateRange, onDateRangeChange }: DateFilterProps) => {
  const handleQuickSelect = (type: 'today' | 'week' | 'month' | 'all') => {
    const now = Date.now()
    switch (type) {
      case 'today':
        onDateRangeChange([getTodayStart(), now])
        break
      case 'week':
        onDateRangeChange([getWeekStart(), now])
        break
      case 'month':
        onDateRangeChange([getMonthStart(), now])
        break
      case 'all':
        onDateRangeChange(null)
        break
    }
  }

  const handleRangeChange = (dates: null | [Dayjs | null, Dayjs | null]) => {
    if (!dates || !dates[0] || !dates[1]) {
      onDateRangeChange(null)
      return
    }
    onDateRangeChange([dates[0].startOf('day').valueOf(), dates[1].endOf('day').valueOf()])
  }

  return (
    <Space wrap>
      <Button onClick={() => handleQuickSelect('today')}>今天</Button>
      <Button onClick={() => handleQuickSelect('week')}>本周</Button>
      <Button onClick={() => handleQuickSelect('month')}>本月</Button>
      <Button onClick={() => handleQuickSelect('all')}>全部</Button>
      <RangePicker
        value={
          dateRange
            ? [dayjs(dateRange[0]), dayjs(dateRange[1])]
            : null
        }
        onChange={handleRangeChange}
        placeholder={['开始日期', '结束日期']}
      />
    </Space>
  )
}

export default DateFilter
