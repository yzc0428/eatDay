import { Card, Space, Typography, Tag, Button, Popconfirm } from 'antd'
import { DeleteOutlined, ReloadOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Order } from '@/types'
import { formatDateTime, formatRelativeTime } from '@/utils/date'

const { Text, Title } = Typography

interface OrderCardProps {
  order: Order
  onDelete: (id: string) => void
  onReorder: (order: Order) => void
  onViewDetail: (order: Order) => void
}

const OrderCard = ({ order, onDelete, onReorder, onViewDetail }: OrderCardProps) => {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Card
      hoverable
      onClick={() => onViewDetail(order)}
      style={{ marginBottom: 16 }}
      actions={[
        <Button
          type="text"
          icon={<ReloadOutlined />}
          onClick={e => {
            e.stopPropagation()
            onReorder(order)
          }}
          key="reorder"
        >
          再来一单
        </Button>,
        <Popconfirm
          title="确定要删除这个订单吗？"
          onConfirm={e => {
            e?.stopPropagation()
            onDelete(order.id)
          }}
          onCancel={e => e?.stopPropagation()}
          okText="确定"
          cancelText="取消"
          key="delete"
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={e => e.stopPropagation()}
          >
            删除
          </Button>
        </Popconfirm>,
      ]}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        {/* 订单时间 */}
        <Space>
          <ClockCircleOutlined style={{ color: '#999' }} />
          <Text type="secondary">{formatRelativeTime(order.createdAt)}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            ({formatDateTime(order.createdAt)})
          </Text>
        </Space>

        {/* 订单内容 */}
        <div>
          <Text strong>菜品：</Text>
          <div style={{ marginTop: 8 }}>
            {order.items.map((item, index) => (
              <Tag key={index} style={{ marginBottom: 4 }}>
                {item.dishName} × {item.quantity}
              </Tag>
            ))}
          </div>
        </div>

        {/* 订单统计 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 8,
            paddingTop: 12,
            borderTop: '1px solid #f0f0f0',
          }}
        >
          <Space>
            <Text type="secondary">共 {totalItems} 份</Text>
          </Space>
          <Title level={4} style={{ margin: 0, color: '#FF9966' }}>
            ¥{order.totalPrice.toFixed(2)}
          </Title>
        </div>
      </Space>
    </Card>
  )
}

export default OrderCard
