# 功能规范：菜品分类

## 概述
菜品分类模块提供菜品的分类管理和筛选功能，帮助用户更好地组织和查找菜品。

## ADDED Requirements

### Requirement: 按分类筛选菜品
系统 SHALL 允许用户通过分类快速筛选菜品列表。

#### Scenario: 用户选择分类筛选
**Given** 用户在菜品列表页面  
**And** 页面顶部显示分类标签："全部"、"主食"、"菜品"、"汤品"、"饮料"  
**When** 用户点击"菜品"标签  
**Then** 列表只显示分类为"菜品"的菜品  
**And** "菜品"标签高亮显示  
**And** 显示筛选结果数量："菜品 (12)"

#### Scenario: 查看全部分类
**Given** 用户已选择某个分类筛选  
**When** 用户点击"全部"标签  
**Then** 显示所有分类的菜品  
**And** "全部"标签高亮显示  
**And** 显示总数量："全部 (45)"

#### Scenario: 某分类下没有菜品
**Given** 用户在菜品列表页面  
**When** 用户点击"汤品"标签  
**And** 该分类下没有任何菜品  
**Then** 显示空状态："该分类下还没有菜品"  
**And** 显示"添加菜品"按钮

### Requirement: 分类统计显示
系统 SHALL 显示每个分类下的菜品数量。

#### Scenario: 显示分类统计
**Given** 用户在菜品列表页面  
**Then** 每个分类标签显示该分类的菜品数量  
**And** 格式为："主食 (8)"、"菜品 (12)"、"汤品 (5)"、"饮料 (3)"  
**And** "全部"显示总数："全部 (28)"

#### Scenario: 分类数量实时更新
**Given** 用户在"菜品"分类下  
**And** 当前显示"菜品 (12)"  
**When** 用户删除一个菜品  
**Then** 分类数量更新为"菜品 (11)"  
**And** "全部"数量更新为"全部 (27)"

### Requirement: 分类图标和颜色
每个分类 MUST 有独特的图标和颜色标识。

#### Scenario: 显示分类视觉标识
**Given** 用户在菜品列表页面  
**Then** 每个分类显示对应的图标：
  - 主食：🍚 米饭图标，橙色
  - 菜品：🥘 炒菜图标，绿色
  - 汤品：🍲 汤碗图标，蓝色
  - 饮料：🥤 饮料图标，粉色

**And** 菜品卡片上的分类标签使用对应颜色

### Requirement: 分类排序
分类 MUST 按照预定义的顺序显示。

#### Scenario: 分类显示顺序
**Given** 用户在任何包含分类的页面  
**Then** 分类按以下顺序显示：
  1. 全部
  2. 主食
  3. 菜品
  4. 汤品
  5. 饮料

## 数据模型

```typescript
type DishCategory = 'main' | 'dish' | 'soup' | 'drink';

interface CategoryConfig {
  key: DishCategory;
  label: string;
  icon: string;
  color: string;
  order: number;
}

const CATEGORY_CONFIGS: Record<DishCategory, CategoryConfig> = {
  main: {
    key: 'main',
    label: '主食',
    icon: '🍚',
    color: '#FF9966',
    order: 1
  },
  dish: {
    key: 'dish',
    label: '菜品',
    icon: '🥘',
    color: '#66CC99',
    order: 2
  },
  soup: {
    key: 'soup',
    label: '汤品',
    icon: '🍲',
    color: '#6699CC',
    order: 3
  },
  drink: {
    key: 'drink',
    label: '饮料',
    icon: '🥤',
    color: '#FF99CC',
    order: 4
  }
};
```

## UI 规范

### 分类标签样式
- 未选中：白色背景，灰色边框，灰色文字
- 选中：对应分类的颜色背景，白色文字
- 悬停：轻微放大效果（scale 1.05）
- 圆角：8px
- 内边距：8px 16px
- 字体大小：14px

### 分类筛选栏
- 位置：页面顶部，搜索框下方
- 布局：横向排列，可横向滚动（移动端）
- 间距：标签之间 12px
- 高度：48px

## 性能要求
- 分类切换响应时间 < 100ms
- 分类统计计算时间 < 50ms
- 支持大量菜品时的流畅切换
