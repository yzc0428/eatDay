import { Plan, PlanType, PlanStatus, PurchasePlan, TransferPlan } from '@/types'
import { formatDate } from '@/utils/date'
import './PlanCard.css'

interface PlanCardProps {
  plan: Plan
}

const PlanCard = ({ plan }: PlanCardProps) => {
  const getTypeLabel = (type: PlanType) => {
    return type === PlanType.PURCHASE ? '采购计划' : '调拨计划'
  }

  const getStatusLabel = (status: PlanStatus) => {
    const labelMap = {
      [PlanStatus.PENDING]: '待处理',
      [PlanStatus.IN_PROGRESS]: '进行中',
      [PlanStatus.COMPLETED]: '已完成',
      [PlanStatus.CANCELLED]: '已取消',
    }
    return labelMap[status]
  }

  const getStatusClass = (status: PlanStatus) => {
    const classMap = {
      [PlanStatus.PENDING]: 'status-pending',
      [PlanStatus.IN_PROGRESS]: 'status-progress',
      [PlanStatus.COMPLETED]: 'status-completed',
      [PlanStatus.CANCELLED]: 'status-cancelled',
    }
    return classMap[status]
  }

  return (
    <div className="plan-card">
      <div className="plan-header">
        <div className="plan-title-row">
          <span className={`plan-type-badge ${plan.type === PlanType.PURCHASE ? 'type-purchase' : 'type-transfer'}`}>
            {getTypeLabel(plan.type)}
          </span>
          <h3 className="plan-id">计划单号：{plan.id}</h3>
        </div>
        <span className={`plan-status ${getStatusClass(plan.status)}`}>
          {getStatusLabel(plan.status)}
        </span>
      </div>

      <div className="plan-details">
        <div className="detail-row">
          <span className="detail-label">📦 计划项数量：</span>
          <span className="detail-value">{plan.items.length} 项</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">👤 创建人：</span>
          <span className="detail-value">{plan.createdBy || '系统'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">📅 创建时间：</span>
          <span className="detail-value">{formatDate(plan.createdAt)}</span>
        </div>
        {plan.scenario && (
          <div className="detail-row">
            <span className="detail-label">🎯 关联场景：</span>
            <span className="detail-value scenario-tag">{plan.scenario}</span>
          </div>
        )}
      </div>

      {plan.notes && (
        <div className="plan-notes">
          <span className="notes-label">备注：</span>
          <span className="notes-content">{plan.notes}</span>
        </div>
      )}

      <div className="plan-items">
        <h4 className="items-title">计划明细</h4>
        <div className="items-list">
          {plan.items.map((item, index) => (
            <div key={index} className="item-row">
              <span className="item-name">{item.itemName}</span>
              <span className="item-quantity">{item.quantity} {item.unit}</span>
              {plan.type === PlanType.PURCHASE && (
                <span className="item-warehouse">{(item as any).warehouse}</span>
              )}
              {plan.type === PlanType.TRANSFER && (
                <span className="item-transfer">
                  {(item as any).fromLocation} → {(item as any).toLocation}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlanCard
