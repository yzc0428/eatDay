import { useState, useMemo } from 'react'
import { usePlanning } from '@/contexts'
import { PlanCard, ScenarioModal, SearchFilter } from '@/components/planning'
import PlanDetailModal from '@/components/planning/PlanDetailModal'
import { Plan, PlanType, PlanStatus } from '@/types'
import { exportPlansToExcel } from '@/utils/export'
import './index.css'

type ViewMode = 'card' | 'list'

const PlanningConsole = () => {
  const { plans, scenarios, createScenarioPlan, updatePlanStatus, deletePlan } = usePlanning()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [filterType, setFilterType] = useState<'all' | PlanType>('all')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [statusFilter, setStatusFilter] = useState<'all' | PlanStatus>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [selectedPlanIds, setSelectedPlanIds] = useState<Set<string>>(new Set())

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleCreatePlan = (scenarioType: string, planType: PlanType) => {
    createScenarioPlan(scenarioType as any, planType)
    setIsModalOpen(false)
  }

  const handleOpenDetail = (plan: Plan) => {
    setSelectedPlan(plan)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false)
    setSelectedPlan(null)
  }

  const handleEditPlan = (plan: Plan) => {
    // 编辑功能暂时使用详情弹窗，可以后续扩展
    alert('编辑功能开发中...')
  }

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword)
  }

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ start: startDate, end: endDate })
  }

  const handleClearFilters = () => {
    setSearchKeyword('')
    setDateRange({ start: '', end: '' })
    setStatusFilter('all')
  }

  const handleExport = () => {
    exportPlansToExcel(filteredPlans, '计划列表')
  }

  const handleSelectPlan = (planId: string) => {
    const newSelected = new Set(selectedPlanIds)
    if (newSelected.has(planId)) {
      newSelected.delete(planId)
    } else {
      newSelected.add(planId)
    }
    setSelectedPlanIds(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedPlanIds.size === filteredPlans.length) {
      setSelectedPlanIds(new Set())
    } else {
      setSelectedPlanIds(new Set(filteredPlans.map((p) => p.id)))
    }
  }

  const handleBatchUpdateStatus = (status: PlanStatus) => {
    selectedPlanIds.forEach((id) => {
      updatePlanStatus(id, status)
    })
    setSelectedPlanIds(new Set())
  }

  const handleBatchDelete = () => {
    if (window.confirm(`确定要删除选中的 ${selectedPlanIds.size} 个计划吗？`)) {
      selectedPlanIds.forEach((id) => {
        deletePlan(id)
      })
      setSelectedPlanIds(new Set())
    }
  }

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      // 类型筛选
      if (filterType !== 'all' && plan.type !== filterType) return false

      // 状态筛选
      if (statusFilter !== 'all' && plan.status !== statusFilter) return false

      // 关键词搜索
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase()
        const matchId = plan.id.toLowerCase().includes(keyword)
        const matchNotes = plan.notes?.toLowerCase().includes(keyword)
        const matchItems =
          plan.type === PlanType.PURCHASE
            ? (plan as any).items.some((item: any) =>
                item.itemName.toLowerCase().includes(keyword)
              )
            : (plan as any).items.some((item: any) =>
                item.itemName.toLowerCase().includes(keyword)
              )
        if (!matchId && !matchNotes && !matchItems) return false
      }

      // 时间范围筛选
      if (dateRange.start) {
        const startTime = new Date(dateRange.start).getTime()
        if (plan.createdAt < startTime) return false
      }
      if (dateRange.end) {
        const endTime = new Date(dateRange.end).getTime() + 86400000 // 加一天
        if (plan.createdAt > endTime) return false
      }

      return true
    })
  }, [plans, filterType, statusFilter, searchKeyword, dateRange])

  const purchasePlansCount = plans.filter((p) => p.type === PlanType.PURCHASE).length
  const transferPlansCount = plans.filter((p) => p.type === PlanType.TRANSFER).length

  return (
    <div className="planning-console">
      <div className="console-header">
        <div className="header-content">
          <h1 className="page-title">计划域控制台</h1>
          <p className="page-description">管理和查看采购计划、调拨计划，发起特殊场景计划</p>
        </div>
        <div className="header-actions">
          <button className="btn-export" onClick={handleExport}>
            📥 导出Excel
          </button>
          <button className="btn-create-plan" onClick={handleOpenModal}>
            + 发起场景计划
          </button>
        </div>
      </div>

      <div className="console-stats">
        <div className="stat-card">
          <div className="stat-label">总计划数</div>
          <div className="stat-value">{plans.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">采购计划</div>
          <div className="stat-value">{purchasePlansCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">调拨计划</div>
          <div className="stat-value">{transferPlansCount}</div>
        </div>
      </div>

      <SearchFilter
        onSearch={handleSearch}
        onDateRangeChange={handleDateRangeChange}
        onClearFilters={handleClearFilters}
      />

      <div className="console-toolbar">
        <div className="console-filters">
          <button
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            全部计划
          </button>
          <button
            className={`filter-btn ${filterType === PlanType.PURCHASE ? 'active' : ''}`}
            onClick={() => setFilterType(PlanType.PURCHASE)}
          >
            采购计划
          </button>
          <button
            className={`filter-btn ${filterType === PlanType.TRANSFER ? 'active' : ''}`}
            onClick={() => setFilterType(PlanType.TRANSFER)}
          >
            调拨计划
          </button>
          <div className="filter-divider"></div>
          <button
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            全部状态
          </button>
          <button
            className={`filter-btn ${statusFilter === PlanStatus.PENDING ? 'active' : ''}`}
            onClick={() => setStatusFilter(PlanStatus.PENDING)}
          >
            待处理
          </button>
          <button
            className={`filter-btn ${statusFilter === PlanStatus.IN_PROGRESS ? 'active' : ''}`}
            onClick={() => setStatusFilter(PlanStatus.IN_PROGRESS)}
          >
            进行中
          </button>
          <button
            className={`filter-btn ${statusFilter === PlanStatus.COMPLETED ? 'active' : ''}`}
            onClick={() => setStatusFilter(PlanStatus.COMPLETED)}
          >
            已完成
          </button>
        </div>

        <div className="view-switcher">
          <button
            className={`view-btn ${viewMode === 'card' ? 'active' : ''}`}
            onClick={() => setViewMode('card')}
            title="卡片视图"
          >
            ▦
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="列表视图"
          >
            ☰
          </button>
        </div>
      </div>


      <div className="console-content">
        {filteredPlans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-title">暂无计划</div>
            <div className="empty-description">
              {searchKeyword || dateRange.start || dateRange.end
                ? '没有符合筛选条件的计划'
                : '点击右上角"发起场景计划"按钮创建新的计划'}
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'card' ? (
              <div className="plans-list">
                {filteredPlans.map((plan) => (
                  <div key={plan.id} className="plan-card-wrapper" onClick={() => handleOpenDetail(plan)}>
                    <PlanCard plan={plan} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="plans-table-wrapper">
                <table className="plans-table">
                  <thead>
                    <tr>
                      <th>计划ID</th>
                      <th>类型</th>
                      <th>场景</th>
                      <th>状态</th>
                      <th>项目数</th>
                      <th>创建时间</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlans.map((plan) => (
                      <tr key={plan.id}>
                        <td className="plan-id-cell">{plan.id}</td>
                        <td>{plan.type === PlanType.PURCHASE ? '采购' : '调拨'}</td>
                        <td>{plan.scenario || '-'}</td>
                        <td>
                          <span className={`status-badge status-${plan.status}`}>
                            {plan.status}
                          </span>
                        </td>
                        <td>{(plan as any).items.length}</td>
                        <td>{new Date(plan.createdAt).toLocaleString('zh-CN')}</td>
                        <td>
                          <button
                            className="table-action-btn"
                            onClick={() => handleOpenDetail(plan)}
                          >
                            查看
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <ScenarioModal
        isOpen={isModalOpen}
        scenarios={scenarios}
        onClose={handleCloseModal}
        onConfirm={handleCreatePlan}
      />

      <PlanDetailModal
        plan={selectedPlan}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        onEdit={handleEditPlan}
      />
    </div>
  )
}

export default PlanningConsole
