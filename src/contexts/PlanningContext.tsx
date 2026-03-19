import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Plan, PlanType, PlanStatus, PurchasePlan, TransferPlan, ScenarioType, Scenario } from '@/types'
import { getFromStorage, saveToStorage } from '@/utils/storage'

const STORAGE_KEY = 'planning_data'

interface PlanningContextType {
  plans: Plan[]
  addPlan: (plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>) => void
  updatePlan: (id: string, updates: Partial<Plan>) => void
  deletePlan: (id: string) => void
  generateScenarioPlan: (scenario: ScenarioType) => void
  scenarios: Scenario[]
}

const PlanningContext = createContext<PlanningContextType | null>(null)

const SCENARIOS: Scenario[] = [
  {
    type: ScenarioType.EVENING_PEAK,
    name: '晚高峰',
    description: '晚间订单高峰期，需要提前备货',
  },
  {
    type: ScenarioType.RAINSTORM,
    name: '暴雨天气',
    description: '恶劣天气导致配送困难，需增加库存',
  },
  {
    type: ScenarioType.HOLIDAY,
    name: '节假日',
    description: '节假日订单量激增，需大量备货',
  },
  {
    type: ScenarioType.PROMOTION,
    name: '促销活动',
    description: '促销活动期间，特定商品需求增加',
  },
]

const MOCK_PLANS: Plan[] = [
  {
    id: 'plan_001',
    type: PlanType.PURCHASE,
    scenario: ScenarioType.EVENING_PEAK,
    items: [
      { itemId: 'item_001', itemName: '农夫山泉矿泉水', quantity: 500, unit: '瓶', warehouse: '西湖区前置仓' },
      { itemId: 'item_002', itemName: '可口可乐', quantity: 300, unit: '瓶', warehouse: '西湖区前置仓' },
      { itemId: 'item_003', itemName: '康师傅方便面', quantity: 200, unit: '桶', warehouse: '滨江区前置仓' },
    ],
    status: PlanStatus.PENDING,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
    createdBy: '系统',
    notes: '晚高峰场景自动生成',
    reason: {
      type: 'demand_forecast',
      description: '基于晚高峰历史数据预测需求',
    },
  } as PurchasePlan,
  {
    id: 'plan_002',
    type: PlanType.TRANSFER,
    scenario: ScenarioType.RAINSTORM,
    items: [
      { itemId: 'item_001', itemName: '农夫山泉矿泉水', quantity: 200, unit: '瓶', fromLocation: '杭州中心仓', toLocation: '西湖区前置仓' },
      { itemId: 'item_004', itemName: '新鲜苹果', quantity: 100, unit: 'kg', fromLocation: '杭州中心仓', toLocation: '滨江区前置仓' },
    ],
    status: PlanStatus.IN_PROGRESS,
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 86400000 * 1,
    createdBy: '张三',
    notes: '暴雨天气应急调拨',
  } as TransferPlan,
]

export const PlanningProvider = ({ children }: { children: ReactNode }) => {
  const [plans, setPlans] = useState<Plan[]>([])

  useEffect(() => {
    const saved = getFromStorage<Plan[]>(STORAGE_KEY)
    if (saved && saved.length > 0) {
      setPlans(saved)
    } else {
      setPlans(MOCK_PLANS)
      saveToStorage(STORAGE_KEY, MOCK_PLANS)
    }
  }, [])

  useEffect(() => {
    if (plans.length > 0) {
      saveToStorage(STORAGE_KEY, plans)
    }
  }, [plans])

  const generateId = () => `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const addPlan = (planData: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now()
    const newPlan = { ...planData, id: generateId(), createdAt: now, updatedAt: now } as Plan
    setPlans((prev) => [newPlan, ...prev])
  }

  const updatePlan = (id: string, updates: Partial<Plan>) => {
    setPlans((prev) =>
      prev.map((plan) => (plan.id === id ? { ...plan, ...updates, updatedAt: Date.now() } as Plan : plan))
    )
  }

  const deletePlan = (id: string) => {
    setPlans((prev) => prev.filter((plan) => plan.id !== id))
  }

  const generateScenarioPlan = (scenario: ScenarioType) => {
    const now = Date.now()
    const scenarioInfo = SCENARIOS.find((s) => s.type === scenario)
    
    // 根据场景生成采购计划
    const newPlan: Omit<PurchasePlan, 'id' | 'createdAt' | 'updatedAt'> = {
      type: PlanType.PURCHASE,
      scenario,
      items: [
        { itemId: 'item_001', itemName: '农夫山泉矿泉水', quantity: 800, unit: '瓶', warehouse: '西湖区前置仓' },
        { itemId: 'item_002', itemName: '可口可乐', quantity: 500, unit: '瓶', warehouse: '滨江区前置仓' },
        { itemId: 'item_003', itemName: '康师傅方便面', quantity: 300, unit: '桶', warehouse: '西湖区前置仓' },
      ],
      status: PlanStatus.PENDING,
      createdBy: '业务小二',
      notes: `${scenarioInfo?.name}场景计划`,
      reason: {
        type: 'demand_forecast',
        description: `基于${scenarioInfo?.name}场景预测生成`,
      },
    }

    addPlan(newPlan)
  }

  return (
    <PlanningContext.Provider
      value={{
        plans,
        addPlan,
        updatePlan,
        deletePlan,
        generateScenarioPlan,
        scenarios: SCENARIOS,
      }}
    >
      {children}
    </PlanningContext.Provider>
  )
}

export const usePlanning = () => {
  const context = useContext(PlanningContext)
  if (!context) throw new Error('usePlanning must be used within PlanningProvider')
  return context
}
