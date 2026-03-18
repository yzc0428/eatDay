import { useMemo } from 'react'
import { useOrders } from '@/contexts/OrderContext'
import { Statistics } from '@/types'

export function useStatistics() {
  const { orders } = useOrders()

  const statistics: Statistics = useMemo(() => {
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0)
    const averageOrderPrice = totalOrders > 0 ? totalSpent / totalOrders : 0

    // 统计每个菜品的点单次数
    const dishCountMap = new Map<string, { name: string; count: number }>()

    orders.forEach(order => {
      order.items.forEach(item => {
        const existing = dishCountMap.get(item.dishId)
        if (existing) {
          existing.count += item.quantity
        } else {
          dishCountMap.set(item.dishId, {
            name: item.dishName,
            count: item.quantity,
          })
        }
      })
    })

    // 转换为数组并排序
    const mostOrderedDishes = Array.from(dishCountMap.entries())
      .map(([dishId, data]) => ({
        dishId,
        dishName: data.name,
        count: data.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // 取前10名

    return {
      totalOrders,
      totalSpent,
      averageOrderPrice,
      mostOrderedDishes,
    }
  }, [orders])

  return statistics
}
