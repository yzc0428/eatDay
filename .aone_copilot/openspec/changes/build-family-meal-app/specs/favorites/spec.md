# 功能规范：收藏功能

## 概述
收藏功能允许用户标记常用菜品，方便快速访问和点餐。

## ADDED Requirements

### Requirement: 收藏菜品
系统 SHALL 允许用户将菜品添加到收藏列表。

#### Scenario: 收藏一个菜品
**Given** 用户在菜品列表页面  
**When** 用户点击"宫保鸡丁"的收藏图标（空心星星）  
**Then** 图标变为实心星星（金色）  
**And** 该菜品的 isFavorite 属性设置为 true  
**And** 显示动画效果（星星闪烁）  
**And** 显示提示："已添加到收藏"

#### Scenario: 从多个位置收藏
**Given** 用户可以在以下位置收藏菜品：
  - 菜品列表页面
  - 菜品详情页面
  - 点餐页面
  - 历史订单详情页面

**When** 用户在任何位置点击收藏图标  
**Then** 收藏状态在所有位置同步更新

### Requirement: 取消收藏
系统 SHALL 允许用户取消已收藏的菜品。

#### Scenario: 取消收藏一个菜品
**Given** 用户在菜品列表页面  
**And** "宫保鸡丁"已被收藏（实心星星）  
**When** 用户再次点击收藏图标  
**Then** 图标变为空心星星  
**And** 该菜品的 isFavorite 属性设置为 false  
**And** 显示提示："已取消收藏"

#### Scenario: 从收藏列表中取消收藏
**Given** 用户在收藏列表页面  
**When** 用户取消收藏某个菜品  
**Then** 该菜品从收藏列表中移除  
**And** 如果列表为空，显示空状态

### Requirement: 查看收藏列表
系统 SHALL 允许用户查看所有收藏的菜品。

#### Scenario: 访问收藏列表
**Given** 用户在应用中  
**When** 用户点击导航栏的"收藏"标签  
**Then** 显示所有已收藏的菜品  
**And** 按收藏时间倒序排列  
**And** 显示收藏数量："我的收藏 (8)"

#### Scenario: 收藏列表为空
**Given** 用户还没有收藏任何菜品  
**When** 用户进入收藏页面  
**Then** 显示空状态："还没有收藏的菜品"  
**And** 显示"去添加菜品"按钮

### Requirement: 从收藏快速点餐
系统 SHALL 允许用户从收藏列表快速添加菜品到点餐清单。

#### Scenario: 从收藏添加到点餐清单
**Given** 用户在收藏列表页面  
**When** 用户点击某个收藏菜品的"添加"按钮  
**Then** 该菜品添加到点餐清单  
**And** 显示成功提示  
**And** 点餐清单图标显示数量徽章

#### Scenario: 批量添加收藏菜品
**Given** 用户在收藏列表页面  
**When** 用户点击"全部添加"按钮  
**Then** 显示确认对话框："确定要将所有收藏菜品添加到点餐清单吗？"  
**When** 用户点击"确定"  
**Then** 所有收藏菜品添加到点餐清单（每个数量为 1）  
**And** 显示成功提示："已添加 8 个菜品"  
**And** 自动跳转到点餐页面

### Requirement: 收藏排序
系统 SHALL 允许用户调整收藏菜品的显示顺序。

#### Scenario: 按收藏时间排序
**Given** 用户在收藏列表页面  
**When** 用户选择"按收藏时间"排序  
**Then** 菜品按收藏时间倒序显示  
**And** 最近收藏的在最前面

#### Scenario: 按使用频率排序
**Given** 用户在收藏列表页面  
**When** 用户选择"按使用频率"排序  
**Then** 菜品按在历史订单中出现的次数排序  
**And** 最常点的菜品在最前面  
**And** 显示使用次数标记

#### Scenario: 按价格排序
**Given** 用户在收藏列表页面  
**When** 用户选择"按价格"排序  
**Then** 可以选择升序或降序  
**And** 菜品按价格排列

### Requirement: 收藏统计
系统 SHALL 显示收藏相关的统计信息。

#### Scenario: 显示收藏统计
**Given** 用户在收藏页面  
**Then** 页面顶部显示统计卡片：
  - 收藏总数
  - 本周新增收藏
  - 最常点的收藏菜品（Top 3）

#### Scenario: 查看收藏趋势
**Given** 用户在收藏统计区域  
**When** 用户点击"查看详情"  
**Then** 显示收藏趋势图表  
**And** 显示每个收藏菜品的使用频率

## 数据模型

```typescript
interface FavoriteDish extends Dish {
  isFavorite: true;
  favoriteAt: number;        // 收藏时间戳
  usageCount: number;        // 在订单中出现的次数
}

interface FavoriteStats {
  totalCount: number;
  weeklyNewCount: number;
  topFavorites: Array<{
    dishId: string;
    dishName: string;
    usageCount: number;
  }>;
}

type FavoriteSortType = 'time' | 'usage' | 'price-asc' | 'price-desc';
```

## 业务规则

### 收藏限制
- 无收藏数量上限
- 已删除的菜品自动从收藏中移除
- 收藏状态持久化到 LocalStorage

### 使用频率计算
```
使用频率 = 该菜品在历史订单中出现的总次数
每次订单提交后更新所有相关菜品的使用频率
```

## UI 规范

### 收藏图标
- 未收藏：空心星星，灰色 (#CCCCCC)
- 已收藏：实心星星，金色 (#FFD700)
- 大小：24px × 24px
- 点击区域：44px × 44px（方便触摸）
- 动画：收藏时星星放大并旋转 360 度

### 收藏列表布局
- 网格布局（桌面端）：3-4 列
- 列表布局（移动端）：单列
- 卡片样式：与菜品列表一致
- 显示收藏时间："收藏于 MM-DD"

### 排序选择器
- 位置：页面右上角
- 样式：下拉菜单
- 选项清晰标注当前排序方式

## 性能要求
- 收藏/取消收藏响应时间 < 100ms
- 收藏列表加载时间 < 300ms
- 使用频率计算时间 < 200ms
- 支持至少 100 个收藏菜品
