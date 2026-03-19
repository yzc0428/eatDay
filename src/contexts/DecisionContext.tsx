import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { DecisionRecord, DecisionStatus } from '@/types'
import { getFromStorage, saveToStorage } from '@/utils/storage'

const STORAGE_KEY = 'decision_data'

interface DecisionContextType {
  records: DecisionRecord[]
  updateDecisionQuantity: (id: string, quantity: number) => void
  updateDecisionNotes: (id: string, notes: string) => void
  updateSupplierRating: (id: string, rating: number) => void
  issueDecision: (id: string) => Promise<void>
  getPendingRecords: () => DecisionRecord[]
  getRecordsByStatus: (status: DecisionStatus) => DecisionRecord[]
  getStatistics: () => {
    total: number
    pending: number
    issued: number
    confirmed: number
    cancelled: number
  }
}

const DecisionContext = createContext<DecisionContextType | null>(null)

// Mock 数据 - 决策单与提报单一对一对应，包含不同状态的数据
const MOCK_RECORDS: DecisionRecord[] = [
  {
    id: 'decision_001',
    decisionNo: 'DEC-2024-001',
    sourcingOrderNo: 'RFQ-2024-001',
    reportOrderNo: 'QUOTE-2024-001-A',
    supplierId: 'supplier_001',
    supplierName: '杭州供应商A',
    supplierRating: 4.5,
    productId: 'prod_001',
    productName: '农夫山泉矿泉水',
    warehouseId: 'wh_001',
    warehouseName: '西湖区前置仓',
    price: 2.5,
    quantity: 1000,
    unit: '瓶',
    status: DecisionStatus.PENDING,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
    notes: '优质水源，品质保证',
  },
  {
    id: 'decision_002',
    decisionNo: 'DEC-2024-002',
    sourcingOrderNo: 'RFQ-2024-001',
    reportOrderNo: 'QUOTE-2024-001-B',
    supplierId: 'supplier_002',
    supplierName: '杭州供应商B',
    supplierRating: 4.0,
    productId: 'prod_001',
    productName: '农夫山泉矿泉水',
    warehouseId: 'wh_001',
    warehouseName: '西湖区前置仓',
    price: 2.6,
    quantity: 800,
    unit: '瓶',
    status: DecisionStatus.ISSUED,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 2,
    issuedAt: Date.now() - 86400000 * 2,
    issuedBy: '小二',
    notes: '已下发给供应商',
  },
  {
    id: 'decision_003',
    decisionNo: 'DEC-2024-003',
    sourcingOrderNo: 'RFQ-2024-002',
    reportOrderNo: 'QUOTE-2024-002-A',
    supplierId: 'supplier_001',
    supplierName: '杭州供应商A',
    supplierRating: 4.5,
    productId: 'prod_002',
    productName: '可口可乐',
    warehouseId: 'wh_002',
    warehouseName: '滨江区前置仓',
    price: 3.2,
    quantity: 500,
    unit: '瓶',
    status: DecisionStatus.PENDING,
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'decision_004',
    decisionNo: 'DEC-2024-004',
    sourcingOrderNo: 'RFQ-2024-003',
    reportOrderNo: 'QUOTE-2024-003-A',
    supplierId: 'supplier_003',
    supplierName: '上海供应商C',
    supplierRating: 5.0,
    productId: 'prod_003',
    productName: '康师傅方便面',
    warehouseId: 'wh_001',
    warehouseName: '西湖区前置仓',
    price: 4.5,
    quantity: 300,
    unit: '桶',
    status: DecisionStatus.CONFIRMED,
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 1,
    issuedAt: Date.now() - 86400000 * 2,
    issuedBy: '小二',
    notes: '经典口味，畅销产品，已确认',
  },
  {
    id: 'decision_005',
    decisionNo: 'DEC-2024-005',
    sourcingOrderNo: 'RFQ-2024-004',
    reportOrderNo: 'QUOTE-2024-004-A',
    supplierId: 'supplier_001',
    supplierName: '杭州供应商A',
    supplierRating: 4.5,
    productId: 'prod_004',
    productName: '新鲜苹果',
    warehouseId: 'wh_003',
    warehouseName: '杭州中心仓',
    price: 8.0,
    quantity: 200,
    unit: 'kg',
    status: DecisionStatus.PENDING,
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
    notes: '新鲜采摘，当日配送',
  },
  {
    id: 'decision_006',
    decisionNo: 'DEC-2024-006',
    sourcingOrderNo: 'RFQ-2024-005',
    reportOrderNo: 'QUOTE-2024-005-A',
    supplierId: 'supplier_002',
    supplierName: '杭州供应商B',
    supplierRating: 4.0,
    productId: 'prod_005',
    productName: '伊利纯牛奶',
    warehouseId: 'wh_002',
    warehouseName: '滨江区前置仓',
    price: 5.5,
    quantity: 600,
    unit: '盒',
    status: DecisionStatus.ISSUED,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 1,
    issuedAt: Date.now() - 86400000 * 1,
    issuedBy: '小二',
    notes: '高品质牛奶，已下发',
  },
]

