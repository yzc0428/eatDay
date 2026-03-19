import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { DeliveryOrder, OrderStatus, OrderType, OrderDirection, Courier, CourierStatus } from '@/types'
import { getFromStorage, saveToStorage } from '@/utils/storage'

const STORAGE_KEY = 'delivery_orders'

interface DeliveryContextType {
  orders: DeliveryOrder[]
  couriers: Courier[]
  reassignOrder: (orderId: string, courierId: string) => Promise<void>
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  getOrdersByType: (type: OrderType | 'all') => DeliveryOrder[]
  getOrdersByStatus: (status: OrderStatus | 'all') => DeliveryOrder[]
  getOrdersByDirection: (direction: OrderDirection | 'all') => DeliveryOrder[]
  getStatistics: () => {
    total: number
    pending: number
    delivering: number
    completed: number
    exception: number
  }
}

const DeliveryContext = createContext<DeliveryContextType | null>(null)

// Mock 配送员数据
const MOCK_COURIERS: Courier[] = [
  {
    id: 'courier_001',
    name: '张三',
    phone: '13800138001',
    status: CourierStatus.BUSY,
    location: {
      latitude: 30.2741,
      longitude: 120.1551,
      address: '杭州市西湖区文三路',
      updatedAt: Date.now(),
    },
    currentOrders: 2,
    todayCompleted: 15,
    rating: 4.8,
  },
  {
    id: 'courier_002',
    name: '李四',
    phone: '13800138002',
    status: CourierStatus.IDLE,
    location: {
      latitude: 30.2891,
      longitude: 120.1531,
      address: '杭州市西湖区黄龙路',
      updatedAt: Date.now(),
    },
    currentOrders: 0,
    todayCompleted: 12,
    rating: 4.9,
  },
  {
    id: 'courier_003',
    name: '王五',
    phone: '13800138003',
    status: CourierStatus.BUSY,
    location: {
      latitude: 30.2641,
      longitude: 120.1621,
      address: '杭州市滨江区江南大道',
      updatedAt: Date.now(),
    },
    currentOrders: 1,
    todayCompleted: 18,
    rating: 4.7,
  },
]

// Mock 订单数据
const MOCK_ORDERS: DeliveryOrder[] = [
  {
    id: 'order_001',
    orderNo: 'O2O202403180001',
    type: OrderType.O2O,
    direction: OrderDirection.FORWARD,
    status: OrderStatus.PENDING,
    warehouseId: 'wh_001',
    warehouseName: '西湖区前置仓',
    warehouseAddress: '杭州市西湖区文三路100号',
    deliveryAddress: {
      recipientName: '陈先生',
      recipientPhone: '13900139001',
      province: '浙江省',
      city: '杭州市',
      district: '西湖区',
      street: '文一路',
      detail: '188号A座1001室',
      latitude: 30.2841,
      longitude: 120.1451,
    },
    items: [
      {
        productId: 'prod_001',
        productName: '农夫山泉矿泉水',
        quantity: 2,
        unit: '瓶',
        price: 2.5,
        amount: 5.0,
      },
      {
        productId: 'prod_002',
        productName: '可口可乐',
        quantity: 1,
        unit: '瓶',
        price: 3.5,
        amount: 3.5,
      },
    ],
    totalAmount: 8.5,
    deliveryFee: 5.0,
    estimatedTime: Date.now() + 1800000, // 30分钟后
    createdAt: Date.now() - 300000, // 5分钟前
    updatedAt: Date.now() - 300000,
    platform: '美团',
  },
  {
    id: 'order_002',
    orderNo: 'B2C202403180002',
    type: OrderType.B2C,
    direction: OrderDirection.FORWARD,
    status: OrderStatus.DELIVERING,
    warehouseId: 'wh_002',
    warehouseName: '滨江区前置仓',
    warehouseAddress: '杭州市滨江区江南大道200号',
    deliveryAddress: {
      recipientName: '李女士',
      recipientPhone: '13900139002',
      province: '浙江省',
      city: '杭州市',
      district: '滨江区',
      street: '滨盛路',
      detail: '1688号B座2002室',
      latitude: 30.2141,
      longitude: 120.2051,
    },
    items: [
      {
        productId: 'prod_003',
        productName: '康师傅方便面',
        quantity: 5,
        unit: '桶',
        price: 4.5,
        amount: 22.5,
      },
    ],
    totalAmount: 22.5,
    deliveryFee: 0,
    courierId: 'courier_001',
    courierName: '张三',
    courierPhone: '13800138001',
    courierLocation: {
      latitude: 30.2241,
      longitude: 120.1951,
      address: '杭州市滨江区江南大道150号',
      updatedAt: Date.now(),
    },
    estimatedTime: Date.now() + 900000, // 15分钟后
    createdAt: Date.now() - 1200000, // 20分钟前
    updatedAt: Date.now() - 60000,
    acceptedAt: Date.now() - 1000000,
    pickedAt: Date.now() - 600000,
  },
  {
    id: 'order_003',
    orderNo: 'O2O202403180003',
    type: OrderType.O2O,
    direction: OrderDirection.REVERSE,
    status: OrderStatus.ACCEPTED,
    warehouseId: 'wh_001',
    warehouseName: '西湖区前置仓',
    warehouseAddress: '杭州市西湖区文三路100号',
    deliveryAddress: {
      recipientName: '王先生',
      recipientPhone: '13900139003',
      province: '浙江省',
      city: '杭州市',
      district: '西湖区',
      street: '学院路',
      detail: '28号C座503室',
      latitude: 30.2941,
      longitude: 120.1351,
    },
    items: [
      {
        productId: 'prod_004',
        productName: '新鲜苹果',
        quantity: 2,
        unit: 'kg',
        price: 8.0,
        amount: 16.0,
      },
    ],
    totalAmount: 16.0,
    deliveryFee: 0,
    courierId: 'courier_003',
    courierName: '王五',
    courierPhone: '13800138003',
    createdAt: Date.now() - 600000, // 10分钟前
    updatedAt: Date.now() - 300000,
    acceptedAt: Date.now() - 300000,
    notes: '退货订单，商品质量问题',
  },
  {
    id: 'order_004',
    orderNo: 'B2C202403180004',
    type: OrderType.B2C,
    direction: OrderDirection.FORWARD,
    status: OrderStatus.COMPLETED,
    warehouseId: 'wh_003',
    warehouseName: '杭州中心仓',
    warehouseAddress: '杭州市余杭区文一西路300号',
    deliveryAddress: {
      recipientName: '赵女士',
      recipientPhone: '13900139004',
      province: '浙江省',
      city: '杭州市',
      district: '余杭区',
      street: '五常大道',
      detail: '1号D座1501室',
      latitude: 30.3041,
      longitude: 120.0851,
    },
    items: [
      {
        productId: 'prod_005',
        productName: '伊利纯牛奶',
        quantity: 2,
        unit: '箱',
        price: 55.0,
        amount: 110.0,
      },
    ],
    totalAmount: 110.0,
    deliveryFee: 0,
    courierId: 'courier_002',
    courierName: '李四',
    courierPhone: '13800138002',
    estimatedTime: Date.now() - 1800000,
    actualTime: Date.now() - 1200000,
    createdAt: Date.now() - 7200000, // 2小时前
    updatedAt: Date.now() - 1200000,
    acceptedAt: Date.now() - 6600000,
    pickedAt: Date.now() - 5400000,
    deliveredAt: Date.now() - 1200000,
  },
  {
    id: 'order_005',
    orderNo: 'O2O202403180005',
    type: OrderType.O2O,
    direction: OrderDirection.FORWARD,
    status: OrderStatus.EXCEPTION,
    warehouseId: 'wh_001',
    warehouseName: '西湖区前置仓',
    warehouseAddress: '杭州市西湖区文三路100号',
    deliveryAddress: {
      recipientName: '孙先生',
      recipientPhone: '13900139005',
      province: '浙江省',
      city: '杭州市',
      district: '西湖区',
      street: '天目山路',
      detail: '398号E座808室',
      latitude: 30.2741,
      longitude: 120.1251,
    },
    items: [
      {
        productId: 'prod_001',
        productName: '农夫山泉矿泉水',
        quantity: 3,
        unit: '瓶',
        price: 2.5,
        amount: 7.5,
      },
    ],
    totalAmount: 7.5,
    deliveryFee: 5.0,
    courierId: 'courier_001',
    courierName: '张三',
    courierPhone: '13800138001',
    createdAt: Date.now() - 3600000, // 1小时前
    updatedAt: Date.now() - 1800000,
    acceptedAt: Date.now() - 3000000,
    notes: '客户联系不上',
    platform: '饿了么',
  },
]

