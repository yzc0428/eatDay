// LocalStorage 工具类
class Storage {
  // 获取数据
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error)
      return null
    }
  }

  // 设置数据
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting item ${key} to localStorage:`, error)
    }
  }

  // 删除数据
  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error)
    }
  }

  // 清空所有数据
  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
}

export const storage = new Storage()

// Storage keys
export const STORAGE_KEYS = {
  DISHES: 'eatday_dishes',
  ORDERS: 'eatday_orders',
  FAVORITES: 'eatday_favorites',
}

// 兼容函数式导出
export const getFromStorage = <T>(key: string): T | null => {
  return storage.get<T>(key)
}

export const saveToStorage = <T>(key: string, value: T): void => {
  storage.set<T>(key, value)
}
