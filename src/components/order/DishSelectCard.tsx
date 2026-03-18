import { Card, Tag, Button, Badge } from 'antd'
import { PlusOutlined, HeartFilled } from '@ant-design/icons'
import { Dish, DishCategory } from '@/types'

const { Meta } = Card

interface DishSelectCardProps {
  dish: Dish
  quantity: number
  isFavorite: boolean
  onAdd: (dish: Dish) => void
}

const categoryColors: Record<DishCategory, string> = {
  [DishCategory.STAPLE]: '#faad14',
  [DishCategory.DISH]: '#52c41a',
  [DishCategory.SOUP]: '#1890ff',
  [DishCategory.DRINK]: '#722ed1',
  [DishCategory.DESSERT]: '#eb2f96',
}

const categoryNames: Record<DishCategory, string> = {
  [DishCategory.STAPLE]: '主食',
  [DishCategory.DISH]: '菜品',
  [DishCategory.SOUP]: '汤品',
  [DishCategory.DRINK]: '饮料',
  [DishCategory.DESSERT]: '甜点',
}

const DishSelectCard = ({ dish, quantity, isFavorite, onAdd }: DishSelectCardProps) => {
  return (
    <Badge count={quantity} offset={[-10, 10]} style={{ backgroundColor: '#FF9966' }}>
      <Card
        hoverable
        cover={
          <div style={{ position: 'relative' }}>
            {dish.image ? (
              <img
                alt={dish.name}
                src={dish.image}
                style={{ height: 160, objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  height: 160,
                  background: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 40,
                }}
              >
                🍽️
              </div>
            )}
            {isFavorite && (
              <HeartFilled
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  fontSize: 20,
                  color: '#ff4d4f',
                }}
              />
            )}
          </div>
        }
        onClick={() => onAdd(dish)}
        style={{ height: '100%' }}
      >
        <Meta
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {dish.name}
              </span>
              <Tag color={categoryColors[dish.category]} style={{ marginLeft: 8 }}>
                {categoryNames[dish.category]}
              </Tag>
            </div>
          }
          description={
            <div>
              <div style={{ fontSize: 18, fontWeight: 'bold', color: '#FF9966', marginTop: 8 }}>
                ¥{dish.price.toFixed(2)}
              </div>
              {dish.description && (
                <div
                  style={{
                    marginTop: 8,
                    color: '#999',
                    fontSize: 12,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {dish.description}
                </div>
              )}
              <Button
                type="primary"
                size="small"
                icon={<PlusOutlined />}
                style={{ marginTop: 12, width: '100%' }}
                onClick={e => {
                  e.stopPropagation()
                  onAdd(dish)
                }}
              >
                添加
              </Button>
            </div>
          }
        />
      </Card>
    </Badge>
  )
}

export default DishSelectCard
