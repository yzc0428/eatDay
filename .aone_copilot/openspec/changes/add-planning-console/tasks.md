# 实施任务清单

## 1. 类型定义
- [ ] 1.1 在 `src/types/index.ts` 中添加采购计划类型定义
- [ ] 1.2 在 `src/types/index.ts` 中添加调拨计划类型定义
- [ ] 1.3 在 `src/types/index.ts` 中添加场景类型枚举

## 2. 上下文管理
- [ ] 2.1 创建 `src/contexts/PlanningContext.tsx`
- [ ] 2.2 实现计划数据的状态管理
- [ ] 2.3 实现场景计划发起逻辑
- [ ] 2.4 在 `src/contexts/index.tsx` 中导出 PlanningContext

## 3. 组件开发
- [ ] 3.1 创建 `src/components/planning/` 目录
- [ ] 3.2 实现 PlanCard 组件（计划卡片）
- [ ] 3.3 实现 ScenarioModal 组件（场景选择弹窗）
- [ ] 3.4 创建 `src/components/planning/index.ts` 导出文件

## 4. 页面开发
- [ ] 4.1 创建 `src/pages/PlanningConsole/` 目录
- [ ] 4.2 实现 PlanningConsole 主页面
- [ ] 4.3 集成计划列表展示
- [ ] 4.4 集成场景计划发起功能

## 5. 路由配置
- [ ] 5.1 在 `src/routes/index.tsx` 中添加计划控制台路由
- [ ] 5.2 更新导航菜单（如果需要）

## 6. 验证
- [ ] 6.1 验证页面可正常访问
- [ ] 6.2 验证计划列表正常展示
- [ ] 6.3 验证场景计划发起流程完整
- [ ] 6.4 验证数据持久化正常
