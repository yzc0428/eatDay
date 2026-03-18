# Change: 添加计划域控制台页面

## Why
业务需要一个统一的控制台来管理和查看采购计划、调拨计划，并支持业务小二针对特殊场景（如晚高峰、暴雨）快速发起计划计算，提升运营效率。

## What Changes
- 新增计划域控制台页面，展示采购计划和调拨计划列表
- 实现场景计划发起功能，支持业务小二选择特殊场景并触发计划生成
- 添加计划详情展示，包含计划单的关键信息
- 新增计划相关的数据类型定义和上下文管理
- 更新路由配置，添加计划控制台入口

## Impact
- 影响的规范：planning-console（新增）
- 影响的代码：
  - `src/pages/` - 新增 PlanningConsole 页面
  - `src/types/` - 新增计划相关类型定义
  - `src/contexts/` - 新增 PlanningContext
  - `src/components/` - 新增计划相关组件
  - `src/routes/` - 更新路由配置
