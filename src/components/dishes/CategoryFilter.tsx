import { Tag, Space } from 'antd'
import { DishCategory } from '@/types'

interface CategoryFilterProps {
  selectedCategory: DishCategory | 'all'
  onCategoryChange: (category: DishCategory | 'all') => void
  dishCounts: Record<DishCategory | 'all', number>
}

const categoryConfig = [
  { value: 'all' as const, label: '全部', color: '#666' },
  { value: DishCategory.STAPLE, label: '主食', color: '#faad14' },
  { value: DishCategory.DISH, label: '菜品', color: '#52c41a' },
  { value: DishCategory.SOUP, label: '汤品', color: '#1890ff' },
  { value: DishCategory.DRINK, label: '饮料', color: '#722ed1' },
  { value: DishCategory.DESSERT, label: '甜点', color: '#eb2f96' },
]

const CategoryFilter = ({ selectedCategory, onCategoryChange, dishCounts }: CategoryFilterProps) => {
  return (
    <Space size="middle" wrap>
      {categoryConfig.map(category => {
        const isSelected = selectedCategory === category.value
        const count = dishCounts[category.value] || 0

        return (
          <Tag
            key={category.value}
            color={isSelected ? category.color : 'default'}
            style={{
              cursor: 'pointer',
              fontSize: 14,
              padding: '4px 12px',
              borderRadius: 16,
              border: isSelected ? 'none' : '1px solid #d9d9d9',
            }}
            onClick={() => onCategoryChange(category.value)}
          >
            {category.label} ({count})
          </Tag>
        )
      })}
    </Space>
  )
}

export default CategoryFilter
