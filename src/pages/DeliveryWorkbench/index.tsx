import { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Tag, Select, DatePicker, Statistic, Row, Col, Modal, message } from 'antd'
import { ReloadOutlined, PhoneOutlined, EnvironmentOutlined, SwapOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { Dayjs } from 'dayjs'
import { useDelivery } from '@/contexts'
import { DeliveryOrder, OrderStatus, OrderType, OrderDirection } from '@/types'
import OrderDetailModal from '@/components/delivery/OrderDetailModal'

const { RangePicker } = DatePicker
const { Option } = Select

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

const DeliveryWorkbench = () => {
  const {
    orders,
    couriers,
    reassignOrder,
    getStatistics,
  } = useDelivery()

  // 筛选条件
  const [filterType, setFilterType] = useState<OrderType | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all')
  const [filterDirection, setFilterDirection] = useState<OrderDirection | 'all'>('all')
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null)

  // 弹窗状态
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null)
  const [reassignModalVisible, setReassignModalVisible] = useState(false)
  const [selectedCourierId, setSelectedCourierId] = useState<string>('')

  // 过滤后的订单列表
  const [filteredOrders, setFilteredOrders] = useState<DeliveryOrder[]>(orders)

  // 统计数据
  const statistics = getStatistics()

  // 实时更新订单状态（模拟）
  useEffect(() => {
    const timer = setInterval(() => {
      // 这里可以添加实时更新逻辑，比如轮询后端接口
      // 目前使用 mock 数据，不需要实际更新
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  // 应用筛选条件
  useEffect(() => {
    let result = orders

    // 按类型筛选
    if (filterType !== 'all') {
      result = result.filter((order) => order.type === filterType)
    }

    // 按状态筛选
    if (filterStatus !== 'all') {
      result = result.filter((order) => order.status === filterStatus)
    }

    // 按方向筛选
    if (filterDirection !== 'all') {
      result = result.filter((order) => order.direction === filterDirection)
    }

    // 按时间范围筛选
    if (dateRange) {
      const [start, end] = dateRange
      result = result.filter((order) => {
        const orderTime = dayjs(order.createdAt)
        return orderTime.isAfter(start) && orderTime.isBefore(end)
      })
    }

    setFilteredOrders(result)
  }, [orders, filterType, filterStatus, filterDirection, dateRange])

  // 查看详情
  const handleViewDetail = (order: DeliveryOrder) => {
    setSelectedOrder(order)
    setDetailModalVisible(true)
  }

  // 打开重新派单弹窗
  const handleOpenReassign = (order: DeliveryOrder) => {
    setSelectedOrder(order)
    setSelectedCourierId('')
    setReassignModalVisible(true)
  }

  // 确认重新派单
  const handleConfirmReassign = async () => {
    if (!selectedOrder || !selectedCourierId) {
      message.warning('请选择配送员')
      return
    }

    try {
      await reassignOrder(selectedOrder.id, selectedCourierId)
      message.success('派单成功')
      setReassignModalVisible(false)
      setSelectedOrder(null)
      setSelectedCourierId('')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '派单失败')
    }
  }

  // 联系配送员
  const handleContactCourier = (order: DeliveryOrder) => {
    if (!order.courierPhone) {
      message.warning('该订单暂无配送员')
      return
    }
    Modal.info({
      title: '联系配送员',
      content: (
        <div>
          <p>配送员：{order.courierName}</p>
          <p>电话：{order.courierPhone}</p>
        </div>
      ),
    })
  }

  // 查看配送员位置
  const handleViewLocation = (order: DeliveryOrder) => {
    if (!order.courierLocation) {
      message.warning('暂无配送员位置信息')
      return
    }
    Modal.info({
      title: '配送员位置',
      content: (
        <div>
          <p>配送员：{order.courierName}</p>
          <p>当前位置：{order.courierLocation.address}</p>
          <p>纬度：{order.courierLocation.latitude}</p>
          <p>经度：{order.courierLocation.longitude}</p>
          <p>更新时间：{dayjs(order.courierLocation.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</p>
        </div>
      ),
    })
  }

  // 刷新数据
  const handleRefresh = () => {
    message.success('数据已刷新')
    // 这里可以添加实际的刷新逻辑
  }

  // 表格列定义
  const columns: ColumnsType<DeliveryOrder> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 180,
      fixed: 'left',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: '订单类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: OrderType) => (
        <Tag color={ORDER_TYPE_MAP[type].color}>{ORDER_TYPE_MAP[type].text}</Tag>
      ),
    },
    {
      title: '订单方向',
      dataIndex: 'direction',
      key: 'direction',
      width: 100,
      render: (direction: OrderDirection) => (
        <Tag color={ORDER_DIRECTION_MAP[direction].color}>
          {ORDER_DIRECTION_MAP[direction].text}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: OrderStatus) => (
        <Tag color={ORDER_STATUS_MAP[status].color}>{ORDER_STATUS_MAP[status].text}</Tag>
      ),
    },
    {
      title: '仓库',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 150,
    },
    {
      title: '收货人',
      dataIndex: ['deliveryAddress', 'recipientName'],
      key: 'recipientName',
      width: 100,
    },
    {
      title: '收货地址',
      key: 'address',
      width: 250,
      render: (_, record) => {
        const addr = record.deliveryAddress
        return `${addr.city}${addr.district}${addr.street}${addr.detail}`
      },
    },
    {
      title: '配送员',
      dataIndex: 'courierName',
      key: 'courierName',
      width: 100,
      render: (name: string | undefined) => name || '-',
    },
    {
      title: '订单金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 100,
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '下单时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (time: number) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      width: 100,
      render: (platform: string | undefined) => platform || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleViewDetail(record)}>
            详情
          </Button>
          {record.status === OrderStatus.PENDING && (
            <Button type="link" size="small" onClick={() => handleOpenReassign(record)}>
              派单
            </Button>
          )}
          {record.courierId && (
            <>
              <Button
                type="link"
                size="small"
                icon={<PhoneOutlined />}
                onClick={() => handleContactCourier(record)}
              >
                联系
              </Button>
              {record.courierLocation && (
                <Button
                  type="link"
                  size="small"
                  icon={<EnvironmentOutlined />}
                  onClick={() => handleViewLocation(record)}
                >
                  位置
                </Button>
              )}
            </>
          )}
          {(record.status === OrderStatus.ACCEPTED || record.status === OrderStatus.PICKING) && (
            <Button
              type="link"
              size="small"
              icon={<SwapOutlined />}
              onClick={() => handleOpenReassign(record)}
            >
              改派
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总订单数"
              value={statistics.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待接单"
              value={statistics.pending}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="配送中"
              value={statistics.delivering}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="异常订单"
              value={statistics.exception}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Space size="middle" wrap>
          <span>订单类型：</span>
          <Select
            value={filterType}
            onChange={setFilterType}
            style={{ width: 150 }}
          >
            <Option value="all">全部</Option>
            <Option value={OrderType.O2O}>O2O订单</Option>
            <Option value={OrderType.B2C}>B2C订单</Option>
          </Select>

          <span>订单状态：</span>
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 150 }}
          >
            <Option value="all">全部</Option>
            <Option value={OrderStatus.PENDING}>待接单</Option>
            <Option value={OrderStatus.ACCEPTED}>已接单</Option>
            <Option value={OrderStatus.PICKING}>拣货中</Option>
            <Option value={OrderStatus.PICKED}>已拣货</Option>
            <Option value={OrderStatus.DELIVERING}>配送中</Option>
            <Option value={OrderStatus.ARRIVED}>已到达</Option>
            <Option value={OrderStatus.COMPLETED}>已完成</Option>
            <Option value={OrderStatus.CANCELLED}>已取消</Option>
            <Option value={OrderStatus.EXCEPTION}>异常</Option>
          </Select>

          <span>订单方向：</span>
          <Select
            value={filterDirection}
            onChange={setFilterDirection}
            style={{ width: 150 }}
          >
            <Option value="all">全部</Option>
            <Option value={OrderDirection.FORWARD}>正向</Option>
            <Option value={OrderDirection.REVERSE}>逆向</Option>
          </Select>

          <span>下单时间：</span>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs] | null)}
            showTime
            format="YYYY-MM-DD HH:mm"
          />

          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            刷新
          </Button>
        </Space>
      </Card>

      {/* 订单列表 */}
      <Card title={`订单池 (${filteredOrders.length})`}>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          scroll={{ x: 1800 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 订单详情弹窗 */}
      {selectedOrder && (
        <OrderDetailModal
          visible={detailModalVisible}
          order={selectedOrder}
          onClose={() => {
            setDetailModalVisible(false)
            setSelectedOrder(null)
          }}
        />
      )}

      {/* 重新派单弹窗 */}
      <Modal
        title="派单/改派"
        open={reassignModalVisible}
        onOk={handleConfirmReassign}
        onCancel={() => {
          setReassignModalVisible(false)
          setSelectedOrder(null)
          setSelectedCourierId('')
        }}
        width={600}
      >
        {selectedOrder && (
          <div>
            <p>
              <strong>订单号：</strong>
              {selectedOrder.orderNo}
            </p>
            <p>
              <strong>收货地址：</strong>
              {selectedOrder.deliveryAddress.city}
              {selectedOrder.deliveryAddress.district}
              {selectedOrder.deliveryAddress.street}
              {selectedOrder.deliveryAddress.detail}
            </p>
            <p>
              <strong>当前配送员：</strong>
              {selectedOrder.courierName || '未分配'}
            </p>
            <div style={{ marginTop: 16 }}>
              <span style={{ marginRight: 8 }}>选择配送员：</span>
              <Select
                value={selectedCourierId}
                onChange={setSelectedCourierId}
                style={{ width: 300 }}
                placeholder="请选择配送员"
              >
                {couriers.map((courier) => (
                  <Option key={courier.id} value={courier.id}>
                    {courier.name} - {courier.phone} (当前订单: {courier.currentOrders}，评分: {courier.rating})
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default DeliveryWorkbench
