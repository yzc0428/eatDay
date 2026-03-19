import { useState } from 'react'
import { useWarehouse } from '@/contexts'
import { WarehouseType, WarehouseStatus } from '@/types'
import WarehouseCard from '@/components/warehouse/WarehouseCard'
import AddWarehouseModal from '@/components/warehouse/AddWarehouseModal'
import './index.css'

const TYPE_FILTERS = [
  { key: 'all', label: '全部仓库' },
  { key: WarehouseType.CENTER, label: '中心仓' },
  { key: WarehouseType.FRONT, label: '前置仓' },
  { key: WarehouseType.VIRTUAL, label: '虚拟仓' },
]

const STATUS_FILTERS = [
  { key: 'all', label: '全部状态' },
  { key: WarehouseStatus.ACTIVE, label: '正常运营' },
  { key: WarehouseStatus.BUILDING, label: '建设中' },
  { key: WarehouseStatus.INACTIVE, label: '已停用' },
]

const WarehouseConsolePage = () => {
  const { warehouses } = useWarehouse()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchKeyword, setSearchKeyword] = useState('')

  const filteredWarehouses = warehouses.filter((wh) => {
    const matchesType = typeFilter === 'all' || wh.type === typeFilter
    const matchesStatus = statusFilter === 'all' || wh.status === statusFilter
    const matchesKeyword =
      !searchKeyword ||
      wh.name.includes(searchKeyword) ||
      wh.code.includes(searchKeyword) ||
      wh.city.includes(searchKeyword)
    return matchesType && matchesStatus && matchesKeyword
  })

  const stats = {
    total: warehouses.length,
    center: warehouses.filter((wh) => wh.type === WarehouseType.CENTER).length,
    front: warehouses.filter((wh) => wh.type === WarehouseType.FRONT).length,
    virtual: warehouses.filter((wh) => wh.type === WarehouseType.VIRTUAL).length,
    active: warehouses.filter((wh) => wh.status === WarehouseStatus.ACTIVE).length,
  }

  return (
    <div className="warehouse-console">
      {/* 页面头部 */}
      <div className="console-header">
        <div className="header-content">
          <h1 className="page-title">仓库控制台</h1>
          <p className="page-description">管理中心仓、前置仓和虚拟仓，查看仓库基础信息和运营状态</p>
        </div>
        <div className="header-actions">
          <button className="btn-create-warehouse" onClick={() => setIsAddModalOpen(true)}>
            + 新增仓库
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="console-stats">
        <div className="stat-card">
          <div className="stat-label">仓库总数</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">中心仓</div>
          <div className="stat-value stat-center">{stats.center}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">前置仓</div>
          <div className="stat-value stat-front">{stats.front}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">虚拟仓</div>
          <div className="stat-value stat-virtual">{stats.virtual}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">正常运营</div>
          <div className="stat-value stat-active">{stats.active}</div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="console-filters">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="搜索仓库名称、编码、城市..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
        <div className="filter-divider" />
        <div className="filter-group">
          {TYPE_FILTERS.map((filter) => (
            <button
              key={filter.key}
              className={`filter-btn ${typeFilter === filter.key ? 'active' : ''}`}
              onClick={() => setTypeFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="filter-divider" />
        <div className="filter-group">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.key}
              className={`filter-btn ${statusFilter === filter.key ? 'active' : ''}`}
              onClick={() => setStatusFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* 仓库列表 */}
      <div className="console-content">
        <div className="content-toolbar">
          <span className="result-count">共 {filteredWarehouses.length} 个仓库</span>
        </div>

        {filteredWarehouses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏭</div>
            <div className="empty-title">
              {warehouses.length === 0 ? '暂无仓库数据' : '没有符合条件的仓库'}
            </div>
            <div className="empty-description">
              {warehouses.length === 0
                ? '点击右上角「新增仓库」按钮，添加您的第一个仓库'
                : '请尝试调整筛选条件或搜索关键词'}
            </div>
          </div>
        ) : (
          <div className="warehouses-list">
            {filteredWarehouses.map((warehouse) => (
              <WarehouseCard key={warehouse.id} warehouse={warehouse} />
            ))}
          </div>
        )}
      </div>

      <AddWarehouseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  )
}

export default WarehouseConsolePage
