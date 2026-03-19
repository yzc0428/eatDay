// ==================== 商品相关类型 ====================

// 商品分类枚举
export enum ProductCategory {
  FOOD = 'food',           // 食品
  BEVERAGE = 'beverage',   // 饮料
  DAILY = 'daily',         // 日用品
  FRESH = 'fresh',         // 生鲜
  FROZEN = 'frozen',       // 冷冻品
  OTHER = 'other',         // 其他
}

// 商品状态枚举
export enum ProductStatus {
  ACTIVE = 'active',       // 启用
  INACTIVE = 'inactive',   // 停用
}

// 商品接口
export interface Product {
  id: string
  name: string              // 商品名称
  code: string              // 商品编码
  category: ProductCategory // 商品分类
  unit: string              // 计量单位（件、箱、kg等）
  specification?: string    // 规格说明
  description?: string      // 商品描述
  image?: string            // 商品图片（Base64）
  status: ProductStatus     // 商品状态
  createdAt: number
  updatedAt: number
}

// 品仓关系接口
export interface ProductWarehouseRelation {
  id: string
  productId: string         // 商品ID
  productName: string       // 商品名称（冗余，便于展示）
  productCode: string       // 商品编码（冗余，便于展示）
  warehouseId: string       // 仓库ID
  warehouseName: string     // 仓库名称（冗余，便于展示）
  currentStock: number      // 当前库存
  safetyStock: number       // 安全库存
  maxStock: number          // 最大库存
  createdAt: number
  updatedAt: number
}

// ==================== 仓库相关类型 ====================

// 仓库类型枚举
export enum WarehouseType {
  CENTER = 'center',   // 中心仓
  FRONT = 'front',     // 前置仓
  VIRTUAL = 'virtual', // 虚拟仓
}

// 仓库状态枚举
export enum WarehouseStatus {
  ACTIVE = 'active',     // 正常运营
  INACTIVE = 'inactive', // 停用
  BUILDING = 'building', // 建设中
}

// 中心仓信息
export interface CenterWarehouse {
  id: string
  type: WarehouseType.CENTER
  name: string
  code: string           // 仓库编码
  address: string        // 详细地址
  city: string           // 所在城市
  area: number           // 面积（平方米）
  capacity: number       // 库容（件）
  manager: string        // 负责人
  phone: string          // 联系电话
  status: WarehouseStatus
  createdAt: number
  updatedAt: number
  notes?: string
}

// 前置仓信息
export interface FrontWarehouse {
  id: string
  type: WarehouseType.FRONT
  name: string
  code: string           // 仓库编码
  address: string        // 详细地址
  city: string           // 所在城市
  district: string       // 所在区域
  area: number           // 面积（平方米）
  capacity: number       // 库容（件）
  manager: string        // 负责人
  phone: string          // 联系电话
  centerWarehouseId: string  // 所属中心仓ID
  centerWarehouseName: string // 所属中心仓名称
  deliveryRadius: number // 配送半径（公里）
  status: WarehouseStatus
  createdAt: number
  updatedAt: number
  notes?: string
}

// 虚拟仓前置仓绑定模式
export enum VirtualBindMode {
  AUTO = 'auto',     // 系统自动选择
  MANUAL = 'manual', // 人工手动选择
}

// 虚拟仓信息
export interface VirtualWarehouse {
  id: string
  type: WarehouseType.VIRTUAL
  name: string
  code: string           // 仓库编码
  onlineStoreId: string  // 对应线上门店ID
  onlineStoreName: string // 对应线上门店名称
  platform: string       // 所属平台（美团、饿了么等）
  city: string           // 所在城市
  bindMode: VirtualBindMode // 前置仓绑定模式
  boundFrontWarehouseIds: string[]   // 绑定的前置仓ID列表
  boundFrontWarehouseNames: string[] // 绑定的前置仓名称列表
  status: WarehouseStatus
  createdAt: number
  updatedAt: number
  notes?: string
}

// 仓库联合类型
export type Warehouse = CenterWarehouse | FrontWarehouse | VirtualWarehouse

// ==================== 计划相关类型 ====================

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

// ==================== 竞价相关类型 ====================

// 竞价单据状态枚举
export enum BiddingStatus {
  PENDING = 'pending',       // 待竞价
  SUBMITTED = 'submitted',   // 已提交
  ACCEPTED = 'accepted',     // 已接受
  REJECTED = 'rejected',     // 已拒绝
}

// 竞价单据接口
export interface BiddingRecord {
  id: string
  sourcingOrderNo: string      // 寻源单号
  reportOrderNo: string         // 提报单号
  supplierId: string            // 供应商ID
  supplierName: string          // 供应商名称
  productId: string             // 货品ID
  productName: string           // 货品名称
  warehouseId: string           // 仓库ID
  warehouseName: string         // 仓库名称
  currentPrice: number          // 当前价格（元）
  currentQuantity: number       // 当前报量
  unit: string                  // 单位
  newPrice?: number             // 新报价（元）
  newQuantity?: number          // 新报量
  status: BiddingStatus         // 状态
  createdAt: number
  updatedAt: number
  submittedAt?: number          // 提交时间
  notes?: string
}

