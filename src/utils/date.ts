// 日期格式化工具

// 格式化日期为 YYYY-MM-DD HH:mm:ss
export const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 格式化日期为 YYYY-MM-DD
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// 格式化为相对时间（如：刚刚、5分钟前、昨天等）
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < 2 * day) {
    return '昨天'
  } else if (diff < 7 * day) {
    return `${Math.floor(diff / day)}天前`
  } else {
    return formatDate(timestamp)
  }
}

// 获取今天的开始时间戳
export const getTodayStart = (): number => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today.getTime()
}

// 获取今天的结束时间戳
export const getTodayEnd = (): number => {
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  return today.getTime()
}

// 获取本周的开始时间戳
export const getWeekStart = (): number => {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1) // 周一为一周的开始
  const weekStart = new Date(today.setDate(diff))
  weekStart.setHours(0, 0, 0, 0)
  return weekStart.getTime()
}

// 获取本月的开始时间戳
export const getMonthStart = (): number => {
  const today = new Date()
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  monthStart.setHours(0, 0, 0, 0)
  return monthStart.getTime()
}
