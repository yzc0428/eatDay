import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { BiddingRecord, BiddingStatus } from '@/types'
import { getFromStorage, saveToStorage } from '@/utils/storage'

const STORAGE_KEY = 'bidding_data'

interface BiddingContextType {
  records: BiddingRecord[]
  updateBiddingPrice: (id: string, newPrice: number) => void
  updateBiddingQuantity: (id: string, newQuantity: number) => void
  submitBidding: (id: string) => Promise<void>
  getPendingRecords: () => BiddingRecord[]
}

const BiddingContext = createContext<BiddingContextType | null>(null)

// Mock 数据
const MOCK_RECORDS: BiddingRecord[] = [
  {
    id: 'bid_001',
    sourcingOrderNo: 'RFQ-2024-001',
    reportOrderNo: 'QUOTE-2024-001-A',
    supplierId: 'supplier_001',
    supplierName: '杭州供应商A',
    productId: 'prod_001',
    productName: '农夫山泉矿泉水',
    warehouseId: 'wh_001',
    warehouseName: '西湖区前置仓',
    currentPrice: 2.5,
    currentQuantity: 1000,
    unit: '瓶',
    status: BiddingStatus.PENDING,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
    notes: '优质水源，品质保证',
  },
  {
    id: 'bid_002',
    sourcingOrderNo: 'RFQ-2024-001',
    reportOrderNo: 'QUOTE-2024-001-B',
    supplierId: 'supplier_002',
    supplierName: '杭州供应商B',
    productId: 'prod_001',
    productName: '农夫山泉矿泉水',
    warehouseId: 'wh_001',
    warehouseName: '西湖区前置仓',
    currentPrice: 2.6,
    currentQuantity: 800,
    unit: '瓶',
    status: BiddingStatus.PENDING,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'bid_003',
    sourcingOrderNo: 'RFQ-2024-002',
    reportOrderNo: 'QUOTE-2024-002-A',
    supplierId: 'supplier_001',
    supplierName: '杭州供应商A',
    productId: 'prod_002',
    productName: '可口可乐',
    warehouseId: 'wh_002',
    warehouseName: '滨江区前置仓',
    currentPrice: 3.2,
    currentQuantity: 500,
    unit: '瓶',
    status: BiddingStatus.PENDING,
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'bid_004',
    sourcingOrderNo: 'RFQ-2024-003',
    reportOrderNo: 'QUOTE-2024-003-A',
    supplierId: 'supplier_003',
    supplierName: '上海供应商C',
    productId: 'prod_003',
    productName: '康师傅方便面',
    warehouseId: 'wh_001',
    warehouseName: '西湖区前置仓',
    currentPrice: 4.5,
    currentQuantity: 300,
    unit: '桶',
    status: BiddingStatus.PENDING,
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 86400000 * 1,
    notes: '经典口味，畅销产品',
  },
  {
    id: 'bid_005',
    sourcingOrderNo: 'RFQ-2024-004',
    reportOrderNo: 'QUOTE-2024-004-A',
    supplierId: 'supplier_001',
    supplierName: '杭州供应商A',
    productId: 'prod_004',
    productName: '新鲜苹果',
    warehouseId: 'wh_003',
    warehouseName: '杭州中心仓',
    currentPrice: 8.0,
    currentQuantity: 200,
    unit: 'kg',
    status: BiddingStatus.PENDING,
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
    notes: '新鲜采摘，当日配送',
  },
]

export const BiddingProvider = ({ children }: { children: ReactNode }) => {
  const [records, setRecords] = useState<BiddingRecord[]>([])

  useEffect(() => {
    const saved = getFromStorage<BiddingRecord[]>(STORAGE_KEY)
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

  const updateBiddingPrice = (id: string, newPrice: number) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.id === id
          ? { ...record, newPrice, updatedAt: Date.now() }
          : record
      )
    )
  }

  const updateBiddingQuantity = (id: string, newQuantity: number) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.id === id
          ? { ...record, newQuantity, updatedAt: Date.now() }
          : record
      )
    )
  }

  const submitBidding = async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const record = records.find((r) => r.id === id)
      
      if (!record) {
        reject(new Error('竞价单据不存在'))
        return
      }

      if (!record.newPrice || record.newPrice <= 0) {
        reject(new Error('请填写有效的新报价'))
        return
      }

      if (!record.newQuantity || record.newQuantity <= 0) {
        reject(new Error('请填写有效的新报量'))
        return
      }

      // 模拟提交延迟
      setTimeout(() => {
        setRecords((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: BiddingStatus.SUBMITTED,
                  submittedAt: Date.now(),
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
    return records.filter((record) => record.status === BiddingStatus.PENDING)
  }

  return (
    <BiddingContext.Provider
      value={{
        records,
        updateBiddingPrice,
        updateBiddingQuantity,
        submitBidding,
        getPendingRecords,
      }}
    >
      {children}
    </BiddingContext.Provider>
  )
}

export const useBidding = () => {
  const context = useContext(BiddingContext)
  if (!context) throw new Error('useBidding must be used within BiddingProvider')
  return context
}
