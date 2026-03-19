import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product, ProductStatus, ProductCategory } from '@/types'
import { getFromStorage, saveToStorage } from '@/utils/storage'

const STORAGE_KEY = 'product_data'

interface ProductContextType {
  products: Product[]
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProductById: (id: string) => Product | undefined
  getActiveProducts: () => Product[]
}

const ProductContext = createContext<ProductContextType | null>(null)

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_001',
    name: '农夫山泉矿泉水',
    code: 'PROD-WATER-001',
    category: ProductCategory.BEVERAGE,
    unit: '瓶',
    specification: '550ml/瓶',
    description: '天然饮用水',
    status: ProductStatus.ACTIVE,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'prod_002',
    name: '可口可乐',
    code: 'PROD-COLA-001',
    category: ProductCategory.BEVERAGE,
    unit: '瓶',
    specification: '500ml/瓶',
    description: '碳酸饮料',
    status: ProductStatus.ACTIVE,
    createdAt: Date.now() - 86400000 * 25,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'prod_003',
    name: '康师傅方便面',
    code: 'PROD-NOODLE-001',
    category: ProductCategory.FOOD,
    unit: '桶',
    specification: '120g/桶',
    description: '红烧牛肉面',
    status: ProductStatus.ACTIVE,
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'prod_004',
    name: '新鲜苹果',
    code: 'PROD-APPLE-001',
    category: ProductCategory.FRESH,
    unit: 'kg',
    specification: '红富士',
    description: '新鲜水果',
    status: ProductStatus.ACTIVE,
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'prod_005',
    name: '冷冻水饺',
    code: 'PROD-DUMPLING-001',
    category: ProductCategory.FROZEN,
    unit: '袋',
    specification: '500g/袋',
    description: '猪肉白菜馅',
    status: ProductStatus.ACTIVE,
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 86400000 * 1,
  },
]

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const saved = getFromStorage<Product[]>(STORAGE_KEY)
    if (saved && saved.length > 0) {
      setProducts(saved)
    } else {
      setProducts(MOCK_PRODUCTS)
      saveToStorage(STORAGE_KEY, MOCK_PRODUCTS)
    }
  }, [])

  useEffect(() => {
    if (products.length > 0) {
      saveToStorage(STORAGE_KEY, products)
    }
  }, [products])

  const generateId = () => `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now()
    const newProduct: Product = {
      ...productData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    setProducts((prev) => [newProduct, ...prev])
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, ...updates, updatedAt: Date.now() } : product
      )
    )
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id))
  }

  const getProductById = (id: string): Product | undefined => {
    return products.find((product) => product.id === id)
  }

  const getActiveProducts = (): Product[] => {
    return products.filter((product) => product.status === ProductStatus.ACTIVE)
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getActiveProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) throw new Error('useProducts must be used within ProductProvider')
  return context
}
