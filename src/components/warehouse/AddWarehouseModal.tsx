import { useState } from 'react'
import {
  WarehouseType,
  WarehouseStatus,
  VirtualBindMode,
  CenterWarehouse,
  FrontWarehouse,
  VirtualWarehouse,
  Product,
  ProductWarehouseRelation,
} from '@/types'
import { useWarehouse } from '@/contexts/WarehouseContext'
import { useProducts, useProductWarehouseRelation } from '@/contexts'
import './AddWarehouseModal.css'

interface AddWarehouseModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ProductStockForm {
  productId: string
  productName: string
  productCode: string
  currentStock: number
  safetyStock: number
  maxStock: number
}

const WAREHOUSE_TYPE_OPTIONS = [
  {
    type: WarehouseType.CENTER,
    label: '中心仓',
    icon: '🏭',
    description: '区域核心仓库，负责统一采购和向前置仓配送',
  },
  {
    type: WarehouseType.FRONT,
    label: '前置仓',
    icon: '🏪',
    description: '靠近消费者的小型仓库，负责最后一公里配送',
  },
  {
    type: WarehouseType.VIRTUAL,
    label: '虚拟仓',
    icon: '🌐',
    description: '线上门店对应的虚拟仓库，映射一个或多个前置仓',
  },
]

