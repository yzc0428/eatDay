import { Card, List, InputNumber, Button, Empty, Space, Typography, Divider, Popconfirm } from 'antd'
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { OrderItem } from '@/types'

const { Text, Title } = Typography

interface OrderCartProps {
  items: OrderItem[]
  onUpdateQuantity: (dishId: string, quantity: number) => void
  onRemoveItem: (dishId: string) => void
  onClearCart: () => void
  onSubmit: () => void
}

const OrderCart = ({ items, onUpdateQuantity, onRemoveItem, onClearCart, onSubmit }: OrderCartProps) => {
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Card
      title={
        <Space>
          <ShoppingCartOutlined />
          <span>点餐清单</span>
          {items.length > 0 && <Text type="secondary">({totalItems} 份)</Text>}
        </Space>
      }
      extra={
        items.length > 0 && (
          <Popconfirm
            title="确定要清空购物车吗？"
            onConfirm={onClearCart}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" size="small" danger>
              清空
            </Button>
          </Popconfirm>
        )
      }
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      bodyStyle={{ flex: 1, overflow: 'auto', padding: items.length === 0 ? 24 : 12 }}
    >
      {items.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="购物车是空的"
          style={{ marginTop: 60 }}
        />
      ) : (
        <>
          <List
            dataSource={items}
            renderItem={item => (
              <List.Item
                key={item.dishId}
                style={{ padding: '12px 0' }}
                actions={[
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => onRemoveItem(item.dishId)}
                    key="delete"
                  />,
                ]}
              >
                <List.Item.Meta
                  title={<Text strong>{item.dishName}</Text>}
                  description={
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Text type="secondary">¥{item.price.toFixed(2)}</Text>
                      <Space>
                        <Text type="secondary">数量：</Text>
                        <InputNumber
                          min={1}
                          max={99}
                          value={item.quantity}
                          onChange={value => onUpdateQuantity(item.dishId, value || 1)}
                          size="small"
                          style={{ width: 80 }}
                        />
                      </Space>
                      <Text strong style={{ color: '#FF9966' }}>
                        小计：¥{(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />

          <Divider />

          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={4} style={{ margin: 0 }}>
                总计：
              </Title>
              <Title level={3} style={{ margin: 0, color: '#FF9966' }}>
                ¥{totalPrice.toFixed(2)}
              </Title>
            </div>

            <Button
              type="primary"
              size="large"
              block
              onClick={onSubmit}
              icon={<ShoppingCartOutlined />}
            >
              提交订单
            </Button>
          </Space>
        </>
      )}
    </Card>
  )
}

export default OrderCart
