# Change: 添加决策单控制台页面

## Why
业务需要一个决策单控制台页面，让小二可以查看、编辑和下发决策单。决策单与提报单一对一对应，一个寻源单可能对应多个决策单。

## What Changes
- 新增决策单控制台页面，展示决策单信息列表
- 实现决策单编辑功能，支持小二修改报量
- 实现决策下发功能
- 添加决策单相关的数据类型定义和上下文管理
- 更新路由配置，添加决策单控制台入口

## Impact
- 影响的规范：decision-console（新增）
- 影响的代码：
  - `src/pages/` - 新增 DecisionConsole 页面
  - `src/types/` - 新增决策单相关类型定义
  - `src/contexts/` - 新增 DecisionContext
  - `src/routes/` - 更新路由配置
  - `src/components/layout/` - 更新导航菜单
