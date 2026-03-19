# Change: 添加商家竞价页面

## Why
业务需要一个商家竞价页面，让商家可以查看待竞价的提报单据，并对每个单据进行报价和报量的提交。

## What Changes
- 新增商家竞价页面，展示待竞价的提报单据列表
- 实现竞价提交功能，支持商家填写新报价和新报量
- 添加竞价相关的数据类型定义和上下文管理
- 更新路由配置，添加商家竞价入口
- 提供提交成功的提示信息

## Impact
- 影响的规范：merchant-bidding（新增）
- 影响的代码：
  - `src/pages/` - 新增 MerchantBidding 页面
  - `src/types/` - 新增竞价相关类型定义
  - `src/contexts/` - 新增 BiddingContext
  - `src/routes/` - 更新路由配置
  - `src/components/layout/` - 更新导航菜单
