import { Modal, Descriptions, Tag, Table, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { DeliveryOrder, OrderStatus, OrderType, OrderDirection, OrderItem } from '@/types'

interface OrderDetailModalProps {
  visible: boolean
  order: DeliveryOrder
  onClose: () => void
}

// 订单状态映射
const ORDER_STATUS_MAP: Record<OrderStatus, { text: string; color: string }> = {
  [OrderStatus.PENDING]: { text: '待接单', color: 'orange' },
  [OrderStatus.ACCEPTED]: { text: '已接单', color: 'blue' },
  [OrderStatus.PICKING]: { text: '拣货中', color: 'cyan' },
  [OrderStatus.PICKED]: { text: '已拣货', color: 'geekblue' },
  [OrderStatus.DELIVERING]: { text: '配送中', color: 'processing' },
  [OrderStatus.ARRIVED]: { text: '已到达', color: 'purple' },
  [OrderStatus.COMPLETED]: { text: '已完成', color: 'success' },
  [OrderStatus.CANCELLED]: { text: '已取消', color: 'default' },
  [OrderStatus.EXCEPTION]: { text: '异常', color: 'error' },
}

// 订单类型映射
const ORDER_TYPE_MAP: Record<OrderType, { text: string; color: string }> = {
  [OrderType.O2O]: { text: 'O2O订单', color: 'blue' },
  [OrderType.B2C]: { text: 'B2C订单', color: 'green' },
}

// 订单方向映射
const ORDER_DIRECTION_MAP: Record<OrderDirection, { text: string; color: string }> = {
  [OrderDirection.FORWARD]: { text: '正向', color: 'blue' },
  [OrderDirection.REVERSE]: { text: '逆向', color: 'orange' },
}

const OrderDetailModal = ({ visible, order, onClose }: OrderDetailModalProps) => {
  // 商品列表列定义
  const itemColumns: ColumnsType<OrderItem> = [
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (quantity: number, record) => `${quantity} ${record.unit}`,
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '小计',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
  ]

  return (
    <Modal
      title="订单详情"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 基本信息 */}
        <Descriptions title="基本信息" bordered column={2}>
          <Descriptions.Item label="订单号">{order.orderNo}</Descriptions.Item>
          <Descriptions.Item label="订单状态">
            <Tag color={ORDER_STATUS_MAP[order.status].color}>
              {ORDER_STATUS_MAP[order.status].text}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="订单类型">
            <Tag color={ORDER_TYPE_MAP[order.type].color}>
              {ORDER_TYPE_MAP[order.type].text}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="订单方向">
            <Tag color={ORDER_DIRECTION_MAP[order.direction].color}>
              {ORDER_DIRECTION_MAP[order.direction].text}
            </Tag>
          </Descriptions.Item>
          {order.platform && (
            <Descriptions.Item label="平台" span={2}>
              {order.platform}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="下单时间" span={2}>
            {dayjs(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
        </Descriptions>

        {/* 仓库信息 */}
        <Descriptions title="仓库信息" bordered column={2}>
          <Descriptions.Item label="仓库名称">{order.warehouseName}</Descriptions.Item>
          <Descriptions.Item label="仓库地址">{order.warehouseAddress}</Descriptions.Item>
        </Descriptions>

        {/* 收货信息 */}
        <Descriptions title="收货信息" bordered column={2}>
          <Descriptions.Item label="收货人">{order.deliveryAddress.recipientName}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{order.deliveryAddress.recipientPhone}</Descriptions.Item>
          <Descriptions.Item label="收货地址" span={2}>
            {order.deliveryAddress.province}
            {order.deliveryAddress.city}
            {order.deliveryAddress.district}
            {order.deliveryAddress.street}
            {order.deliveryAddress.detail}
          </Descriptions.Item>
        </Descriptions>

        {/* 配送信息 */}
        {order.courierId && (
          <Descriptions title="配送信息" bordered column={2}>
            <Descriptions.Item label="配送员">{order.courierName}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{order.courierPhone}</Descriptions.Item>
            {order.acceptedAt && (
              <Descriptions.Item label="接单时间" span={2}>
                {dayjs(order.acceptedAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            )}
            {order.pickedAt && (
              <Descriptions.Item label="拣货完成时间" span={2}>
                {dayjs(order.pickedAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            )}
            {order.estimatedTime && (
              <Descriptions.Item label="预计送达时间" span={2}>
                {dayjs(order.estimatedTime).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            )}
            {order.deliveredAt && (
              <Descriptions.Item label="实际送达时间" span={2}>
                {dayjs(order.deliveredAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            )}
            {order.courierLocation && (
              <Descriptions.Item label="当前位置" span={2}>
                {order.courierLocation.address}
                <br />
                <span style={{ color: '#999', fontSize: '12px' }}>
                  更新时间: {dayjs(order.courierLocation.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}

        {/* 商品信息 */}
        <div>
          <h4 style={{ marginBottom: 16 }}>商品信息</h4>
          <Table
            columns={itemColumns}
            dataSource={order.items}
            rowKey="productId"
            pagination={false}
            size="small"
          />
        </div>

        {/* 费用信息 */}
        <Descriptions title="费用信息" bordered column={2}>
          <Descriptions.Item label="商品总额">
            ¥{order.totalAmount.toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label="配送费">
            ¥{order.deliveryFee.toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label="订单总额" span={2}>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff4d4f' }}>
              ¥{(order.totalAmount + order.deliveryFee).toFixed(2)}
            </span>
          </Descriptions.Item>
        </Descriptions>

        {/* 备注信息 */}
        {order.notes && (
          <Descriptions title="备注信息" bordered column={1}>
            <Descriptions.Item label="备注">{order.notes}</Descriptions.Item>
          </Descriptions>
        )}

        {/* 取消原因 */}
        {order.cancelReason && (
          <Descriptions title="取消信息" bordered column={1}>
            <Descriptions.Item label="取消原因">{order.cancelReason}</Descriptions.Item>
          </Descriptions>
        )}
      </Space>
    </Modal>
  )
}

export default OrderDetailModal
