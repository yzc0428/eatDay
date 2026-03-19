# 设计文档：商品仓库关系管理

## Context
当前系统是一个仓库管理应用，支持中心仓、前置仓和虚拟仓的管理。现需要添加商品管理功能，并建立商品与仓库的关联关系，以便跟踪每个仓库的货品情况和库存信息。

同时，项目中存在大量与"吃什么"相关的旧功能（菜品、订单、收藏、计划等），这些功能与当前的仓库管理业务不符，需要清理。

## Goals / Non-Goals

### Goals
- 支持商品的基本信息管理（名称、编码、分类、单位等）
- 建立商品与仓库的多对多关联关系
- 支持在仓库维度管理商品库存（当前库存、安全库存、最大库存）
- 在新建/编辑仓库时直接配置商品列表
- 清理所有与"吃什么"相关的旧功能和文案

### Non-Goals
- 不实现复杂的库存流转和出入库记录
- 不实现商品的采购和供应商管理
- 不实现库存预警和自动补货
- 不实现商品的批次和有效期管理

## Decisions

### 1. 数据模型设计

#### Product（商品）
```typescript
interface Product {
  id: string
  name: string              // 商品名称
  code: string              // 商品编码
  category: ProductCategory // 商品分类
  unit: string              // 计量单位（件、箱、kg等）
  specification?: string    // 规格说明
  description?: string      // 商品描述
  image?: string            // 商品图片（Base64）
  status: ProductStatus     // 商品状态（启用/停用）
  createdAt: number
  updatedAt: number
}
```

#### ProductWarehouseRelation（品仓关系）
```typescript
interface ProductWarehouseRelation {
  id: string
  productId: string         // 商品ID
  productName: string       // 商品名称（冗余，便于展示）
  warehouseId: string       // 仓库ID
  warehouseName: string     // 仓库名称（冗余，便于展示）
  currentStock: number      // 当前库存
  safetyStock: number       // 安全库存
  maxStock: number          // 最大库存
  createdAt: number
  updatedAt: number
}
```

### 2. 数据存储方案
- 使用 localStorage 存储商品数据（key: `product_data`）
- 使用 localStorage 存储品仓关系数据（key: `product_warehouse_relation_data`）
- 仓库数据中不直接嵌入商品信息，通过关系表关联

### 3. UI 交互设计
- 在 AddWarehouseModal 中添加"商品配置"步骤（仅对前置仓和虚拟仓显示）
- 商品配置界面包含：
  - 商品选择器（从已有商品中选择）
  - 库存信息输入（当前库存、安全库存、最大库存）
  - 已添加商品列表（支持编辑和移除）
- 在仓库卡片上显示关联商品数量的统计信息

### 4. 清理策略
- 删除所有 Dish、Order、Favorite、Planning 相关的类型定义
- 删除对应的 Context 和组件
- 删除相关的页面和路由
- 更新导航和页面标题，移除"今天吃什么"等文案
- 保留基础的布局和样式系统

## Alternatives Considered

### 方案 A：商品信息直接嵌入仓库数据
- **优点**：数据结构简单，查询方便
- **缺点**：数据冗余，商品信息修改需要更新所有关联仓库
- **决策**：不采用，选择关系表方案

### 方案 B：实现完整的库存管理系统
- **优点**：功能完整，支持出入库记录
- **缺点**：复杂度高，开发周期长
- **决策**：不采用，当前只需要基础的品仓关系管理

## Risks / Trade-offs

### 风险 1：数据一致性
- **风险**：商品删除时，品仓关系数据可能成为孤儿数据
- **缓解措施**：删除商品时级联删除相关的品仓关系记录

### 风险 2：性能问题
- **风险**：商品和仓库数量增多时，关系查询可能变慢
- **缓解措施**：使用索引优化查询，必要时引入分页

### Trade-off：功能简化
- **权衡**：当前不实现复杂的库存流转功能
- **理由**：优先满足基础需求，后续可根据实际使用情况扩展

## Migration Plan

### 数据迁移
1. 无需迁移旧数据（清理旧功能）
2. 初始化空的商品数据和品仓关系数据

### 功能迁移
1. 删除旧功能相关的代码和文件
2. 更新路由和导航配置
3. 清理 localStorage 中的旧数据（可选，用户手动清理）

### 回滚计划
- 如果出现问题，可以通过 Git 回退到清理前的版本
- localStorage 数据可以手动清理或保留

## Open Questions
- 是否需要支持商品的批量导入导出功能？
- 是否需要支持商品图片的上传和管理？
- 是否需要为中心仓也添加商品配置功能？
