# 功能规范：历史记录

## 概述
历史记录模块允许用户查看、搜索和管理过往的点餐记录。

## ADDED Requirements

### Requirement: 查看历史订单列表
系统 SHALL 允许用户浏览所有历史订单。

#### Scenario: 显示历史订单列表
**Given** 用户进入历史记录页面  
**Then** 显示所有历史订单  
**And** 按时间倒序排列（最新的在前）  
**And** 每个订单显示：
  - 订单日期和时间
  - 菜品数量
  - 订单总价
  - 主要菜品预览（最多 3 个）

#### Scenario: 历史记录为空
**Given** 用户首次使用应用  
**When** 用户进入历史记录页面  
**Then** 显示空状态："还没有点餐记录"  
**And** 显示"开始点餐"按钮

### Requirement: 查看订单详情
系统 SHALL 允许用户查看单个订单的完整信息。

#### Scenario: 打开订单详情
**Given** 用户在历史记录列表页面  
**When** 用户点击某个订单  
**Then** 显示订单详情页面  
**And** 显示完整信息：
  - 订单编号
  - 订单日期时间
  - 所有菜品列表（名称、单价、数量、小计）
  - 总数量
  - 总价格

#### Scenario: 从详情返回列表
**Given** 用户在订单详情页面  
**When** 用户点击"返回"按钮  
**Then** 返回历史记录列表  
**And** 保持之前的滚动位置

### Requirement: 按日期筛选订单
系统 SHALL 允许用户按日期范围筛选历史订单。

#### Scenario: 选择日期范围
**Given** 用户在历史记录页面  
**When** 用户点击"筛选"按钮  
**Then** 显示日期选择器  
**And** 提供快捷选项：
  - 今天
  - 最近 7 天
  - 最近 30 天
  - 自定义范围

**When** 用户选择"最近 7 天"  
**Then** 只显示最近 7 天的订单  
**And** 显示筛选标签："最近 7 天"  
**And** 显示订单数量

#### Scenario: 清除日期筛选
**Given** 用户已应用日期筛选  
**When** 用户点击筛选标签的关闭按钮  
**Then** 清除筛选条件  
**And** 显示所有历史订单

### Requirement: 搜索历史订单
系统 SHALL 允许用户通过菜品名称搜索订单。

#### Scenario: 搜索包含特定菜品的订单
**Given** 用户在历史记录页面  
**When** 用户在搜索框输入"鸡丁"  
**Then** 只显示包含"鸡丁"相关菜品的订单  
**And** 高亮显示匹配的菜品名称  
**And** 显示搜索结果数量："找到 5 个订单"

#### Scenario: 搜索无结果
**Given** 用户在历史记录页面  
**When** 用户搜索不存在的菜品  
**Then** 显示空状态："未找到匹配的订单"  
**And** 显示"清除搜索"按钮

### Requirement: 删除历史订单
系统 SHALL 允许用户删除不需要的历史订单。

#### Scenario: 删除单个订单
**Given** 用户在历史记录列表页面  
**When** 用户在某个订单上滑动（移动端）或点击删除按钮（桌面端）  
**Then** 显示确认对话框："确定要删除这条订单记录吗？"  
**When** 用户点击"确定"  
**Then** 从 LocalStorage 中删除该订单  
**And** 从列表中移除  
**And** 显示成功提示："订单已删除"  
**And** 更新统计数据

#### Scenario: 批量删除订单
**Given** 用户在历史记录页面  
**When** 用户点击"编辑"按钮  
**Then** 进入编辑模式  
**And** 每个订单显示复选框

**When** 用户选择多个订单  
**And** 用户点击"删除选中"按钮  
**Then** 显示确认对话框："确定要删除选中的 3 条订单吗？"  
**When** 用户点击"确定"  
**Then** 删除所有选中的订单  
**And** 显示成功提示："已删除 3 条订单"

### Requirement: 重新点餐
系统 SHALL 允许用户基于历史订单快速重新点餐。

#### Scenario: 从历史订单重新点餐
**Given** 用户在订单详情页面  
**When** 用户点击"重新点餐"按钮  
**Then** 跳转到点餐页面  
**And** 点餐清单自动填充该历史订单的所有菜品和数量  
**And** 显示提示："已从历史订单加载"

#### Scenario: 重新点餐时菜品已删除
**Given** 用户选择重新点餐  
**And** 历史订单中某些菜品已被删除  
**Then** 只加载仍存在的菜品  
**And** 显示警告："部分菜品已不存在，已自动移除"  
**And** 列出不存在的菜品名称

### Requirement: 分页加载
历史记录 MUST 支持分页加载以提升性能。

#### Scenario: 初始加载
**Given** 用户进入历史记录页面  
**Then** 加载最近 20 条订单  
**And** 显示加载指示器

#### Scenario: 加载更多
**Given** 用户在历史记录页面  
**And** 已显示 20 条订单  
**When** 用户滚动到列表底部  
**Then** 自动加载下一页（20 条）  
**And** 显示加载指示器  
**And** 新订单追加到列表末尾

#### Scenario: 已加载全部订单
**Given** 用户滚动到列表底部  
**And** 已加载所有历史订单  
**Then** 显示提示："已显示全部订单"

## 数据模型

```typescript
interface HistoryOrder {
  id: string;
  date: number;
  items: Array<{
    dishId: string;
    dishName: string;
    price: number;
    quantity: number;
    subtotal: number;
  }>;
  totalQuantity: number;
  totalPrice: number;
}

interface HistoryFilter {
  dateRange?: {
    start: number;
    end: number;
  };
  searchKeyword?: string;
}

interface HistoryPagination {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}
```

## 日期格式

### 列表显示
- 今天：显示"今天 HH:mm"
- 昨天：显示"昨天 HH:mm"
- 本周：显示"星期X HH:mm"
- 更早：显示"MM-DD HH:mm"
- 去年：显示"YYYY-MM-DD"

### 详情显示
- 完整格式："YYYY年MM月DD日 HH:mm"

## UI 规范

### 订单卡片
- 圆角：8px
- 内边距：16px
- 阴影：轻微阴影
- 间距：卡片之间 12px
- 悬停效果：阴影加深

### 订单详情页面
- 顶部：订单日期和编号
- 中部：菜品列表（可滚动）
- 底部：总计信息和操作按钮
- 背景：浅色背景区分不同区域

### 筛选栏
- 位置：页面顶部
- 高度：56px
- 包含：搜索框、日期筛选、排序选项

## 性能要求
- 列表初始加载时间 < 500ms
- 分页加载时间 < 300ms
- 搜索响应时间 < 200ms（使用防抖）
- 支持至少 1000 条历史记录的流畅浏览
- 虚拟滚动优化长列表性能