const AddWarehouseModal = ({ isOpen, onClose }: AddWarehouseModalProps) => {
  const { addWarehouse, getFrontWarehouses } = useWarehouse()
  const { getActiveProducts } = useProducts()
  const { addRelation } = useProductWarehouseRelation()
  const [selectedType, setSelectedType] = useState<WarehouseType | null>(null)
  const [currentStep, setCurrentStep] = useState<'type' | 'info' | 'products'>('type')

  // 商品配置表单
  const [productStocks, setProductStocks] = useState<ProductStockForm[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const [stockForm, setStockForm] = useState({
    currentStock: 0,
    safetyStock: 0,
    maxStock: 0,
  })

  // 中心仓表单
  const [centerForm, setCenterForm] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    area: '',
    capacity: '',
    manager: '',
    phone: '',
    status: WarehouseStatus.ACTIVE,
    notes: '',
  })

  // 前置仓表单
  const [frontForm, setFrontForm] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    district: '',
    area: '',
    capacity: '',
    manager: '',
    phone: '',
    centerWarehouseId: '',
    centerWarehouseName: '',
    deliveryRadius: '',
    status: WarehouseStatus.ACTIVE,
    notes: '',
  })

  // 虚拟仓表单
  const [virtualForm, setVirtualForm] = useState({
    name: '',
    code: '',
    onlineStoreId: '',
    onlineStoreName: '',
    platform: '',
    city: '',
    bindMode: VirtualBindMode.AUTO,
    boundFrontWarehouseIds: [] as string[],
    status: WarehouseStatus.ACTIVE,
    notes: '',
  })

  const frontWarehouses = getFrontWarehouses()
  const activeProducts = getActiveProducts()

  const handleClose = () => {
    setSelectedType(null)
    setCurrentStep('type')
    setProductStocks([])
    setSelectedProductId('')
    setStockForm({ currentStock: 0, safetyStock: 0, maxStock: 0 })
    setCenterForm({ name: '', code: '', address: '', city: '', area: '', capacity: '', manager: '', phone: '', status: WarehouseStatus.ACTIVE, notes: '' })
    setFrontForm({ name: '', code: '', address: '', city: '', district: '', area: '', capacity: '', manager: '', phone: '', centerWarehouseId: '', centerWarehouseName: '', deliveryRadius: '', status: WarehouseStatus.ACTIVE, notes: '' })
    setVirtualForm({ name: '', code: '', onlineStoreId: '', onlineStoreName: '', platform: '', city: '', bindMode: VirtualBindMode.AUTO, boundFrontWarehouseIds: [], status: WarehouseStatus.ACTIVE, notes: '' })
    onClose()
  }

  const handleFrontWarehouseToggle = (warehouseId: string) => {
    setVirtualForm((prev) => {
      const isSelected = prev.boundFrontWarehouseIds.includes(warehouseId)
      return {
        ...prev,
        boundFrontWarehouseIds: isSelected
          ? prev.boundFrontWarehouseIds.filter((id) => id !== warehouseId)
          : [...prev.boundFrontWarehouseIds, warehouseId],
      }
    })
  }

  const handleAutoSelectFrontWarehouses = () => {
    const activeFrontWarehouses = frontWarehouses.filter((wh) => wh.status === WarehouseStatus.ACTIVE)
    const autoSelected = activeFrontWarehouses.slice(0, 2).map((wh) => wh.id)
    setVirtualForm((prev) => ({ ...prev, boundFrontWarehouseIds: autoSelected }))
  }

  const handleAddProduct = () => {
    if (!selectedProductId) {
      alert('请选择商品')
      return
    }
    if (stockForm.safetyStock > stockForm.maxStock) {
      alert('安全库存不能大于最大库存')
      return
    }
    if (productStocks.some((p) => p.productId === selectedProductId)) {
      alert('该商品已添加')
      return
    }
    const product = activeProducts.find((p) => p.id === selectedProductId)
    if (!product) return

    setProductStocks((prev) => [
      ...prev,
      {
        productId: product.id,
        productName: product.name,
        productCode: product.code,
        currentStock: stockForm.currentStock,
        safetyStock: stockForm.safetyStock,
        maxStock: stockForm.maxStock,
      },
    ])
    setSelectedProductId('')
    setStockForm({ currentStock: 0, safetyStock: 0, maxStock: 0 })
  }

  const handleRemoveProduct = (productId: string) => {
    setProductStocks((prev) => prev.filter((p) => p.productId !== productId))
  }

  const handleNextStep = () => {
    if (currentStep === 'type' && selectedType) {
      setCurrentStep('info')
    } else if (currentStep === 'info') {
      // 验证基本信息
      if (selectedType === WarehouseType.CENTER) {
        if (!centerForm.name || !centerForm.code || !centerForm.address || !centerForm.city) {
          alert('请填写必填字段：仓库名称、仓库编码、详细地址、所在城市')
          return
        }
      } else if (selectedType === WarehouseType.FRONT) {
        if (!frontForm.name || !frontForm.code || !frontForm.address || !frontForm.city) {
          alert('请填写必填字段：仓库名称、仓库编码、详细地址、所在城市')
          return
        }
        setCurrentStep('products')
      } else if (selectedType === WarehouseType.VIRTUAL) {
        if (!virtualForm.name || !virtualForm.code || !virtualForm.onlineStoreName || !virtualForm.platform) {
          alert('请填写必填字段：仓库名称、仓库编码、线上门店名称、所属平台')
          return
        }
        if (virtualForm.bindMode === VirtualBindMode.MANUAL && virtualForm.boundFrontWarehouseIds.length === 0) {
          alert('手动模式下请至少选择一个前置仓')
          return
        }
        setCurrentStep('products')
      }
      
      // 中心仓不需要商品配置，直接提交
      if (selectedType === WarehouseType.CENTER) {
        handleSubmit()
      }
    }
  }

  const handlePrevStep = () => {
    if (currentStep === 'products') {
      setCurrentStep('info')
    } else if (currentStep === 'info') {
      setCurrentStep('type')
    }
  }

  const handleSubmit = () => {
    let warehouseId = ''

    if (selectedType === WarehouseType.CENTER) {
      const newWarehouse: Omit<CenterWarehouse, 'id' | 'createdAt' | 'updatedAt'> = {
        type: WarehouseType.CENTER,
        name: centerForm.name,
        code: centerForm.code,
        address: centerForm.address,
        city: centerForm.city,
        area: Number(centerForm.area) || 0,
        capacity: Number(centerForm.capacity) || 0,
        manager: centerForm.manager,
        phone: centerForm.phone,
        status: centerForm.status,
        notes: centerForm.notes || undefined,
      }
      addWarehouse(newWarehouse)
    }

    if (selectedType === WarehouseType.FRONT) {
      const newWarehouse: Omit<FrontWarehouse, 'id' | 'createdAt' | 'updatedAt'> = {
        type: WarehouseType.FRONT,
        name: frontForm.name,
        code: frontForm.code,
        address: frontForm.address,
        city: frontForm.city,
        district: frontForm.district,
        area: Number(frontForm.area) || 0,
        capacity: Number(frontForm.capacity) || 0,
        manager: frontForm.manager,
        phone: frontForm.phone,
        centerWarehouseId: frontForm.centerWarehouseId,
        centerWarehouseName: frontForm.centerWarehouseName,
        deliveryRadius: Number(frontForm.deliveryRadius) || 3,
        status: frontForm.status,
        notes: frontForm.notes || undefined,
      }
      addWarehouse(newWarehouse)
      
      // 生成临时 ID 用于创建品仓关系
      warehouseId = `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // 添加品仓关系
      productStocks.forEach((stock) => {
        const relation: Omit<ProductWarehouseRelation, 'id' | 'createdAt' | 'updatedAt'> = {
          productId: stock.productId,
          productName: stock.productName,
          productCode: stock.productCode,
          warehouseId: warehouseId,
          warehouseName: frontForm.name,
          currentStock: stock.currentStock,
          safetyStock: stock.safetyStock,
          maxStock: stock.maxStock,
        }
        addRelation(relation)
      })
    }

    if (selectedType === WarehouseType.VIRTUAL) {
      const selectedFrontWarehouses = frontWarehouses.filter((wh) =>
        virtualForm.boundFrontWarehouseIds.includes(wh.id)
      )
      const boundIds =
        virtualForm.bindMode === VirtualBindMode.AUTO
          ? frontWarehouses.filter((wh) => wh.status === WarehouseStatus.ACTIVE).slice(0, 2).map((wh) => wh.id)
          : virtualForm.boundFrontWarehouseIds
      const boundNames =
        virtualForm.bindMode === VirtualBindMode.AUTO
          ? frontWarehouses.filter((wh) => wh.status === WarehouseStatus.ACTIVE).slice(0, 2).map((wh) => wh.name)
          : selectedFrontWarehouses.map((wh) => wh.name)

      const newWarehouse: Omit<VirtualWarehouse, 'id' | 'createdAt' | 'updatedAt'> = {
        type: WarehouseType.VIRTUAL,
        name: virtualForm.name,
        code: virtualForm.code,
        onlineStoreId: virtualForm.onlineStoreId || `STORE_${Date.now()}`,
        onlineStoreName: virtualForm.onlineStoreName,
        platform: virtualForm.platform,
        city: virtualForm.city,
        bindMode: virtualForm.bindMode,
        boundFrontWarehouseIds: boundIds,
        boundFrontWarehouseNames: boundNames,
        status: virtualForm.status,
        notes: virtualForm.notes || undefined,
      }
      addWarehouse(newWarehouse)
      
      // 生成临时 ID 用于创建品仓关系
      warehouseId = `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // 添加品仓关系
      productStocks.forEach((stock) => {
        const relation: Omit<ProductWarehouseRelation, 'id' | 'createdAt' | 'updatedAt'> = {
          productId: stock.productId,
          productName: stock.productName,
          productCode: stock.productCode,
          warehouseId: warehouseId,
          warehouseName: virtualForm.name,
          currentStock: stock.currentStock,
          safetyStock: stock.safetyStock,
          maxStock: stock.maxStock,
        }
        addRelation(relation)
      })
    }

    handleClose()
  }

  if (!isOpen) return null

  const availableProducts = activeProducts.filter(
    (p) => !productStocks.some((ps) => ps.productId === p.id)
  )

  return (
    <div className="add-modal-overlay" onClick={handleClose}>
      <div className="add-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="add-modal-header">
          <h2 className="add-modal-title">新增仓库</h2>
          <button className="add-modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="add-modal-body">
          {/* 步骤指示器 */}
          {selectedType && (
            <div className="step-indicator">
              <div className={`step ${currentStep === 'type' ? 'active' : 'completed'}`}>
                <span className="step-number">1</span>
                <span className="step-label">选择类型</span>
              </div>
              <div className={`step ${currentStep === 'info' ? 'active' : currentStep === 'products' ? 'completed' : ''}`}>
                <span className="step-number">2</span>
                <span className="step-label">基本信息</span>
              </div>
              {(selectedType === WarehouseType.FRONT || selectedType === WarehouseType.VIRTUAL) && (
                <div className={`step ${currentStep === 'products' ? 'active' : ''}`}>
                  <span className="step-number">3</span>
                  <span className="step-label">商品配置</span>
                </div>
              )}
            </div>
          )}

          {/* 第一步：选择仓库类型 */}
          {currentStep === 'type' && (
            <div className="type-selection">
              <h3 className="step-title">选择仓库类型</h3>
              <div className="type-options">
                {WAREHOUSE_TYPE_OPTIONS.map((option) => (
                  <div
                    key={option.type}
                    className={`type-option ${selectedType === option.type ? 'selected' : ''}`}
                    onClick={() => setSelectedType(option.type)}
                  >
                    <span className="type-icon">{option.icon}</span>
                    <span className="type-label">{option.label}</span>
                    <span className="type-desc">{option.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 第二步：填写基本信息 */}
          {currentStep === 'info' && selectedType === WarehouseType.CENTER && (
            <div className="warehouse-form">
              <h3 className="step-title">填写中心仓信息</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">仓库名称 <span className="required">*</span></label>
                  <input className="form-input" placeholder="如：上海中心仓" value={centerForm.name} onChange={(e) => setCenterForm({ ...centerForm, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">仓库编码 <span className="required">*</span></label>
                  <input className="form-input" placeholder="如：WH-SH-C001" value={centerForm.code} onChange={(e) => setCenterForm({ ...centerForm, code: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">所在城市 <span className="required">*</span></label>
                  <input className="form-input" placeholder="如：上海" value={centerForm.city} onChange={(e) => setCenterForm({ ...centerForm, city: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">运营状态</label>
                  <select className="form-select" value={centerForm.status} onChange={(e) => setCenterForm({ ...centerForm, status: e.target.value as WarehouseStatus })}>
                    <option value={WarehouseStatus.ACTIVE}>正常运营</option>
                    <option value={WarehouseStatus.BUILDING}>建设中</option>
                    <option value={WarehouseStatus.INACTIVE}>已停用</option>
                  </select>
                </div>
                <div className="form-group form-group-full">
                  <label className="form-label">详细地址 <span className="required">*</span></label>
                  <input className="form-input" placeholder="如：上海市浦东新区张江高科技园区博云路2号" value={centerForm.address} onChange={(e) => setCenterForm({ ...centerForm, address: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">面积（m²）</label>
                  <input className="form-input" type="number" placeholder="如：5000" value={centerForm.area} onChange={(e) => setCenterForm({ ...centerForm, area: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">库容（件）</label>
                  <input className="form-input" type="number" placeholder="如：100000" value={centerForm.capacity} onChange={(e) => setCenterForm({ ...centerForm, capacity: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">负责人</label>
                  <input className="form-input" placeholder="负责人姓名" value={centerForm.manager} onChange={(e) => setCenterForm({ ...centerForm, manager: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">联系电话</label>
                  <input className="form-input" placeholder="联系电话" value={centerForm.phone} onChange={(e) => setCenterForm({ ...centerForm, phone: e.target.value })} />
                </div>
                <div className="form-group form-group-full">
                  <label className="form-label">备注</label>
                  <textarea className="form-textarea" placeholder="备注信息（选填）" value={centerForm.notes} onChange={(e) => setCenterForm({ ...centerForm, notes: e.target.value })} />
                </div>
              </div>
            </div>
          )}

          {/* 前置仓基本信息表单 */}
          {currentStep === 'info' && selectedType === WarehouseType.FRONT && (
            <div className="warehouse-form">
              <h3 className="step-title">填写前置仓信息</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">仓库名称 <span className="required">*</span></label>
                  <input className="form-input" placeholder="如：浦东东区前置仓" value={frontForm.name} onChange={(e) => setFrontForm({ ...frontForm, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">仓库编码 <span className="required">*</span></label>
                  <input className="form-input" placeholder="如：WH-SH-F001" value={frontForm.code} onChange={(e) => setFrontForm({ ...frontForm, code: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">所在城市 <span className="required">*</span></label>
                  <input className="form-input" placeholder="如：上海" value={frontForm.city} onChange={(e) => setFrontForm({ ...frontForm, city: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">所在区域</label>
                  <input className="form-input" placeholder="如：浦东新区" value={frontForm.district} onChange={(e) => setFrontForm({ ...frontForm, district: e.target.value })} />
                </div>
                <div className="form-group form-group-full">
                  <label className="form-label">详细地址 <span className="required">*</span></label>
                  <input className="form-input" placeholder="如：上海市浦东新区陆家嘴环路1000号" value={frontForm.address} onChange={(e) => setFrontForm({ ...frontForm, address: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">所属中心仓名称</label>
                  <input className="form-input" placeholder="如：上海中心仓" value={frontForm.centerWarehouseName} onChange={(e) => setFrontForm({ ...frontForm, centerWarehouseName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">配送半径（公里）</label>
                  <input className="form-input" type="number" placeholder="如：3" value={frontForm.deliveryRadius} onChange={(e) => setFrontForm({ ...frontForm, deliveryRadius: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">面积（m²）</label>
                  <input className="form-input" type="number" placeholder="如：300" value={frontForm.area} onChange={(e) => setFrontForm({ ...frontForm, area: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">库容（件）</label>
                  <input className="form-input" type="number" placeholder="如：5000" value={frontForm.capacity} onChange={(e) => setFrontForm({ ...frontForm, capacity: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">负责人</label>
                  <input className="form-input" placeholder="负责人姓名" value={frontForm.manager} onChange={(e) => setFrontForm({ ...frontForm, manager: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">联系电话</label>
                  <input className="form-input" placeholder="联系电话" value={frontForm.phone} onChange={(e) => setFrontForm({ ...frontForm, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">运营状态</label>
                  <select className="form-select" value={frontForm.status} onChange={(e) => setFrontForm({ ...frontForm, status: e.target.value as WarehouseStatus })}>
                    <option value={WarehouseStatus.ACTIVE}>正常运营</option>
                    <option value={WarehouseStatus.BUILDING}>建设中</option>
                    <option value={WarehouseStatus.INACTIVE}>已停用</option>
                  </select>
                </div>
                <div className="form-group form-group-full">
                  <label className="form-label">备注</label>
                  <textarea className="form-textarea" placeholder="备注信息（选填）" value={frontForm.notes} onChange={(e) => setFrontForm({ ...frontForm, notes: e.target.value })} />
                </div>
              </div>
            </div>
          )}

          {/* 虚拟仓基本信息表单 */}
          {currentStep === 'info' && selectedType === WarehouseType.VIRTUAL && (
            <div className="warehouse-form">
              <h3 className="step-title">填写虚拟仓信息</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">虚拟仓名称 <span className="required">*</span></label>
                  <input className="form-input" placeholder="如：美团陆家嘴虚拟仓" value={virtualForm.name} onChange={(e) => setVirtualForm({ ...virtualForm, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">仓库编码 <span className="required">*</span></label>
                  <input className="form-input" placeholder="如：WH-SH-V001" value={virtualForm.code} onChange={(e) => setVirtualForm({ ...virtualForm, code: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">线上门店名称 <span className="required">*</span></label>
                  <input className="form-input" placeholder="如：叮咚买菜陆家嘴店" value={virtualForm.onlineStoreName} onChange={(e) => setVirtualForm({ ...virtualForm, onlineStoreName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">所属平台 <span className="required">*</span></label>
                  <select className="form-select" value={virtualForm.platform} onChange={(e) => setVirtualForm({ ...virtualForm, platform: e.target.value })}>
                    <option value="">请选择平台</option>
                    <option value="美团">美团</option>
                    <option value="饿了么">饿了么</option>
                    <option value="叮咚买菜">叮咚买菜</option>
                    <option value="盒马">盒马</option>
                    <option value="京东到家">京东到家</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">所在城市</label>
                  <input className="form-input" placeholder="如：上海" value={virtualForm.city} onChange={(e) => setVirtualForm({ ...virtualForm, city: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">运营状态</label>
                  <select className="form-select" value={virtualForm.status} onChange={(e) => setVirtualForm({ ...virtualForm, status: e.target.value as WarehouseStatus })}>
                    <option value={WarehouseStatus.ACTIVE}>正常运营</option>
                    <option value={WarehouseStatus.BUILDING}>建设中</option>
                    <option value={WarehouseStatus.INACTIVE}>已停用</option>
                  </select>
                </div>

                {/* 前置仓绑定 */}
                <div className="form-group form-group-full">
                  <label className="form-label">前置仓绑定方式</label>
                  <div className="bind-mode-options">
                    <label className={`bind-mode-option ${virtualForm.bindMode === VirtualBindMode.AUTO ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="bindMode"
                        value={VirtualBindMode.AUTO}
                        checked={virtualForm.bindMode === VirtualBindMode.AUTO}
                        onChange={() => setVirtualForm({ ...virtualForm, bindMode: VirtualBindMode.AUTO, boundFrontWarehouseIds: [] })}
                      />
                      <span className="bind-mode-icon">🤖</span>
                      <div>
                        <div className="bind-mode-label">系统自动选择</div>
                        <div className="bind-mode-desc">系统根据距离和库存自动分配最优前置仓</div>
                      </div>
                    </label>
                    <label className={`bind-mode-option ${virtualForm.bindMode === VirtualBindMode.MANUAL ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="bindMode"
                        value={VirtualBindMode.MANUAL}
                        checked={virtualForm.bindMode === VirtualBindMode.MANUAL}
                        onChange={() => setVirtualForm({ ...virtualForm, bindMode: VirtualBindMode.MANUAL })}
                      />
                      <span className="bind-mode-icon">👤</span>
                      <div>
                        <div className="bind-mode-label">人工手动选择</div>
                        <div className="bind-mode-desc">从可用前置仓中手动指定绑定关系</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 手动选择前置仓 */}
                {virtualForm.bindMode === VirtualBindMode.MANUAL && (
                  <div className="form-group form-group-full">
                    <label className="form-label">
                      选择绑定的前置仓
                      <span className="selected-count">（已选 {virtualForm.boundFrontWarehouseIds.length} 个）</span>
                    </label>
                    {frontWarehouses.length === 0 ? (
                      <div className="no-front-warehouses">暂无可用前置仓，请先创建前置仓</div>
                    ) : (
                      <div className="front-warehouse-list">
                        {frontWarehouses.map((wh) => (
                          <label
                            key={wh.id}
                            className={`front-warehouse-option ${virtualForm.boundFrontWarehouseIds.includes(wh.id) ? 'selected' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={virtualForm.boundFrontWarehouseIds.includes(wh.id)}
                              onChange={() => handleFrontWarehouseToggle(wh.id)}
                            />
                            <div className="front-wh-info">
                              <span className="front-wh-name">{wh.name}</span>
                              <span className="front-wh-meta">{wh.city} · {wh.district} · 配送 {wh.deliveryRadius}km</span>
                            </div>
                            <span className={`front-wh-status ${wh.status === WarehouseStatus.ACTIVE ? 'active' : 'inactive'}`}>
                              {wh.status === WarehouseStatus.ACTIVE ? '运营中' : '未运营'}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 自动模式预览 */}
                {virtualForm.bindMode === VirtualBindMode.AUTO && frontWarehouses.length > 0 && (
                  <div className="form-group form-group-full">
                    <label className="form-label">自动分配预览</label>
                    <div className="auto-preview">
                      <div className="auto-preview-tip">
                        💡 系统将自动从以下前置仓中选择最优分配（点击"预览"查看）
                      </div>
                      <button type="button" className="btn-preview" onClick={handleAutoSelectFrontWarehouses}>
                        预览自动分配结果
                      </button>
                      {virtualForm.boundFrontWarehouseIds.length > 0 && (
                        <div className="auto-preview-result">
                          <span className="preview-label">预计分配：</span>
                          {virtualForm.boundFrontWarehouseIds.map((id) => {
                            const wh = frontWarehouses.find((w) => w.id === id)
                            return wh ? <span key={id} className="preview-tag">{wh.name}</span> : null
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="form-group form-group-full">
                  <label className="form-label">备注</label>
                  <textarea className="form-textarea" placeholder="备注信息（选填）" value={virtualForm.notes} onChange={(e) => setVirtualForm({ ...virtualForm, notes: e.target.value })} />
                </div>
              </div>
            </div>
          )}

          {/* 第三步：商品配置 */}
          {currentStep === 'products' && (selectedType === WarehouseType.FRONT || selectedType === WarehouseType.VIRTUAL) && (
            <div className="warehouse-form">
              <h3 className="step-title">配置商品库存</h3>
              
              {/* 添加商品表单 */}
              <div className="product-add-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">选择商品</label>
                    <select 
                      className="form-select" 
                      value={selectedProductId} 
                      onChange={(e) => setSelectedProductId(e.target.value)}
                    >
                      <option value="">请选择商品</option>
                      {availableProducts.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} ({product.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">当前库存</label>
                    <input 
                      className="form-input" 
                      type="number" 
                      placeholder="当前库存数量" 
                      value={stockForm.currentStock} 
                      onChange={(e) => setStockForm({ ...stockForm, currentStock: Number(e.target.value) })} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">安全库存</label>
                    <input 
                      className="form-input" 
                      type="number" 
                      placeholder="安全库存数量" 
                      value={stockForm.safetyStock} 
                      onChange={(e) => setStockForm({ ...stockForm, safetyStock: Number(e.target.value) })} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">最大库存</label>
                    <input 
                      className="form-input" 
                      type="number" 
                      placeholder="最大库存数量" 
                      value={stockForm.maxStock} 
                      onChange={(e) => setStockForm({ ...stockForm, maxStock: Number(e.target.value) })} 
                    />
                  </div>
                  <div className="form-group">
                    <button type="button" className="btn-add-product" onClick={handleAddProduct}>
                      + 添加商品
                    </button>
                  </div>
                </div>
              </div>

              {/* 已添加商品列表 */}
              <div className="product-list">
                <h4 className="list-title">已添加商品（{productStocks.length} 种）</h4>
                {productStocks.length === 0 ? (
                  <div className="empty-products">暂无商品，请添加商品</div>
                ) : (
                  <div className="product-items">
                    {productStocks.map((stock) => (
                      <div key={stock.productId} className="product-item">
                        <div className="product-info">
                          <span className="product-name">{stock.productName}</span>
                          <span className="product-code">{stock.productCode}</span>
                        </div>
                        <div className="product-stocks">
                          <span className="stock-item">当前：{stock.currentStock}</span>
                          <span className="stock-item">安全：{stock.safetyStock}</span>
                          <span className="stock-item">最大：{stock.maxStock}</span>
                        </div>
                        <button 
                          className="btn-remove-product" 
                          onClick={() => handleRemoveProduct(stock.productId)}
                        >
                          移除
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="add-modal-footer">
          {currentStep !== 'type' && (
            <button className="btn-secondary" onClick={handlePrevStep}>上一步</button>
          )}
          {currentStep === 'type' && (
            <button className="btn-secondary" onClick={handleClose}>取消</button>
          )}
          {currentStep === 'products' ? (
            <button className="btn-primary" onClick={handleSubmit}>
              确认新增
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={handleNextStep}
              disabled={!selectedType}
            >
              下一步
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddWarehouseModal
