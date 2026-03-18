import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Order, OrderItem } from '@/types'
import { storage, STORAGE_KEYS } from '@/utils/storage'

interface OrderContextType {
  orders: Order[]
  currentOrder: OrderItem[]
  addToCurrentOrder: (item: OrderItem) => void
  updateOrderItem: (dishId: string, quantity: number) => void
  removeFromCurrentOrder: (dishId: string) => void
  clearCurrentOrder: () => void
  submitOrder: () => void
  deleteOrder: (id: string) => void
  getOrderById: (id: string) => Order | undefined
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([])
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([])

  // 从 LocalStorage 加载历史订单
  useEffect(() => {
    const savedOrders = storage.get<Order[]>(STORAGE_KEYS.ORDERS)
    if (savedOrders) {
      setOrders(savedOrders)
    }
  }, [])

  // 保存订单到 LocalStorage
  useEffect(() => {
    if (orders.length > 0 || storage.get<Order[]>(STORAGE_KEYS.ORDERS)) {
      storage.set(STORAGE_KEYS.ORDERS, orders)
    }
  }, [orders])

  const addToCurrentOrder = (item: OrderItem) => {
    setCurrentOrder(prev => {
      const existingItem = prev.find(i => i.dishId === item.dishId)
      if (existingItem) {
        return prev.map(i =>
          i.dishId === item.dishId ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      }
      return [...prev, item]
    })
  }

  const updateOrderItem = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCurrentOrder(dishId)
      return
    }
    setCurrentOrder(prev => prev.map(item => (item.dishId === dishId ? { ...item, quantity } : item)))
  }

  const removeFromCurrentOrder = (dishId: string) => {
    setCurrentOrder(prev => prev.filter(item => item.dishId !== dishId))
  }

  const clearCurrentOrder = () => {
    setCurrentOrder([])
  }

  const submitOrder = () => {
    if (currentOrder.length === 0) return

    const totalPrice = currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const newOrder: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      items: currentOrder,
      totalPrice,
      createdAt: Date.now(),
    }

    setOrders(prev => [newOrder, ...prev])
    clearCurrentOrder()
  }

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(order => order.id !== id))
  }

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id)
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        addToCurrentOrder,
        updateOrderItem,
        removeFromCurrentOrder,
        clearCurrentOrder,
        submitOrder,
        deleteOrder,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export const useOrders = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider')
  }
  return context
}
