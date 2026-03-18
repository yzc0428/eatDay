# Change: 增强计划控制台功能

## Why
为了提升计划控制台的用户体验和实用性，需要添加搜索筛选、详情编辑、数据导出和界面优化等核心功能，使业务小二能够更高效地管理和操作计划。

## What Changes
- **搜索与筛选增强**：添加关键词搜索、时间范围筛选、状态筛选功能
- **计划详情与编辑**：实现计划详情弹窗、编辑计划、批量操作功能
- **导出与报表**：支持导出 Excel 格式的计划列表
- **界面优化**：添加卡片/列表视图切换、拖拽排序功能

## Impact
- 影响的规范：planning-enhancements（新增）
- 影响的代码：
  - `src/pages/PlanningConsole/` - 增强主页面功能
  - `src/components/planning/` - 新增详情弹窗、编辑表单等组件
  - `src/contexts/PlanningContext.tsx` - 扩展上下文功能
  - `src/utils/` - 新增导出工具函数
