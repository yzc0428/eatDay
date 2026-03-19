import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  Warehouse,
  WarehouseType,
  WarehouseStatus,
  CenterWarehouse,
  FrontWarehouse,
  VirtualWarehouse,
  VirtualBindMode,
} from '@/types'
import { getFromStorage, saveToStorage } from '@/utils/storage'

const STORAGE_KEY = 'warehouse_data'

interface WarehouseContextType {
  warehouses: Warehouse[]
  addWarehouse: (warehouse: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateWarehouse: (id: string, updates: Partial<Warehouse>) => void
  deleteWarehouse: (id: string) => void
  getFrontWarehouses: () => FrontWarehouse[]
}

const WarehouseContext = createContext<WarehouseContextType | null>(null)

const MOCK_WAREHOUSES: Warehouse[] = [
  {
    id: 'wh_center_001',
    type: WarehouseType.CENTER,
    name: '杭州中心仓',
    code: 'WH-HZ-C001',
    address: '浙江省杭州市余杭区文一西路998号',
    city: '杭州',
    area: 5000,
    capacity: 100000,
    manager: '张伟',
    phone: '0571-12345678',
    status: WarehouseStatus.ACTIVE,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 5,
    notes: '浙江省核心中心仓',
  } as CenterWarehouse,
  {
    id: 'wh_front_001',
    type: WarehouseType.FRONT,
    name: '西湖区前置仓',
    code: 'WH-HZ-F001',
    address: '浙江省杭州市西湖区文三路90号',
    city: '杭州',
    district: '西湖区',
    area: 300,
    capacity: 5000,
    manager: '李明',
    phone: '0571-87654321',
    centerWarehouseId: 'wh_center_001',
    centerWarehouseName: '杭州中心仓',
    deliveryRadius: 3,
    status: WarehouseStatus.ACTIVE,
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 2,
  } as FrontWarehouse,
  {
    id: 'wh_front_002',
    type: WarehouseType.FRONT,
    name: '滨江区前置仓',
    code: 'WH-HZ-F002',
    address: '浙江省杭州市滨江区江南大道3688号',
    city: '杭州',
    district: '滨江区',
    area: 250,
    capacity: 4000,
    manager: '王芳',
    phone: '0571-11223344',
    centerWarehouseId: 'wh_center_001',
    centerWarehouseName: '杭州中心仓',
    deliveryRadius: 3,
    status: WarehouseStatus.ACTIVE,
    createdAt: Date.now() - 86400000 * 18,
    updatedAt: Date.now() - 86400000 * 1,
  } as FrontWarehouse,
  {
    id: 'wh_front_003',
    type: WarehouseType.FRONT,
    name: '拱墅区前置仓',
    code: 'WH-HZ-F003',
    address: '浙江省杭州市拱墅区莫干山路1418号',
    city: '杭州',
    district: '拱墅区',
    area: 200,
    capacity: 3500,
    manager: '陈刚',
    phone: '0571-55667788',
    centerWarehouseId: 'wh_center_001',
    centerWarehouseName: '杭州中心仓',
    deliveryRadius: 2.5,
    status: WarehouseStatus.BUILDING,
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 86400000 * 1,
    notes: '预计下月正式运营',
  } as FrontWarehouse,
  {
    id: 'wh_virtual_001',
    type: WarehouseType.VIRTUAL,
    name: '淘宝闪购西湖虚拟仓',
    code: 'WH-HZ-V001',
    onlineStoreId: 'TB-HZ-001',
    onlineStoreName: '淘宝闪购西湖店',
    platform: '淘宝闪购',
    city: '杭州',
    bindMode: VirtualBindMode.AUTO,
    boundFrontWarehouseIds: ['wh_front_001', 'wh_front_002'],
    boundFrontWarehouseNames: ['西湖区前置仓', '滨江区前置仓'],
    status: WarehouseStatus.ACTIVE,
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 86400000 * 3,
    notes: '系统自动分配最近前置仓',
  } as VirtualWarehouse,
]

export const WarehouseProvider = ({ children }: { children: ReactNode }) => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])

  useEffect(() => {
    const saved = getFromStorage<Warehouse[]>(STORAGE_KEY)
    if (saved && saved.length > 0) {
      setWarehouses(saved)
    } else {
      setWarehouses(MOCK_WAREHOUSES)
      saveToStorage(STORAGE_KEY, MOCK_WAREHOUSES)
    }
  }, [])

  useEffect(() => {
    if (warehouses.length > 0) {
      saveToStorage(STORAGE_KEY, warehouses)
    }
  }, [warehouses])

  const generateId = () => `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const addWarehouse = (warehouseData: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now()
    const newWarehouse = { ...warehouseData, id: generateId(), createdAt: now, updatedAt: now } as Warehouse
    setWarehouses((prev) => [newWarehouse, ...prev])
  }

  const updateWarehouse = (id: string, updates: Partial<Warehouse>) => {
    setWarehouses((prev) =>
      prev.map((wh) => (wh.id === id ? { ...wh, ...updates, updatedAt: Date.now() } as Warehouse : wh))
    )
  }

  const deleteWarehouse = (id: string) => {
    setWarehouses((prev) => prev.filter((wh) => wh.id !== id))
  }

  const getFrontWarehouses = (): FrontWarehouse[] =>
    warehouses.filter((wh): wh is FrontWarehouse => wh.type === WarehouseType.FRONT)

  return (
    <WarehouseContext.Provider value={{ warehouses, addWarehouse, updateWarehouse, deleteWarehouse, getFrontWarehouses }}>
      {children}
    </WarehouseContext.Provider>
  )
}

export const useWarehouse = () => {
  const context = useContext(WarehouseContext)
  if (!context) throw new Error('useWarehouse must be used within WarehouseProvider')
  return context
}
