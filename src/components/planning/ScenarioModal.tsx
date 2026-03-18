import { useState } from 'react'
import { Scenario, PlanType } from '@/types'
import './ScenarioModal.css'

interface ScenarioModalProps {
  isOpen: boolean
  scenarios: Scenario[]
  onClose: () => void
  onConfirm: (scenarioType: string, planType: PlanType) => void
}

const ScenarioModal = ({ isOpen, scenarios, onClose, onConfirm }: ScenarioModalProps) => {
  const [selectedScenario, setSelectedScenario] = useState<string>('')
  const [selectedPlanType, setSelectedPlanType] = useState<PlanType>(PlanType.PURCHASE)

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!selectedScenario) {
      alert('请选择一个场景')
      return
    }
    onConfirm(selectedScenario, selectedPlanType)
    setSelectedScenario('')
    setSelectedPlanType(PlanType.PURCHASE)
  }

  const handleCancel = () => {
    setSelectedScenario('')
    setSelectedPlanType(PlanType.PURCHASE)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">发起场景计划</h2>
          <button className="modal-close" onClick={handleCancel}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">选择场景</label>
            <div className="scenario-list">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.type}
                  className={`scenario-item ${selectedScenario === scenario.type ? 'selected' : ''}`}
                  onClick={() => setSelectedScenario(scenario.type)}
                >
                  <div className="scenario-name">{scenario.name}</div>
                  <div className="scenario-description">{scenario.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">计划类型</label>
            <div className="plan-type-selector">
              <button
                className={`plan-type-btn ${selectedPlanType === PlanType.PURCHASE ? 'active' : ''}`}
                onClick={() => setSelectedPlanType(PlanType.PURCHASE)}
              >
                采购计划
              </button>
              <button
                className={`plan-type-btn ${selectedPlanType === PlanType.TRANSFER ? 'active' : ''}`}
                onClick={() => setSelectedPlanType(PlanType.TRANSFER)}
              >
                调拨计划
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleCancel}>
            取消
          </button>
          <button className="btn-primary" onClick={handleConfirm}>
            发起
          </button>
        </div>
      </div>
    </div>
  )
}

export default ScenarioModal
