import { ReactNode } from 'react'
import { DishProvider } from './DishContext'
import { OrderProvider } from './OrderContext'
import { FavoriteProvider } from './FavoriteContext'
import { PlanningProvider } from './PlanningContext'

// 组合所有 Provider
export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <DishProvider>
      <OrderProvider>
        <FavoriteProvider>
          <PlanningProvider>{children}</PlanningProvider>
        </FavoriteProvider>
      </OrderProvider>
    </DishProvider>
  )
}

// 导出所有 hooks
export { useDishes } from './DishContext'
export { useOrders } from './OrderContext'
export { useFavorites } from './FavoriteContext'
export { usePlanning } from './PlanningContext'
