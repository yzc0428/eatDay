# 商品管理规范

## ADDED Requirements

### Requirement: 商品基本信息管理
系统 SHALL 支持商品的基本信息管理，包括商品的创建、编辑、删除和查询。

#### Scenario: 创建新商品
- **WHEN** 用户填写商品名称、编码、分类、单位等必填信息
- **THEN** 系统创建新商品记录并分配唯一ID
- **AND** 商品状态默认为"启用"

#### Scenario: 编辑商品信息
- **WHEN** 用户修改商品的名称、分类、规格等信息
- **THEN** 系统更新商品记录并更新 updatedAt 时间戳
- **AND** 关联的品仓关系中的商品名称同步更新

#### Scenario: 删除商品
- **WHEN** 用户删除某个商品
- **THEN** 系统删除该商品记录
- **AND** 系统级联删除所有关联的品仓关系记录

#### Scenario: 查询商品列表
- **WHEN** 用户访问商品管理页面
- **THEN** 系统展示所有商品列表
- **AND** 支持按名称、编码、分类进行搜索和筛选

### Requirement: 商品分类管理
系统 SHALL 支持商品的分类管理，商品必须归属于某个分类。

#### Scenario: 选择商品分类
- **WHEN** 用户创建或编辑商品时选择分类
- **THEN** 系统记录商品的分类信息
- **AND** 支持按分类筛选商品

### Requirement: 商品状态管理
系统 SHALL 支持商品的启用和停用状态管理。

#### Scenario: 停用商品
- **WHEN** 用户将商品状态设置为"停用"
- **THEN** 系统更新商品状态
- **AND** 停用的商品在仓库配置时不可选择

#### Scenario: 启用商品
- **WHEN** 用户将商品状态设置为"启用"
- **THEN** 系统更新商品状态
- **AND** 启用的商品在仓库配置时可以选择

### Requirement: 商品数据持久化
系统 SHALL 将商品数据持久化存储在浏览器 localStorage 中。

#### Scenario: 保存商品数据
- **WHEN** 用户创建、编辑或删除商品
- **THEN** 系统自动将商品数据保存到 localStorage
- **AND** 使用 key 为 `product_data` 存储

#### Scenario: 加载商品数据
- **WHEN** 用户刷新页面或重新打开应用
- **THEN** 系统从 localStorage 加载商品数据
- **AND** 如果没有数据则初始化为空数组