// ==================== 决策单相关类型 ====================

// 决策单状态枚举
export enum DecisionStatus {
  PENDING = 'pending',         // 待下发
  ISSUED = 'issued',           // 已下发
  CONFIRMED = 'confirmed',     // 已确认
  CANCELLED = 'cancelled',     // 已取消
}

// 决策单接口
export interface DecisionRecord {
  id: string
  decisionNo: string            // 决策单号
  sourcingOrderNo: string       // 寻源单号
  reportOrderNo: string         // 提报单号（一对一）
  supplierId: string            // 供应商ID
  supplierName: string          // 供应商名称
  supplierRating?: number       // 供应商评分（1-5星）
  productId: string             // 货品ID
  productName: string           // 货品名称
  warehouseId: string           // 仓库ID
  warehouseName: string         // 仓库名称
  price: number                 // 报价（元）
  quantity: number              // 报量
  unit: string                  // 单位
  status: DecisionStatus        // 状态
  createdAt: number
  updatedAt: number
  issuedAt?: number             // 下发时间
  issuedBy?: string             // 下发人
  notes?: string
}

// ==================== 即时配送相关类型 ====================

// 订单类型枚举
export enum OrderType {
  O2O = 'o2o',           // O2O订单（外卖、闪购等）
  B2C = 'b2c',           // B2C订单（电商订单）
}

// 订单方向枚举
export enum OrderDirection {
  FORWARD = 'forward',   // 正向订单（配送）
  REVERSE = 'reverse',   // 逆向订单（退货、换货）
}

// 订单状态枚举
export enum OrderStatus {
  PENDING = 'pending',               // 待接单
  ACCEPTED = 'accepted',             // 已接单
  PICKING = 'picking',               // 拣货中
  PICKED = 'picked',                 // 已拣货
  DELIVERING = 'delivering',         // 配送中
  ARRIVED = 'arrived',               // 已到达
  COMPLETED = 'completed',           // 已完成
  CANCELLED = 'cancelled',           // 已取消
  EXCEPTION = 'exception',           // 异常
}

// 配送员状态枚举
export enum CourierStatus {
  IDLE = 'idle',                     // 空闲
  BUSY = 'busy',                     // 忙碌
  OFFLINE = 'offline',               // 离线
}

// 配送员位置信息
export interface CourierLocation {
  latitude: number                   // 纬度
  longitude: number                  // 经度
  address: string                    // 地址
  updatedAt: number                  // 更新时间
}

// 配送员信息
export interface Courier {
  id: string
  name: string                       // 姓名
  phone: string                      // 电话
  status: CourierStatus              // 状态
  location?: CourierLocation         // 位置信息
  currentOrders: number              // 当前配送订单数
  todayCompleted: number             // 今日完成订单数
  rating: number                     // 评分
}

// 收货地址信息
export interface DeliveryAddress {
  recipientName: string              // 收货人姓名
  recipientPhone: string             // 收货人电话
  province: string                   // 省份
  city: string                       // 城市
  district: string                   // 区县
  street: string                     // 街道
  detail: string                     // 详细地址
  latitude?: number                  // 纬度
  longitude?: number                 // 经度
}

// 订单商品信息
export interface OrderItem {
  productId: string                  // 商品ID
  productName: string                // 商品名称
  quantity: number                   // 数量
  unit: string                       // 单位
  price: number                      // 单价
  amount: number                     // 小计
  image?: string                     // 商品图片
}

// 配送订单接口
export interface DeliveryOrder {
  id: string
  orderNo: string                    // 订单号
  type: OrderType                    // 订单类型
  direction: OrderDirection          // 订单方向
  status: OrderStatus                // 订单状态
  warehouseId: string                // 仓库ID
  warehouseName: string              // 仓库名称
  warehouseAddress: string           // 仓库地址
  deliveryAddress: DeliveryAddress   // 收货地址
  items: OrderItem[]                 // 订单商品
  totalAmount: number                // 订单总额
  deliveryFee: number                // 配送费
  courierId?: string                 // 配送员ID
  courierName?: string               // 配送员姓名
  courierPhone?: string              // 配送员电话
  courierLocation?: CourierLocation  // 配送员位置
  estimatedTime?: number             // 预计送达时间
  actualTime?: number                // 实际送达时间
  createdAt: number                  // 下单时间
  updatedAt: number                  // 更新时间
  acceptedAt?: number                // 接单时间
  pickedAt?: number                  // 拣货完成时间
  deliveredAt?: number               // 配送完成时间
  notes?: string                     // 备注
  platform?: string                  // 平台（美团、饿了么等）
  cancelReason?: string              // 取消原因
}
