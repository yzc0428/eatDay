# 功能规范：统计功能

## 概述
统计模块提供数据分析和可视化，帮助用户了解饮食习惯和消费情况。

## ADDED Requirements

### Requirement: 统计概览
系统 SHALL 允许用户查看关键统计指标。

#### Scenario: 显示统计概览
**Given** 用户进入统计页面  
**Then** 显示统计卡片：
  - 总订单数
  - 总消费金额
  - 最常点的菜品（Top 1）
  - 平均每单价格

**And** 每个卡片显示：
  - 数值
  - 与上周/上月的对比（增长/下降百分比）
  - 趋势图标（↑ 或 ↓）

#### Scenario: 无历史数据
**Given** 用户还没有任何订单记录  
**When** 用户进入统计页面  
**Then** 显示空状态："还没有数据，开始点餐后可以查看统计"  
**And** 显示"开始点餐"按钮

### Requirement: 热门菜品排行
系统 SHALL 显示最常点的菜品排行榜。

#### Scenario: 查看热门菜品 Top 10
**Given** 用户在统计页面  
**When** 用户查看"热门菜品"区域  
**Then** 显示点单次数最多的前 10 个菜品  
**And** 每个菜品显示：
  - 排名（1-10）
  - 菜品名称和图片
  - 点单次数
  - 占比百分比
  - 进度条可视化

#### Scenario: 点击热门菜品
**Given** 用户在热门菜品列表中  
**When** 用户点击某个菜品  
**Then** 显示该菜品的详细统计：
  - 总点单次数
  - 总消费金额
  - 首次点单时间
  - 最近点单时间
  - 点单趋势图（按时间）

### Requirement: 消费统计
系统 SHALL 允许用户查看消费趋势和分布。

#### Scenario: 查看消费趋势图
**Given** 用户在统计页面  
**When** 用户查看"消费趋势"区域  
**Then** 显示折线图  
**And** 默认显示最近 30 天的每日消费  
**And** X 轴：日期  
**And** Y 轴：消费金额  
**And** 可以切换时间范围：7 天、30 天、90 天、全部

#### Scenario: 查看消费分布
**Given** 用户在统计页面  
**When** 用户查看"消费分布"区域  
**Then** 显示饼图  
**And** 按菜品分类显示消费占比：
  - 主食：30%
  - 菜品：45%
  - 汤品：15%
  - 饮料：10%

**And** 可以点击分类查看该分类下的详细菜品消费

### Requirement: 时间段分析
系统 SHALL 允许用户按时间段查看统计数据。

#### Scenario: 选择统计时间范围
**Given** 用户在统计页面  
**When** 用户点击时间选择器  
**Then** 显示时间范围选项：
  - 今天
  - 本周
  - 本月
  - 最近 30 天
  - 最近 90 天
  - 自定义范围

**When** 用户选择"本月"  
**Then** 所有统计数据更新为本月的数据  
**And** 显示时间范围标签："2024年1月"

#### Scenario: 对比不同时间段
**Given** 用户在统计页面  
**When** 用户开启"对比模式"  
**And** 选择两个时间段进行对比  
**Then** 显示对比图表  
**And** 高亮显示差异  
**And** 显示增长/下降百分比

### Requirement: 订单频率分析
系统 SHALL 分析用户的点餐频率。

#### Scenario: 查看点餐频率
**Given** 用户在统计页面  
**When** 用户查看"点餐频率"区域  
**Then** 显示柱状图  
**And** X 轴：星期一到星期日  
**And** Y 轴：订单数量  
**And** 显示每天的平均订单数

#### Scenario: 查看时段分布
**Given** 用户在点餐频率区域  
**When** 用户切换到"时段分布"视图  
**Then** 显示一天中不同时段的点餐分布：
  - 早餐（6:00-9:00）
  - 午餐（11:00-14:00）
  - 晚餐（17:00-20:00）
  - 其他时段

### Requirement: 数据导出
系统 SHALL 允许用户导出统计数据。

#### Scenario: 导出统计报告
**Given** 用户在统计页面  
**When** 用户点击"导出报告"按钮  
**Then** 显示导出选项：
  - 导出格式：PDF / Excel / JSON
  - 时间范围选择
  - 包含内容选择（概览/热门菜品/消费趋势等）

**When** 用户选择 PDF 格式并点击"导出"  
**Then** 生成 PDF 报告  
**And** 自动下载文件  
**And** 文件名格式："eatDay统计报告_YYYYMMDD.pdf"

#### Scenario: 导出原始数据
**Given** 用户在统计页面  
**When** 用户选择导出 JSON 格式  
**Then** 导出包含所有订单和菜品的原始数据  
**And** 数据结构清晰，便于二次分析

### Requirement: 统计数据缓存
系统 MUST 缓存统计数据以提升性能。

#### Scenario: 统计数据自动更新
**Given** 用户在统计页面  
**When** 用户提交新订单  
**Then** 统计数据自动更新  
**And** 无需手动刷新页面

#### Scenario: 统计数据重新计算
**Given** 用户在统计页面  
**When** 用户点击"刷新数据"按钮  
**Then** 重新计算所有统计指标  
**And** 显示加载指示器  
**And** 更新完成后显示提示

## 数据模型

```typescript
interface Statistics {
  overview: {
    totalOrders: number;
    totalSpent: number;
    averageOrderPrice: number;
    topDish: {
      dishId: string;
      dishName: string;
      count: number;
    };
  };
  
  topDishes: Array<{
    dishId: string;
    dishName: string;
    count: number;
    percentage: number;
    totalSpent: number;
  }>;
  
  spendingTrend: Array<{
    date: string;
    amount: number;
  }>;
  
  categoryDistribution: Array<{
    category: DishCategory;
    amount: number;
    percentage: number;
  }>;
  
  orderFrequency: {
    byWeekday: Record<string, number>;
    byTimeSlot: Record<string, number>;
  };
  
  lastUpdated: number;
}
```

## 计算规则

### 热门菜品排序
```
排序依据：点单次数（订单中出现的次数）
相同次数时：按总消费金额排序
```

### 消费占比计算
```
分类占比 = (该分类总消费 / 总消费) × 100%
保留一位小数
```

### 平均订单价格
```
平均订单价格 = 总消费金额 / 订单总数
保留两位小数
```

### 增长率计算
```
增长率 = ((当前值 - 对比值) / 对比值) × 100%
保留一位小数
正数显示 +，负数显示 -
```

## UI 规范

### 统计卡片
- 布局：2×2 网格（桌面端），单列（移动端）
- 卡片大小：统一高度 120px
- 内容：图标 + 标题 + 数值 + 趋势
- 颜色：每个指标使用不同的主题色

### 图表样式
- 配色：使用温馨的家居配色方案
- 字体：清晰易读，数字加粗
- 交互：悬停显示详细数值
- 响应式：移动端自动调整图表大小

### 排行榜
- 前三名：金、银、铜色徽章
- 进度条：渐变色填充
- 动画：加载时从左到右填充

## 性能要求
- 统计页面初始加载时间 < 1s
- 图表渲染时间 < 500ms
- 数据切换响应时间 < 300ms
- 支持至少 1000 条订单的统计分析
- 使用 Web Worker 进行复杂计算
