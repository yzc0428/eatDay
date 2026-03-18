# 架构设计：家庭点餐应用

## 系统架构

### 整体架构
```
┌─────────────────────────────────────────┐
│           React Application             │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │  Pages   │  │Components│  │ Hooks  ││
│  └──────────┘  └──────────┘  └────────┘│
├─────────────────────────────────────────┤
│  ┌──────────────────────────────────┐  │
│  │      Context API (State)         │  │
│  └──────────────────────────────────┘  │
├─────────────────────────────────────────┤
│  ┌──────────────────────────────────┐  │
│  │      Storage Service Layer       │  │
│  └──────────────────────────────────┘  │
├─────────────────────────────────────────┤
│           LocalStorage API              │
└─────────────────────────────────────────┘
```

## 技术选型

### 前端技术栈
- **React 18.2+**：使用最新的 React 特性
- **React Router 6**：页面路由管理
- **UI 组件库**：Ant Design 5（支持主题定制，组件丰富）
- **Vite 4**：快速的开发构建工具
- **TypeScript**：类型安全
- **CSS Modules**：样式隔离

### 状态管理方案
使用 React Context API + useReducer 实现轻量级状态管理：
- `DishContext`：菜品数据管理
- `OrderContext`：点餐状态管理
- `HistoryContext`：历史记录管理
- `StatisticsContext`：统计数据管理

### 数据存储设计

#### LocalStorage 数据结构
```typescript
// 菜品数据
dishes: {
  [dishId: string]: {
    id: string;
    name: string;
    category: 'main' | 'dish' | 'soup' | 'drink';
    price: number;
    image?: string; // Base64
    isFavorite: boolean;
    createdAt: number;
    updatedAt: number;
  }
}

// 点餐历史
orderHistory: {
  [orderId: string]: {
    id: string;
    date: number;
    items: Array<{
      dishId: string;
      quantity: number;
    }>;
    totalPrice: number;
  }
}

// 统计数据（缓存）
statistics: {
  mostOrdered: Array<{dishId: string; count: number}>;
  totalSpent: number;
  lastUpdated: number;
}
```

## 核心模块设计

### 1. 菜品管理模块
**职责**：CRUD 操作、分类管理、收藏功能

**核心组件**：
- `DishList`：菜品列表展示
- `DishForm`：添加/编辑表单
- `DishCard`：菜品卡片
- `CategoryFilter`：分类筛选器

### 2. 点餐模块
**职责**：菜品选择、数量管理、订单生成

**核心组件**：
- `OrderPage`：点餐主页面
- `DishSelector`：菜品选择器
- `OrderCart`：购物车
- `OrderSummary`：订单摘要

### 3. 历史记录模块
**职责**：历史订单查看、详情展示

**核心组件**：
- `HistoryList`：历史列表
- `HistoryDetail`：订单详情
- `HistoryFilter`：时间筛选

### 4. 统计模块
**职责**：数据分析、图表展示

**核心组件**：
- `StatisticsOverview`：统计概览
- `PopularDishes`：热门菜品
- `SpendingChart`：消费趋势图

## 性能优化策略

### 1. 图片优化
- 限制上传图片大小（最大 500KB）
- 自动压缩图片质量
- 使用缩略图展示
- 懒加载图片

### 2. 数据优化
- 分页加载历史记录
- 虚拟滚动长列表
- 统计数据缓存
- 防抖搜索输入

### 3. 存储优化
- 定期清理过期数据
- 压缩存储格式
- 监控存储容量
- 提供数据导出功能

## UI/UX 设计原则

### 温馨家居风格
- **配色方案**：
  - 主色：暖橙色 (#FF9966)
  - 辅助色：奶白色 (#FFF8F0)
  - 强调色：番茄红 (#FF6B6B)
  - 文字色：深棕色 (#5D4E37)

- **视觉元素**：
  - 圆角设计（8-12px）
  - 柔和阴影
  - 手绘风格图标
  - 温暖的渐变背景

- **交互设计**：
  - 大按钮易点击
  - 清晰的视觉反馈
  - 简化的操作流程
  - 友好的错误提示

## 数据迁移与备份

### 导出功能
- JSON 格式导出所有数据
- 支持选择性导出（仅菜品/仅历史）
- 包含时间戳的文件命名

### 导入功能
- 验证数据格式
- 冲突处理策略（覆盖/合并）
- 导入进度提示

## 浏览器兼容性
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- 移动端浏览器支持

## 安全考虑
- XSS 防护（输入验证）
- 图片上传验证
- LocalStorage 数据加密（可选）
- 敏感操作确认

## 扩展性考虑
虽然当前版本使用本地存储，但架构设计应支持未来扩展：
- 抽象存储层接口
- 可替换的数据源
- 模块化的功能设计
- 清晰的组件边界
