import { useState } from 'react'
import { Table, InputNumber, Button, message, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useBidding } from '@/contexts'
import { BiddingRecord } from '@/types'
import { formatDate } from '@/utils/date'
import './index.css'

const MerchantBidding = () => {
  const { records, updateBiddingPrice, updateBiddingQuantity, submitBidding, getPendingRecords } = useBidding()
  const [submittingIds, setSubmittingIds] = useState<Set<string>>(new Set())

  const pendingRecords = getPendingRecords()

  const handlePriceChange = (id: string, value: number | null) => {
    if (value !== null && value > 0) {
      updateBiddingPrice(id, value)
    }
  }

  const handleQuantityChange = (id: string, value: number | null) => {
    if (value !== null && value > 0) {
      updateBiddingQuantity(id, value)
    }
  }

  const handleSubmit = async (record: BiddingRecord) => {
    if (!record.newPrice || record.newPrice <= 0) {
      message.error('请填写有效的新报价')
      return
    }

    if (!record.newQuantity || record.newQuantity <= 0) {
      message.error('请填写有效的新报量')
      return
    }

    setSubmittingIds((prev) => new Set(prev).add(record.id))

    try {
      await submitBidding(record.id)
      message.success({
        content: `提报单 ${record.reportOrderNo} 竞价提交成功！`,
        duration: 3,
      })
    } catch (error) {
      message.error((error as Error).message || '提交失败，请重试')
    } finally {
      setSubmittingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(record.id)
        return newSet
      })
    }
  }

  const columns: ColumnsType<BiddingRecord> = [
    {
      title: '寻源单号',
      dataIndex: 'sourcingOrderNo',
      key: 'sourcingOrderNo',
      width: 140,
      fixed: 'left',
      render: (text) => <span className="order-no">{text}</span>,
    },
    {
      title: '提报单号',
      dataIndex: 'reportOrderNo',
      key: 'reportOrderNo',
      width: 140,
      fixed: 'left',
      render: (text) => <span className="order-no">{text}</span>,
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 120,
    },
    {
      title: '货品ID',
      dataIndex: 'productId',
      key: 'productId',
      width: 120,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '货品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 150,
      render: (text) => <span className="product-name">{text}</span>,
    },
    {
      title: '仓库名称',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 140,
    },
    {
      title: '当前价格',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      width: 110,
      render: (price, record) => (
        <span className="price-text">
          ¥{price.toFixed(2)}/{record.unit}
        </span>
      ),
    },
    {
      title: '当前报量',
      dataIndex: 'currentQuantity',
      key: 'currentQuantity',
      width: 110,
      render: (quantity, record) => (
        <span className="quantity-text">
          {quantity} {record.unit}
        </span>
      ),
    },
    {
      title: '新报价',
      dataIndex: 'newPrice',
      key: 'newPrice',
      width: 140,
      render: (value, record) => (
        <InputNumber
          value={value}
          onChange={(val) => handlePriceChange(record.id, val)}
          min={0.01}
          step={0.1}
          precision={2}
          placeholder="请输入"
          addonAfter={`元/${record.unit}`}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '新报量',
      dataIndex: 'newQuantity',
      key: 'newQuantity',
      width: 140,
      render: (value, record) => (
        <InputNumber
          value={value}
          onChange={(val) => handleQuantityChange(record.id, val)}
          min={1}
          step={1}
          precision={0}
          placeholder="请输入"
          addonAfter={record.unit}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleSubmit(record)}
          loading={submittingIds.has(record.id)}
          disabled={!record.newPrice || !record.newQuantity}
        >
          提交竞价
        </Button>
      ),
    },
  ]

  return (
    <div className="merchant-bidding">
      <div className="bidding-header">
        <div className="header-left">
          <h1 className="bidding-title">商家降价</h1>
          <p className="bidding-subtitle">
            待竞价单据 <span className="count-badge">{pendingRecords.length}</span> 条
          </p>
        </div>
      </div>

      <div className="bidding-content">
        {pendingRecords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3 className="empty-title">暂无待竞价单据</h3>
            <p className="empty-desc">当前没有需要竞价的提报单据</p>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={pendingRecords}
            rowKey="id"
            scroll={{ x: 1400 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
            className="bidding-table"
          />
        )}
      </div>
    </div>
  )
}

export default MerchantBidding
