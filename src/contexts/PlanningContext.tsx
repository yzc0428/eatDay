import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  Plan,
  PurchasePlan,
  TransferPlan,
  PlanType,
  PlanStatus,
  ScenarioType,
  Scenario,
} from '@/types'
import { getFromStorage, saveToStorage } from '@/utils/storage'

interface PlanningContextType {
  plans: Plan[]
  scenarios: Scenario[]
  addPurchasePlan: (plan: Omit<PurchasePlan, 'id' | 'createdAt' | 'updatedAt'>) => void
  addTransferPlan: (plan: Omit<TransferPlan, 'id' | 'createdAt' | 'updatedAt'>) => void
  createScenarioPlan: (scenarioType: ScenarioType, planType: PlanType) => void
  updatePlanStatus: (planId: string, status: PlanStatus) => void
  deletePlan: (planId: string) => void
  getPlanById: (planId: string) => Plan | undefined
}

const PlanningContext = createContext<PlanningContextType | undefined>(undefined)

const STORAGE_KEY = 'planning_data'

// 预定义的场景列表
const DEFAULT_SCENARIOS: Scenario[] = [
  {
    type: ScenarioType.EVENING_PEAK,
    name: '晚高峰',
    description: '应对晚间用餐高峰期的计划',
  },
  {
    type: ScenarioType.RAINSTORM,
    name: '暴雨',
    description: '应对暴雨天气的特殊计划',
  },
  {
    type: ScenarioType.HOLIDAY,
    name: '节假日',
    description: '应对节假日客流增加的计划',
  },
  {
    type: ScenarioType.PROMOTION,
    name: '促销活动',
    description: '应对促销活动期间的计划',
  },
]

// Mock 数据
const MOCK_PLANS: Plan[] = [
  {
    id: 'plan_1710000001_abc123',
    type: PlanType.PURCHASE,
    scenario: ScenarioType.EVENING_PEAK,
    items: [
      {
        itemId: 'SKU20240001',
        itemName: '有机西兰花',
        quantity: 150,
        unit: '千克',
        warehouse: '中心仓',
      },
      {
        itemId: 'SKU20240002',
        itemName: '澳洲牛腱子',
        quantity: 80,
        unit: '千克',
        warehouse: '中心仓',
      },
      {
        itemId: 'SKU20240003',
        itemName: '海天生抽酱油',
        quantity: 30,
        unit: '瓶',
        warehouse: '东区前置仓',
      },
      {
        itemId: 'SKU20240004',
        itemName: '五常大米',
        quantity: 200,
        unit: '千克',
        warehouse: '中心仓',
      },
      {
        itemId: 'SKU20240005',
        itemName: '智利车厘子',
        quantity: 100,
        unit: '千克',
        warehouse: '西区前置仓',
      },
    ],
    status: PlanStatus.IN_PROGRESS,
    createdAt: Date.now() - 3600000 * 2,
    updatedAt: Date.now() - 1800000,
    notes: '晚高峰场景自动生成的采购计划',
    reason: {
      type: 'low_stock',
      description: '中心仓库存低于安全库存阈值',
      warehouse: '中心仓',
      parameter: 'SMIN',
      currentValue: 120,
      thresholdValue: 200,
    },
  },
  {
    id: 'plan_1710000002_def456',
    type: PlanType.TRANSFER,
    scenario: ScenarioType.RAINSTORM,
    items: [
      {
        itemId: 'SKU20240101',
        itemName: '一次性雨衣',
        quantity: 50,
        unit: '件',
        fromLocation: '中心仓',
        toLocation: '东区前置仓',
      },
      {
        itemId: 'SKU20240102',
        itemName: '方便面（康师傅红烧牛肉）',
        quantity: 100,
        unit: '箱',
        fromLocation: '中心仓',
        toLocation: '西区前置仓',
      },
      {
        itemId: 'SKU20240103',
        itemName: '矿泉水（农夫山泉550ml）',
        quantity: 30,
        unit: '箱',
        fromLocation: '南区前置仓',
        toLocation: '北区前置仓',
      },
    ],
    status: PlanStatus.COMPLETED,
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 3600000,
    notes: '暴雨场景自动生成的调拨计划',
  },
  {
    id: 'plan_1710000003_ghi789',
    type: PlanType.PURCHASE,
    scenario: ScenarioType.HOLIDAY,
    items: [
      {
        itemId: 'SKU20240201',
        itemName: '波士顿龙虾',
        quantity: 200,
        unit: '千克',
        warehouse: '南区前置仓',
      },
      {
        itemId: 'SKU20240202',
        itemName: '稻香村月饼礼盒',
        quantity: 100,
        unit: '盒',
        warehouse: '南区前置仓',
      },
      {
        itemId: 'SKU20240203',
        itemName: '茅台飞天53度',
        quantity: 150,
        unit: '瓶',
        warehouse: '北区前置仓',
      },
      {
        itemId: 'SKU20240204',
        itemName: '哈根达斯冰淇淋蛋糕',
        quantity: 80,
        unit: '个',
        warehouse: '南区前置仓',
      },
    ],
    status: PlanStatus.PENDING,
    createdAt: Date.now() - 1800000,
    updatedAt: Date.now() - 1800000,
    notes: '节假日场景自动生成的采购计划',
    reason: {
      type: 'demand_forecast',
      description: '节假日需求预测显示库存不足',
      warehouse: '南区前置仓',
      parameter: 'Buffer',
      currentValue: 50,
      thresholdValue: 150,
    },
  },
  {
    id: 'plan_1710000004_jkl012',
    type: PlanType.TRANSFER,
    scenario: ScenarioType.PROMOTION,
    items: [
      {
        itemId: 'SKU20240301',
        itemName: '可口可乐330ml',
        quantity: 80,
        unit: '箱',
        fromLocation: '中心仓',
        toLocation: '市中心前置仓',
      },
      {
        itemId: 'SKU20240302',
        itemName: '三只松鼠坚果礼包',
        quantity: 60,
        unit: '箱',
        fromLocation: '中心仓',
        toLocation: '北区前置仓',
      },
      {
        itemId: 'SKU20240303',
        itemName: '促销海报',
        quantity: 200,
        unit: '张',
        fromLocation: '东区前置仓',
        toLocation: '西区前置仓',
      },
      {
        itemId: 'SKU20240304',
        itemName: '购物袋（环保袋）',
        quantity: 150,
        unit: '个',
        fromLocation: '南区前置仓',
        toLocation: '北区前置仓',
      },
    ],
    status: PlanStatus.PENDING,
    createdAt: Date.now() - 900000,
    updatedAt: Date.now() - 900000,
    notes: '促销活动场景自动生成的调拨计划',
  },
]

