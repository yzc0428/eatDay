import { useState } from 'react'
import { usePlanning } from '@/contexts'
import { PlanCard, ScenarioModal } from '@/components/planning'
import { PlanType } from '@/types'
import './index.css'

const PlanningConsole = () => {
  const { plans, generateScenarioPlan, scenarios } = usePlanning()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterType, setFilterType] = useState<PlanType | 'all'>('all')

  const filteredPlans = filterType === 'all' 
    ? plans 
    : plans.filter(plan => plan.type === filterType)

  const handleGeneratePlan = (scenario: any) => {
    generateScenarioPlan(scenario)
  }

  return (
    <div className="planning-console">
      <div className="console-header">
        <div className="header-left">
          <h1 className="console-title">📋 计划域控制台</h1>
          <p className="console-subtitle">管理采购计划和调拨计划</p>
        </div>
        <button className="btn-create" onClick={() => setIsModalOpen(true)}>
          ➕ 发起场景计划
        </button>
      </div>

      <div className="console-filters">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            全部计划 ({plans.length})
          </button>
          <button
            className={`filter-tab ${filterType === PlanType.PURCHASE ? 'active' : ''}`}
            onClick={() => setFilterType(PlanType.PURCHASE)}
          >
            采购计划 ({plans.filter(p => p.type === PlanType.PURCHASE).length})
          </button>
          <button
            className={`filter-tab ${filterType === PlanType.TRANSFER ? 'active' : ''}`}
            onClick={() => setFilterType(PlanType.TRANSFER)}
          >
            调拨计划 ({plans.filter(p => p.type === PlanType.TRANSFER).length})
          </button>
        </div>
      </div>

      <div className="console-content">
        {filteredPlans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3 className="empty-title">暂无计划</h3>
            <p className="empty-desc">点击"发起场景计划"按钮创建新的计划</p>
          </div>
        ) : (
          <div className="plans-list">
            {filteredPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}
      </div>

      <ScenarioModal
        isOpen={isModalOpen}
        scenarios={scenarios}
        onConfirm={handleGeneratePlan}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default PlanningConsole
