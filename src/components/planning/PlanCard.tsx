import { Plan, PlanType, PlanStatus, PurchasePlan, TransferPlan } from '@/types'
import { formatDate } from '@/utils/date'
import { usePlanning } from '@/contexts'
import './PlanCard.css'

interface PlanCardProps {
  plan: Plan
}

const PlanCard = ({ plan }: PlanCardProps) => {
  const { updatePlanStatus, deletePlan } = usePlanning()

  const getStatusText = (status: PlanStatus) => {
    const statusMap = {
      [PlanStatus.PENDING]: '待处理',
      [PlanStatus.IN_PROGRESS]: '进行中',
      [PlanStatus.COMPLETED]: '已完成',
      [PlanStatus.CANCELLED]: '已取消',
    }
    return statusMap[status]
  }

  const getStatusClass = (status: PlanStatus) => {
    const classMap = {
      [PlanStatus.PENDING]: 'status-pending',
      [PlanStatus.IN_PROGRESS]: 'status-in-progress',
      [PlanStatus.COMPLETED]: 'status-completed',
      [PlanStatus.CANCELLED]: 'status-cancelled',
    }
    return classMap[status]
  }

  const getScenarioText = (scenarioType?: string) => {
    if (!scenarioType) return null
    const scenarioMap: Record<string, string> = {
      evening_peak: '晚高峰',
      rainstorm: '暴雨',
      holiday: '节假日',
      promotion: '促销活动',
    }
    return scenarioMap[scenarioType] || scenarioType
  }

  const handleStatusChange = (newStatus: PlanStatus) => {
    updatePlanStatus(plan.id, newStatus)
  }

  const handleDelete = () => {
    if (window.confirm('确定要删除这个计划吗？')) {
      deletePlan(plan.id)
    }
  }

  const getReasonText = (reason?: any) => {
    if (!reason) return null
    const typeMap: Record<string, string> = {
      low_stock: '库存不足',
      buffer_shortage: 'Buffer不足',
      smax_exceeded: '超过SMAX',
      smin_below: '低于SMIN',
      demand_forecast: '需求预测',
    }
    return typeMap[reason.type] || reason.type
  }

  const renderPlanDetails = () => {
    if (plan.type === PlanType.PURCHASE) {
      const purchasePlan = plan as PurchasePlan
      return (
        <div className="plan-details">
          <div className="detail-row">
            <span className="detail-label">采购项目数：</span>
            <span className="detail-value">{purchasePlan.items.length} 项</span>
          </div>
          {purchasePlan.reason && (
            <div className="plan-reason">
              <span className="reason-badge">{getReasonText(purchasePlan.reason)}</span>
              <span className="reason-text">{purchasePlan.reason.description}</span>
              {purchasePlan.reason.parameter && (
                <span className="reason-detail">
                  {purchasePlan.reason.parameter}: {purchasePlan.reason.currentValue} / {purchasePlan.reason.thresholdValue}
                </span>
              )}
            </div>
          )}
          <div className="items-preview">
            {purchasePlan.items.slice(0, 5).map((item) => (
              <div key={item.itemId} className="item-preview">
                <span className="item-name">
                  <span className="item-id">{item.itemId}</span>
                  {item.itemName}
                </span>
                <span className="item-info">
                  <span className="item-quantity">{item.quantity} {item.unit}</span>
                  {item.warehouse && <span className="item-warehouse">({item.warehouse})</span>}
                </span>
              </div>
            ))}
            {purchasePlan.items.length > 5 && (
              <div className="item-more">还有 {purchasePlan.items.length - 5} 项...</div>
            )}
          </div>
        </div>
      )
    } else {
      const transferPlan = plan as TransferPlan
      return (
        <div className="plan-details">
          <div className="detail-row">
            <span className="detail-label">调拨项目数：</span>
            <span className="detail-value">{transferPlan.items.length} 项</span>
          </div>
          <div className="items-preview">
            {transferPlan.items.slice(0, 5).map((item) => (
              <div key={item.itemId} className="item-preview">
                <span className="item-name">
                  <span className="item-id">{item.itemId}</span>
                  {item.itemName}
                </span>
                <span className="item-route">
                  {item.fromLocation} → {item.toLocation}
                </span>
              </div>
            ))}
            {transferPlan.items.length > 5 && (
              <div className="item-more">还有 {transferPlan.items.length - 5} 项...</div>
            )}
          </div>
        </div>
      )
    }
  }

  return (
    <div className="plan-card">
      <div className="plan-header">
        <div className="plan-title-row">
          <h3 className="plan-title">
            {plan.type === PlanType.PURCHASE ? '采购计划' : '调拨计划'}
          </h3>
          <span className={`plan-status ${getStatusClass(plan.status)}`}>
            {getStatusText(plan.status)}
          </span>
        </div>
        <div className="plan-meta">
          <span className="plan-id">ID: {plan.id}</span>
          {plan.scenario && (
            <span className="plan-scenario">场景: {getScenarioText(plan.scenario)}</span>
          )}
        </div>
      </div>

      {renderPlanDetails()}

      {plan.notes && (
        <div className="plan-notes">
          <span className="notes-label">备注：</span>
          <span className="notes-content">{plan.notes}</span>
        </div>
      )}

      <div className="plan-footer">
        <div className="plan-time">
          <span>创建时间：{formatDate(plan.createdAt)}</span>
        </div>
        <div className="plan-actions">
          {plan.status === PlanStatus.PENDING && (
            <button
              className="btn-action btn-start"
              onClick={(e) => {
                e.stopPropagation()
                handleStatusChange(PlanStatus.COMPLETED)
              }}
            >
              开始下发
            </button>
          )}
          {plan.status !== PlanStatus.COMPLETED && plan.status !== PlanStatus.PENDING && (
            <button
              className="btn-action btn-complete"
              onClick={(e) => {
                e.stopPropagation()
                handleStatusChange(PlanStatus.COMPLETED)
              }}
            >
              标记完成
            </button>
          )}
          {plan.status !== PlanStatus.COMPLETED && (
            <button
              className="btn-action btn-cancel"
              onClick={(e) => {
                e.stopPropagation()
                handleStatusChange(PlanStatus.CANCELLED)
              }}
            >
              取消
            </button>
          )}
          <button
            className="btn-action btn-delete"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
          >
            删除
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlanCard
