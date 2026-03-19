import { useState } from 'react'
import { Scenario, ScenarioType } from '@/types'
import './ScenarioModal.css'

interface ScenarioModalProps {
  isOpen: boolean
  scenarios: Scenario[]
  onConfirm: (scenario: ScenarioType) => void
  onClose: () => void
}

const ScenarioModal = ({ isOpen, scenarios, onConfirm, onClose }: ScenarioModalProps) => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType | null>(null)

  const handleConfirm = () => {
    if (selectedScenario) {
      onConfirm(selectedScenario)
      setSelectedScenario(null)
      onClose()
    }
  }

  const handleClose = () => {
    setSelectedScenario(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="scenario-modal-overlay" onClick={handleClose}>
      <div className="scenario-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="scenario-modal-header">
          <h2 className="scenario-modal-title">选择场景</h2>
          <button className="scenario-modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="scenario-modal-body">
          <p className="scenario-tip">请选择一个场景来生成对应的计划单</p>
          <div className="scenario-list">
            {scenarios.map((scenario) => (
              <div
                key={scenario.type}
                className={`scenario-option ${selectedScenario === scenario.type ? 'selected' : ''}`}
                onClick={() => setSelectedScenario(scenario.type)}
              >
                <div className="scenario-info">
                  <h3 className="scenario-name">{scenario.name}</h3>
                  <p className="scenario-desc">{scenario.description}</p>
                </div>
                <div className="scenario-radio">
                  {selectedScenario === scenario.type && <span className="radio-checked">✓</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="scenario-modal-footer">
          <button className="btn-secondary" onClick={handleClose}>取消</button>
          <button
            className="btn-primary"
            onClick={handleConfirm}
            disabled={!selectedScenario}
          >
            发起计划
          </button>
        </div>
      </div>
    </div>
  )
}

export default ScenarioModal
