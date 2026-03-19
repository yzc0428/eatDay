# Change: 添加商品仓库关系管理功能

## Why
当前系统仅支持仓库的基础信息管理，缺少商品与仓库的关联关系管理。用户无法记录和维护每个仓库中存放的商品及其库存信息，导致无法有效管理仓库的货品情况。

## What Changes
- 新增商品（Product）数据模型，包含商品基本信息
- 新增品仓关系（ProductWarehouseRelation）数据模型，记录商品与仓库的关联及库存信息
- 在前置仓和虚拟仓的新建/编辑表单中添加商品配置功能
- 支持添加/移除商品，设置安全库存和最大库存
- 清理项目中与"吃什么"相关的内容（菜品、订单、收藏等功能）
- 移除"今天吃什么"等相关页面标题和文案

## Impact
- 影响的规范：product-management（新增）、warehouse-management（修改）
- 影响的代码：
  - `src/types/index.ts` - 新增 Product 和 ProductWarehouseRelation 类型
  - `src/contexts/WarehouseContext.tsx` - 扩展仓库上下文支持商品管理
  - `src/components/warehouse/AddWarehouseModal.tsx` - 添加商品配置界面
  - 需要清理的模块：DishContext、OrderContext、FavoriteContext、PlanningContext 等
  - 需要清理的页面和组件：与菜品、订单、计划相关的所有内容
