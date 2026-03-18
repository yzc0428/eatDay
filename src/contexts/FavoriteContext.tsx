import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Favorite } from '@/types'
import { storage, STORAGE_KEYS } from '@/utils/storage'

interface FavoriteContextType {
  favorites: Favorite[]
  isFavorite: (dishId: string) => boolean
  toggleFavorite: (dishId: string) => void
  getFavoriteIds: () => string[]
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined)

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Favorite[]>([])

  // 从 LocalStorage 加载数据
  useEffect(() => {
    const savedFavorites = storage.get<Favorite[]>(STORAGE_KEYS.FAVORITES)
    if (savedFavorites) {
      setFavorites(savedFavorites)
    }
  }, [])

  // 保存数据到 LocalStorage
  useEffect(() => {
    if (favorites.length > 0 || storage.get<Favorite[]>(STORAGE_KEYS.FAVORITES)) {
      storage.set(STORAGE_KEYS.FAVORITES, favorites)
    }
  }, [favorites])

  const isFavorite = (dishId: string) => {
    return favorites.some(fav => fav.dishId === dishId)
  }

  const toggleFavorite = (dishId: string) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.dishId === dishId)
      if (exists) {
        return prev.filter(fav => fav.dishId !== dishId)
      } else {
        return [...prev, { dishId, createdAt: Date.now() }]
      }
    })
  }

  const getFavoriteIds = () => {
    return favorites.map(fav => fav.dishId)
  }

  return (
    <FavoriteContext.Provider value={{ favorites, isFavorite, toggleFavorite, getFavoriteIds }}>
      {children}
    </FavoriteContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoriteContext)
  if (!context) {
    throw new Error('useFavorites must be used within FavoriteProvider')
  }
  return context
}
