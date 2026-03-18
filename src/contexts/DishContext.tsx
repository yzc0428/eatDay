import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Dish } from '@/types'
import { storage, STORAGE_KEYS } from '@/utils/storage'

interface DishContextType {
  dishes: Dish[]
  addDish: (dish: Omit<Dish, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateDish: (id: string, dish: Partial<Dish>) => void
  deleteDish: (id: string) => void
  getDishById: (id: string) => Dish | undefined
}

const DishContext = createContext<DishContextType | undefined>(undefined)

export const DishProvider = ({ children }: { children: ReactNode }) => {
  const [dishes, setDishes] = useState<Dish[]>([])

  // 从 LocalStorage 加载数据
  useEffect(() => {
    const savedDishes = storage.get<Dish[]>(STORAGE_KEYS.DISHES)
    if (savedDishes) {
      setDishes(savedDishes)
    }
  }, [])

  // 保存数据到 LocalStorage
  useEffect(() => {
    if (dishes.length > 0 || storage.get<Dish[]>(STORAGE_KEYS.DISHES)) {
      storage.set(STORAGE_KEYS.DISHES, dishes)
    }
  }, [dishes])

  const addDish = (dishData: Omit<Dish, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDish: Dish = {
      ...dishData,
      id: `dish_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setDishes(prev => [...prev, newDish])
  }

  const updateDish = (id: string, dishData: Partial<Dish>) => {
    setDishes(prev =>
      prev.map(dish =>
        dish.id === id ? { ...dish, ...dishData, updatedAt: Date.now() } : dish
      )
    )
  }

  const deleteDish = (id: string) => {
    setDishes(prev => prev.filter(dish => dish.id !== id))
  }

  const getDishById = (id: string) => {
    return dishes.find(dish => dish.id === id)
  }

  return (
    <DishContext.Provider value={{ dishes, addDish, updateDish, deleteDish, getDishById }}>
      {children}
    </DishContext.Provider>
  )
}

export const useDishes = () => {
  const context = useContext(DishContext)
  if (!context) {
    throw new Error('useDishes must be used within DishProvider')
  }
  return context
}
