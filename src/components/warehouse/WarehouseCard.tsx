import { Warehouse, WarehouseType, WarehouseStatus, CenterWarehouse, FrontWarehouse, VirtualWarehouse, VirtualBindMode } from '@/types'
import { formatDate } from '@/utils/date'
import { useWarehouse } from '@/contexts/WarehouseContext'
import { useProductWarehouseRelation } from '@/contexts'
import './WarehouseCard.css'

interface WarehouseCardProps {
  warehouse: Warehouse
}

const WarehouseCard = ({ warehouse }: WarehouseCardProps) => {
  const { deleteWarehouse } = useWarehouse()
  const { getRelationsByWarehouseId } = useProductWarehouseRelation()
  
  const productCount = getRelationsByWarehouseId(warehouse.id).length

  const getTypeLabel = (type: WarehouseType) => {
    const labelMap = {
      [WarehouseType.CENTER]: '中心仓',
      [WarehouseType.FRONT]: '前置仓',
      [WarehouseType.VIRTUAL]: '虚拟仓',
    }
    return labelMap[type]
  }

  const getTypeClass = (type: WarehouseType) => {
    const classMap = {
      [WarehouseType.CENTER]: 'type-center',
      [WarehouseType.FRONT]: 'type-front',
      [WarehouseType.VIRTUAL]: 'type-virtual',
    }
    return classMap[type]
  }

  const getStatusLabel = (status: WarehouseStatus) => {
    const labelMap = {
      [WarehouseStatus.ACTIVE]: '正常运营',
      [WarehouseStatus.INACTIVE]: '已停用',
      [WarehouseStatus.BUILDING]: '建设中',
    }
    return labelMap[status]
  }

  const getStatusClass = (status: WarehouseStatus) => {
    const classMap = {
      [WarehouseStatus.ACTIVE]: 'status-active',
      [WarehouseStatus.INACTIVE]: 'status-inactive',
      [WarehouseStatus.BUILDING]: 'status-building',
    }
    return classMap[status]
  }

  const handleDelete = () => {
    if (window.confirm(`确定要删除仓库「${warehouse.name}」吗？`)) {
      deleteWarehouse(warehouse.id)
    }
  }

  const renderDetails = () => {
    if (warehouse.type === WarehouseType.CENTER) {
      const wh = warehouse as CenterWarehouse
      return (
        <div className="warehouse-details">
          <div className="detail-row">
            <span className="detail-label">📍 地址：</span>
            <span className="detail-value">{wh.address}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">📐 面积：</span>
            <span className="detail-value">{wh.area.toLocaleString()} m²</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">📦 库容：</span>
            <span className="detail-value">{wh.capacity.toLocaleString()} 件</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">👤 负责人：</span>
            <span className="detail-value">{wh.manager}（{wh.phone}）</span>
          </div>
        </div>
      )
    }

    if (warehouse.type === WarehouseType.FRONT) {
      const wh = warehouse as FrontWarehouse
      return (
        <div className="warehouse-details">
          <div className="detail-row">
            <span className="detail-label">📍 地址：</span>
            <span className="detail-value">{wh.address}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">🏢 所属中心仓：</span>
            <span className="detail-value">{wh.centerWarehouseName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">📐 面积：</span>
            <span className="detail-value">{wh.area.toLocaleString()} m²</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">🚚 配送半径：</span>
            <span className="detail-value">{wh.deliveryRadius} 公里</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">📦 商品种类：</span>
            <span className="detail-value">{productCount} 种</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">👤 负责人：</span>
            <span className="detail-value">{wh.manager}（{wh.phone}）</span>
          </div>
        </div>
      )
    }

    if (warehouse.type === WarehouseType.VIRTUAL) {
      const wh = warehouse as VirtualWarehouse
      return (
        <div className="warehouse-details">
          <div className="detail-row">
            <span className="detail-label">🏪 线上门店：</span>
            <span className="detail-value">{wh.onlineStoreName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">📱 所属平台：</span>
            <span className="detail-value">{wh.platform}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">🔗 绑定模式：</span>
            <span className="detail-value">
              {wh.bindMode === VirtualBindMode.AUTO ? '系统自动选择' : '人工手动选择'}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">🏭 绑定前置仓：</span>
            <span className="detail-value">
              <div className="bound-warehouses">
                {wh.boundFrontWarehouseNames.map((name, index) => (
                  <span key={index} className="bound-tag">{name}</span>
                ))}
              </div>
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">📦 商品种类：</span>
            <span className="detail-value">{productCount} 种</span>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="warehouse-card">
      <div className="warehouse-header">
        <div className="warehouse-title-row">
          <div className="warehouse-name-group">
            <span className={`warehouse-type-badge ${getTypeClass(warehouse.type)}`}>
              {getTypeLabel(warehouse.type)}
            </span>
            <h3 className="warehouse-name">{warehouse.name}</h3>
          </div>
          <span className={`warehouse-status ${getStatusClass(warehouse.status)}`}>
            {getStatusLabel(warehouse.status)}
          </span>
        </div>
        <div className="warehouse-meta">
          <span className="warehouse-code">编码：{warehouse.code}</span>
          <span className="warehouse-city">📌 {warehouse.city}</span>
        </div>
      </div>

      {renderDetails()}

      {warehouse.notes && (
        <div className="warehouse-notes">
          <span className="notes-label">备注：</span>
          <span className="notes-content">{warehouse.notes}</span>
        </div>
      )}

      <div className="warehouse-footer">
        <div className="warehouse-time">
          <span>创建时间：{formatDate(warehouse.createdAt)}</span>
        </div>
        <div className="warehouse-actions">
          <button
            className="btn-action btn-delete"
            onClick={handleDelete}
          >
            删除
          </button>
        </div>
      </div>
    </div>
  )
}

export default WarehouseCard