export const PlanningProvider = ({ children }: { children: ReactNode }) => {
  const [plans, setPlans] = useState<Plan[]>([])
  const [scenarios] = useState<Scenario[]>(DEFAULT_SCENARIOS)

  // 从本地存储加载数据
  useEffect(() => {
    const savedPlans = getFromStorage<Plan[]>(STORAGE_KEY)
    if (savedPlans && savedPlans.length > 0) {
      setPlans(savedPlans)
    } else {
      // 如果本地没有数据，使用 mock 数据
      setPlans(MOCK_PLANS)
      saveToStorage(STORAGE_KEY, MOCK_PLANS)
    }
  }, [])

  // 保存数据到本地存储
  useEffect(() => {
    saveToStorage(STORAGE_KEY, plans)
  }, [plans])

  // 生成唯一ID
  const generateId = () => {
    return `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // 添加采购计划
  const addPurchasePlan = (
    plan: Omit<PurchasePlan, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = Date.now()
    const newPlan: PurchasePlan = {
      ...plan,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    setPlans((prev) => [newPlan, ...prev])
  }

  // 添加调拨计划
  const addTransferPlan = (
    plan: Omit<TransferPlan, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = Date.now()
    const newPlan: TransferPlan = {
      ...plan,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    setPlans((prev) => [newPlan, ...prev])
  }

  // 根据场景创建计划
  const createScenarioPlan = (scenarioType: ScenarioType, planType: PlanType) => {
    const now = Date.now()
    const scenario = scenarios.find((s) => s.type === scenarioType)

    if (planType === PlanType.PURCHASE) {
      // 根据场景生成模拟的采购计划
      const mockPurchasePlan: PurchasePlan = {
        id: generateId(),
        type: PlanType.PURCHASE,
        scenario: scenarioType,
        items: [
          {
            itemId: `SKU${Date.now()}001`,
            itemName: '新西兰牛奶',
            quantity: 100,
            unit: '箱',
            warehouse: '中心仓',
          },
          {
            itemId: `SKU${Date.now()}002`,
            itemName: '金龙鱼食用油5L',
            quantity: 50,
            unit: '桶',
            warehouse: '东区前置仓',
          },
          {
            itemId: `SKU${Date.now()}003`,
            itemName: '泰国香米',
            quantity: 75,
            unit: '袋',
            warehouse: '中心仓',
          },
        ],
        status: PlanStatus.PENDING,
        createdAt: now,
        updatedAt: now,
        notes: `${scenario?.name}场景自动生成的采购计划`,
        reason: {
          type: 'smin_below',
          description: `${scenario?.name}场景触发，库存低于SMIN阈值`,
          warehouse: '中心仓',
          parameter: 'SMIN',
          currentValue: 80,
          thresholdValue: 150,
        },
      }
      setPlans((prev) => [mockPurchasePlan, ...prev])
    } else {
      // 根据场景生成模拟的调拨计划
      const mockTransferPlan: TransferPlan = {
        id: generateId(),
        type: PlanType.TRANSFER,
        scenario: scenarioType,
        items: [
          {
            itemId: `SKU${Date.now()}101`,
            itemName: '蒙牛纯牛奶250ml',
            quantity: 30,
            unit: '箱',
            fromLocation: '中心仓',
            toLocation: '东区前置仓',
          },
          {
            itemId: `SKU${Date.now()}102`,
            itemName: '康师傅冰红茶',
            quantity: 20,
            unit: '箱',
            fromLocation: '南区前置仓',
            toLocation: '北区前置仓',
          },
        ],
        status: PlanStatus.PENDING,
        createdAt: now,
        updatedAt: now,
        notes: `${scenario?.name}场景自动生成的调拨计划`,
      }
      setPlans((prev) => [mockTransferPlan, ...prev])
    }
  }

  // 更新计划状态
  const updatePlanStatus = (planId: string, status: PlanStatus) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId ? { ...plan, status, updatedAt: Date.now() } : plan
      )
    )
  }

  // 删除计划
  const deletePlan = (planId: string) => {
    setPlans((prev) => prev.filter((plan) => plan.id !== planId))
  }

  // 根据ID获取计划
  const getPlanById = (planId: string) => {
    return plans.find((plan) => plan.id === planId)
  }

  return (
    <PlanningContext.Provider
      value={{
        plans,
        scenarios,
        addPurchasePlan,
        addTransferPlan,
        createScenarioPlan,
        updatePlanStatus,
        deletePlan,
        getPlanById,
      }}
    >
      {children}
    </PlanningContext.Provider>
  )
}

export const usePlanning = () => {
  const context = useContext(PlanningContext)
  if (!context) {
    throw new Error('usePlanning must be used within PlanningProvider')
  }
  return context
}
