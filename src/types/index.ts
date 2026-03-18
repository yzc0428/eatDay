// 菜品分类
export enum DishCategory {
  STAPLE = 'staple', // 主食
  DISH = 'dish', // 菜品
  SOUP = 'soup', // 汤品
  DRINK = 'drink', // 饮料
  DESSERT = 'dessert', // 甜点
}

// 菜品接口
export interface Dish {
  id: string
  name: string
  category: DishCategory
  price: number
  image?: string // Base64 编码的图片
  description?: string
  createdAt: number
  updatedAt: number
}

// 订单项接口
export interface OrderItem {
  dishId: string
  dishName: string
  quantity: number
  price: number
}

// 订单接口
export interface Order {
  id: string
  items: OrderItem[]
  totalPrice: number
  createdAt: number
}

// 收藏接口
export interface Favorite {
  dishId: string
  createdAt: number
}

// 统计数据接口
export interface Statistics {
  totalOrders: number
  totalSpent: number
  averageOrderPrice: number
  mostOrderedDishes: Array<{
    dishId: string
    dishName: string
    count: number
  }>
}

// 场景类型枚举
export enum ScenarioType {
  EVENING_PEAK = 'evening_peak', // 晚高峰
  RAINSTORM = 'rainstorm', // 暴雨
  HOLIDAY = 'holiday', // 节假日
  PROMOTION = 'promotion', // 促销活动
}

// 场景信息接口
export interface Scenario {
  type: ScenarioType
  name: string
  description: string
}

// 计划类型枚举
export enum PlanType {
  PURCHASE = 'purchase', // 采购计划
  TRANSFER = 'transfer', // 调拨计划
}

// 计划状态枚举
export enum PlanStatus {
  PENDING = 'pending', // 待处理
  IN_PROGRESS = 'in_progress', // 进行中
  COMPLETED = 'completed', // 已完成
  CANCELLED = 'cancelled', // 已取消
}

// 采购计划项接口
export interface PurchaseItem {
  itemId: string
  itemName: string
  quantity: number
  unit: string
  warehouse?: string
}

// 计划触发原因
export interface PlanReason {
  type: 'low_stock' | 'buffer_shortage' | 'smax_exceeded' | 'smin_below' | 'demand_forecast'
  description: string
  warehouse?: string
  parameter?: string
  currentValue?: number
  thresholdValue?: number
}

// 采购计划接口
export interface PurchasePlan {
  id: string
  type: PlanType.PURCHASE
  scenario?: ScenarioType
  items: PurchaseItem[]
  status: PlanStatus
  createdAt: number
  updatedAt: number
  createdBy?: string
  notes?: string
  reason?: PlanReason
}

// 调拨计划项接口
export interface TransferItem {
  itemId: string
  itemName: string
  quantity: number
  unit: string
  fromLocation: string
  toLocation: string
}

// 调拨计划接口
export interface TransferPlan {
  id: string
  type: PlanType.TRANSFER
  scenario?: ScenarioType
  items: TransferItem[]
  status: PlanStatus
  createdAt: number
  updatedAt: number
  createdBy?: string
  notes?: string
}

// 计划联合类型
export type Plan = PurchasePlan | TransferPlan