export const DeliveryProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<DeliveryOrder[]>([])
  const [couriers] = useState<Courier[]>(MOCK_COURIERS)

  useEffect(() => {
    const saved = getFromStorage<DeliveryOrder[]>(STORAGE_KEY)
    if (saved && saved.length > 0) {
      setOrders(saved)
    } else {
      setOrders(MOCK_ORDERS)
      saveToStorage(STORAGE_KEY, MOCK_ORDERS)
    }
  }, [])

  useEffect(() => {
    if (orders.length > 0) {
      saveToStorage(STORAGE_KEY, orders)
    }
  }, [orders])

  const reassignOrder = async (orderId: string, courierId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const order = orders.find((o) => o.id === orderId)
      const courier = couriers.find((c) => c.id === courierId)

      if (!order) {
        reject(new Error('订单不存在'))
        return
      }

      if (!courier) {
        reject(new Error('配送员不存在'))
        return
      }

      // 模拟派单延迟
      setTimeout(() => {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  courierId: courier.id,
                  courierName: courier.name,
                  courierPhone: courier.phone,
                  status: OrderStatus.ACCEPTED,
                  acceptedAt: Date.now(),
                  updatedAt: Date.now(),
                }
              : o
          )
        )
        resolve()
      }, 500)
    })
  }

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status, updatedAt: Date.now() }
          : order
      )
    )
  }

  const getOrdersByType = (type: OrderType | 'all') => {
    if (type === 'all') return orders
    return orders.filter((order) => order.type === type)
  }

  const getOrdersByStatus = (status: OrderStatus | 'all') => {
    if (status === 'all') return orders
    return orders.filter((order) => order.status === status)
  }

  const getOrdersByDirection = (direction: OrderDirection | 'all') => {
    if (direction === 'all') return orders
    return orders.filter((order) => order.direction === direction)
  }

  const getStatistics = () => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === OrderStatus.PENDING).length,
      delivering: orders.filter((o) => o.status === OrderStatus.DELIVERING).length,
      completed: orders.filter((o) => o.status === OrderStatus.COMPLETED).length,
      exception: orders.filter((o) => o.status === OrderStatus.EXCEPTION).length,
    }
  }

  return (
    <DeliveryContext.Provider
      value={{
        orders,
        couriers,
        reassignOrder,
        updateOrderStatus,
        getOrdersByType,
        getOrdersByStatus,
        getOrdersByDirection,
        getStatistics,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  )
}

export const useDelivery = () => {
  const context = useContext(DeliveryContext)
  if (!context) throw new Error('useDelivery must be used within DeliveryProvider')
  return context
}
