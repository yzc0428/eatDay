import { Modal, Descriptions, Table, Typography, Space, Tag } from 'antd'
import { Order } from '@/types'
import { formatDateTime } from '@/utils/date'

const { Title, Text: AntText } = Typography

interface OrderDetailModalProps {
  open: boolean
  order: Order | null
  onClose: () => void
}

const OrderDetailModal = ({ open, order, onClose }: OrderDetailModalProps) => {
  if (!order) return null

  const columns = [
    {
      title: '菜品名称',
      dataIndex: 'dishName',
      key: 'dishName',
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '小计',
      key: 'subtotal',
      render: (_: unknown, record: { price: number; quantity: number }) => (
        <AntText strong style={{ color: '#FF9966' }}>
          ¥{(record.price * record.quantity).toFixed(2)}
        </AntText>
      ),
    },
  ]

  return (
    <Modal
      title="订单详情"
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 订单基本信息 */}
        <Descriptions column={2} bordered>
          <Descriptions.Item label="订单编号" span={2}>
            <Tag color="blue">{order.id}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="下单时间" span={2}>
            {formatDateTime(order.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="菜品数量">
            {order.items.reduce((sum, item) => sum + item.quantity, 0)} 份
          </Descriptions.Item>
          <Descriptions.Item label="订单总价">
            <AntText strong style={{ fontSize: 18, color: '#FF9966' }}>
              ¥{order.totalPrice.toFixed(2)}
            </AntText>
          </Descriptions.Item>
        </Descriptions>

        {/* 订单明细 */}
        <div>
          <Title level={5}>订单明细</Title>
          <Table
            dataSource={order.items}
            columns={columns}
            pagination={false}
            rowKey={(record, index) => `${record.dishId}_${index}`}
            summary={() => (
              <Table.Summary>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3}>
                    <AntText strong>总计</AntText>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <AntText strong style={{ fontSize: 16, color: '#FF9966' }}>
                      ¥{order.totalPrice.toFixed(2)}
                    </AntText>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </div>
      </Space>
    </Modal>
  )
}

export default OrderDetailModal