export const DecisionProvider = ({ children }: { children: ReactNode }) => {
  const [records, setRecords] = useState<DecisionRecord[]>([])

  useEffect(() => {
    const saved = getFromStorage<DecisionRecord[]>(STORAGE_KEY)
    if (saved && saved.length > 0) {
      setRecords(saved)
    } else {
      setRecords(MOCK_RECORDS)
      saveToStorage(STORAGE_KEY, MOCK_RECORDS)
    }
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      saveToStorage(STORAGE_KEY, records)
    }
  }, [records])

  const updateDecisionQuantity = (id: string, quantity: number) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.id === id
          ? { ...record, quantity, updatedAt: Date.now() }
          : record
      )
    )
  }

  const updateDecisionNotes = (id: string, notes: string) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.id === id
          ? { ...record, notes, updatedAt: Date.now() }
          : record
      )
    )
  }

  const updateSupplierRating = (id: string, rating: number) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.id === id
          ? { ...record, supplierRating: rating, updatedAt: Date.now() }
          : record
      )
    )
  }

  const issueDecision = async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const record = records.find((r) => r.id === id)
      
      if (!record) {
        reject(new Error('决策单不存在'))
        return
      }

      if (!record.quantity || record.quantity <= 0) {
        reject(new Error('请填写有效的报量'))
        return
      }

      // 模拟下发延迟
      setTimeout(() => {
        setRecords((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: DecisionStatus.ISSUED,
                  issuedAt: Date.now(),
                  issuedBy: '小二',
                  updatedAt: Date.now(),
                }
              : r
          )
        )
        resolve()
      }, 500)
    })
  }

  const getPendingRecords = () => {
    return records.filter((record) => record.status === DecisionStatus.PENDING)
  }

  const getRecordsByStatus = (status: DecisionStatus) => {
    return records.filter((record) => record.status === status)
  }

  const getStatistics = () => {
    return {
      total: records.length,
      pending: records.filter((r) => r.status === DecisionStatus.PENDING).length,
      issued: records.filter((r) => r.status === DecisionStatus.ISSUED).length,
      confirmed: records.filter((r) => r.status === DecisionStatus.CONFIRMED).length,
      cancelled: records.filter((r) => r.status === DecisionStatus.CANCELLED).length,
    }
  }

  return (
    <DecisionContext.Provider
      value={{
        records,
        updateDecisionQuantity,
        updateDecisionNotes,
        updateSupplierRating,
        issueDecision,
        getPendingRecords,
        getRecordsByStatus,
        getStatistics,
      }}
    >
      {children}
    </DecisionContext.Provider>
  )
}

export const useDecision = () => {
  const context = useContext(DecisionContext)
  if (!context) throw new Error('useDecision must be used within DecisionProvider')
  return context
}
