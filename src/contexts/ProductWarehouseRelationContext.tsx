import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ProductWarehouseRelation } from '@/types'
import { getFromStorage, saveToStorage } from '@/utils/storage'

const STORAGE_KEY = 'product_warehouse_relation_data'

interface ProductWarehouseRelationContextType {
  relations: ProductWarehouseRelation[]
  addRelation: (relation: Omit<ProductWarehouseRelation, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateRelation: (id: string, updates: Partial<ProductWarehouseRelation>) => void
  deleteRelation: (id: string) => void
  deleteRelationsByProductId: (productId: string) => void
  deleteRelationsByWarehouseId: (warehouseId: string) => void
  getRelationsByWarehouseId: (warehouseId: string) => ProductWarehouseRelation[]
  getRelationsByProductId: (productId: string) => ProductWarehouseRelation[]
  getRelation: (productId: string, warehouseId: string) => ProductWarehouseRelation | undefined
}

const ProductWarehouseRelationContext = createContext<ProductWarehouseRelationContextType | null>(null)

const MOCK_RELATIONS: ProductWarehouseRelation[] = [
  {
    id: 'rel_001',
    productId: 'prod_001',
    productName: '农夫山泉矿泉水',
    productCode: 'PROD-WATER-001',
    warehouseId: 'wh_front_001',
    warehouseName: '西湖区前置仓',
    currentStock: 500,
    safetyStock: 100,
    maxStock: 1000,
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'rel_002',
    productId: 'prod_002',
    productName: '可口可乐',
    productCode: 'PROD-COLA-001',
    warehouseId: 'wh_front_001',
    warehouseName: '西湖区前置仓',
    currentStock: 300,
    safetyStock: 80,
    maxStock: 800,
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'rel_003',
    productId: 'prod_003',
    productName: '康师傅方便面',
    productCode: 'PROD-NOODLE-001',
    warehouseId: 'wh_front_001',
    warehouseName: '西湖区前置仓',
    currentStock: 200,
    safetyStock: 50,
    maxStock: 500,
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'rel_004',
    productId: 'prod_001',
    productName: '农夫山泉矿泉水',
    productCode: 'PROD-WATER-001',
    warehouseId: 'wh_front_002',
    warehouseName: '滨江区前置仓',
    currentStock: 400,
    safetyStock: 100,
    maxStock: 1000,
    createdAt: Date.now() - 86400000 * 18,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'rel_005',
    productId: 'prod_004',
    productName: '新鲜苹果',
    productCode: 'PROD-APPLE-001',
    warehouseId: 'wh_front_002',
    warehouseName: '滨江区前置仓',
    currentStock: 150,
    safetyStock: 50,
    maxStock: 300,
    createdAt: Date.now() - 86400000 * 18,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'rel_006',
    productId: 'prod_001',
    productName: '农夫山泉矿泉水',
    productCode: 'PROD-WATER-001',
    warehouseId: 'wh_virtual_001',
    warehouseName: '淘宝闪购西湖虚拟仓',
    currentStock: 800,
    safetyStock: 200,
    maxStock: 2000,
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'rel_007',
    productId: 'prod_002',
    productName: '可口可乐',
    productCode: 'PROD-COLA-001',
    warehouseId: 'wh_virtual_001',
    warehouseName: '淘宝闪购西湖虚拟仓',
    currentStock: 600,
    safetyStock: 150,
    maxStock: 1500,
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 86400000 * 3,
  },
]

export const ProductWarehouseRelationProvider = ({ children }: { children: ReactNode }) => {
  const [relations, setRelations] = useState<ProductWarehouseRelation[]>([])

  useEffect(() => {
    const saved = getFromStorage<ProductWarehouseRelation[]>(STORAGE_KEY)
    if (saved && saved.length > 0) {
      setRelations(saved)
    } else {
      setRelations(MOCK_RELATIONS)
      saveToStorage(STORAGE_KEY, MOCK_RELATIONS)
    }
  }, [])

  useEffect(() => {
    if (relations.length > 0) {
      saveToStorage(STORAGE_KEY, relations)
    }
  }, [relations])

  const generateId = () => `rel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const addRelation = (relationData: Omit<ProductWarehouseRelation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now()
    const newRelation: ProductWarehouseRelation = {
      ...relationData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    setRelations((prev) => [newRelation, ...prev])
  }

  const updateRelation = (id: string, updates: Partial<ProductWarehouseRelation>) => {
    setRelations((prev) =>
      prev.map((relation) =>
        relation.id === id ? { ...relation, ...updates, updatedAt: Date.now() } : relation
      )
    )
  }

  const deleteRelation = (id: string) => {
    setRelations((prev) => prev.filter((relation) => relation.id !== id))
  }

  const deleteRelationsByProductId = (productId: string) => {
    setRelations((prev) => prev.filter((relation) => relation.productId !== productId))
  }

  const deleteRelationsByWarehouseId = (warehouseId: string) => {
    setRelations((prev) => prev.filter((relation) => relation.warehouseId !== warehouseId))
  }

  const getRelationsByWarehouseId = (warehouseId: string): ProductWarehouseRelation[] => {
    return relations.filter((relation) => relation.warehouseId === warehouseId)
  }

  const getRelationsByProductId = (productId: string): ProductWarehouseRelation[] => {
    return relations.filter((relation) => relation.productId === productId)
  }

  const getRelation = (productId: string, warehouseId: string): ProductWarehouseRelation | undefined => {
    return relations.find(
      (relation) => relation.productId === productId && relation.warehouseId === warehouseId
    )
  }

  return (
    <ProductWarehouseRelationContext.Provider
      value={{
        relations,
        addRelation,
        updateRelation,
        deleteRelation,
        deleteRelationsByProductId,
        deleteRelationsByWarehouseId,
        getRelationsByWarehouseId,
        getRelationsByProductId,
        getRelation,
      }}
    >
      {children}
    </ProductWarehouseRelationContext.Provider>
  )
}

export const useProductWarehouseRelation = () => {
  const context = useContext(ProductWarehouseRelationContext)
  if (!context) throw new Error('useProductWarehouseRelation must be used within ProductWarehouseRelationProvider')
  return context
}
