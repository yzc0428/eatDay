import { Card, Tag, Button, Space, Popconfirm } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  HeartOutlined,
  HeartFilled,
} from '@ant-design/icons'
import { Dish, DishCategory } from '@/types'
import { useFavorites } from '@/contexts'

const { Meta } = Card

interface DishCardProps {
  dish: Dish
  onEdit: (dish: Dish) => void
  onDelete: (id: string) => void
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

const DishCard = ({ dish, onEdit, onDelete }: DishCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(dish.id)

  return (
    <Card
      hoverable
      cover={
        dish.image ? (
          <img
            alt={dish.name}
            src={dish.image}
            style={{ height: 200, objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              height: 200,
              background: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48,
            }}
          >
            🍽️
          </div>
        )
      }
      actions={[
        <Button
          type="text"
          icon={favorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
          onClick={() => toggleFavorite(dish.id)}
          key="favorite"
        >
          {favorite ? '已收藏' : '收藏'}
        </Button>,
        <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(dish)} key="edit">
          编辑
        </Button>,
        <Popconfirm
          title="确定要删除这个菜品吗？"
          onConfirm={() => onDelete(dish.id)}
          okText="确定"
          cancelText="取消"
          key="delete"
        >
          <Button type="text" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>,
      ]}
    >
      <Meta
        title={
          <Space>
            <span>{dish.name}</span>
            <Tag color={categoryColors[dish.category]}>{categoryNames[dish.category]}</Tag>
          </Space>
        }
        description={
          <div>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#FF9966', marginTop: 8 }}>
              ¥{dish.price.toFixed(2)}
            </div>
            {dish.description && (
              <div
                style={{
                  marginTop: 8,
                  color: '#666',
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
          </div>
        }
      />
    </Card>
  )
}

export default DishCard
