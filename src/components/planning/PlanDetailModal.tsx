import { Plan, PlanType, PurchasePlan, TransferPlan, PlanStatus } from '@/types'
import { formatDate } from '@/utils/date'
import './PlanDetailModal.css'

interface PlanDetailModalProps {
  plan: Plan | null
  isOpen: boolean
  onClose: () => void
  onEdit: (plan: Plan) => void
}

const PlanDetailModal = ({ plan, isOpen, onClose, onEdit }: PlanDetailModalProps) => {
  if (!isOpen || !plan) return null

  const getStatusText = (status: PlanStatus) => {
    const statusMap = {
      [PlanStatus.PENDING]: '待处理',
      [PlanStatus.IN_PROGRESS]: '进行中',
      [PlanStatus.COMPLETED]: '已完成',
      [PlanStatus.CANCELLED]: '已取消',
    }
    return statusMap[status]
  }

  const getScenarioText = (scenarioType?: string) => {
    if (!scenarioType) return '无'
    const scenarioMap: Record<string, string> = {
      evening_peak: '晚高峰',
      rainstorm: '暴雨',
      holiday: '节假日',
      promotion: '促销活动',
    }
    return scenarioMap[scenarioType] || scenarioType
  }

  const getReasonTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      low_stock: '库存不足',
      buffer_shortage: 'Buffer不足',
      smax_exceeded: '超过SMAX',
      smin_below: '低于SMIN',
      demand_forecast: '需求预测',
    }
    return typeMap[type] || type
  }

  const renderItems = () => {
    if (plan.type === PlanType.PURCHASE) {
      const purchasePlan = plan as PurchasePlan
      return (
        <div className="items-section">
          <h3 className="section-title">采购项目明细</h3>
          <table className="items-table">
            <thead>
              <tr>
                <th>货品ID</th>
                <th>物品名称</th>
                <th>计划量</th>
                <th>单位</th>
                <th>目标仓库</th>
              </tr>
            </thead>
            <tbody>
              {purchasePlan.items.map((item) => (
                <tr key={item.itemId}>
                  <td className="item-id-cell">{item.itemId}</td>
                  <td>{item.itemName}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit}</td>
                  <td>{item.warehouse || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    } else {
      const transferPlan = plan as TransferPlan
      return (
        <div className="items-section">
          <h3 className="section-title">调拨项目明细</h3>
          <table className="items-table">
            <thead>
              <tr>
                <th>货品ID</th>
                <th>物品名称</th>
                <th>数量</th>
                <th>单位</th>
                <th>起始位置</th>
                <th>目标位置</th>
              </tr>
            </thead>
            <tbody>
              {transferPlan.items.map((item) => (
                <tr key={item.itemId}>
                  <td className="item-id-cell">{item.itemId}</td>
                  <td>{item.itemName}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit}</td>
                  <td>{item.fromLocation}</td>
                  <td>{item.toLocation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
  }

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="detail-modal-header">
          <h2 className="detail-modal-title">计划详情</h2>
          <button className="detail-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="detail-modal-body">
          <div className="info-section">
            <div className="info-row">
              <span className="info-label">计划ID：</span>
              <span className="info-value">{plan.id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">计划类型：</span>
              <span className="info-value">
                {plan.type === PlanType.PURCHASE ? '采购计划' : '调拨计划'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">关联场景：</span>
              <span className="info-value">{getScenarioText(plan.scenario)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">计划状态：</span>
              <span className="info-value">{getStatusText(plan.status)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">创建时间：</span>
              <span className="info-value">{formatDate(plan.createdAt)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">更新时间：</span>
              <span className="info-value">{formatDate(plan.updatedAt)}</span>
            </div>
            {plan.notes && (
              <div className="info-row">
                <span className="info-label">备注：</span>
                <span className="info-value">{plan.notes}</span>
              </div>
            )}
          </div>

          {plan.type === PlanType.PURCHASE && (plan as any).reason && (
            <div className="reason-section">
              <h3 className="section-title">触发原因</h3>
              <div className="reason-card">
                <div className="reason-type">{getReasonTypeText((plan as any).reason.type)}</div>
                <div className="reason-desc">{(plan as any).reason.description}</div>
                {(plan as any).reason.warehouse && (
                  <div className="reason-meta">
                    <span>仓库：{(plan as any).reason.warehouse}</span>
                  </div>
                )}
                {(plan as any).reason.parameter && (
                  <div className="reason-params">
                    <span className="param-label">{(plan as any).reason.parameter}：</span>
                    <span className="param-current">{(plan as any).reason.currentValue}</span>
                    <span className="param-divider">/</span>
                    <span className="param-threshold">{(plan as any).reason.thresholdValue}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {renderItems()}
        </div>

        <div className="detail-modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            关闭
          </button>
          <button className="btn-primary" onClick={() => onEdit(plan)}>
            编辑计划
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlanDetailModal
