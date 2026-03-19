import { useState } from 'react'
import { Table, InputNumber, Button, message, Tag, Input, Card, Row, Col, Statistic, Rate } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useDecision } from '@/contexts'
import { DecisionRecord, DecisionStatus } from '@/types'
import { formatDate } from '@/utils/date'
import { DecisionDetailModal } from '@/components/decision'
import './index.css'

const { TextArea } = Input

const DecisionConsole = () => {
  const { 
    records, 
    updateDecisionQuantity, 
    updateDecisionNotes,
    updateSupplierRating,
    issueDecision, 
    getRecordsByStatus,
    getStatistics 
  } = useDecision()
  
  const [issuingIds, setIssuingIds] = useState<Set<string>>(new Set())
  const [statusFilter, setStatusFilter] = useState<DecisionStatus | 'all'>('all')
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<DecisionRecord | null>(null)

  const statistics = getStatistics()
  const filteredRecords = statusFilter === 'all' 
    ? records 
    : getRecordsByStatus(statusFilter)

  // 计算寻源单号的合并信息
  const getMergeInfo = () => {
    const mergeMap = new Map<string, number>()
    const sortedRecords = [...filteredRecords].sort((a, b) => 
      a.sourcingOrderNo.localeCompare(b.sourcingOrderNo)
    )
    
    sortedRecords.forEach((record) => {
      const count = mergeMap.get(record.sourcingOrderNo) || 0
      mergeMap.set(record.sourcingOrderNo, count + 1)
    })
    
    return { mergeMap, sortedRecords }
  }

  const { mergeMap, sortedRecords } = getMergeInfo()

  const handleQuantityChange = (id: string, value: number | null) => {
    if (value !== null && value > 0) {
      updateDecisionQuantity(id, value)
    }
  }

  const handleNotesChange = (id: string, value: string) => {
    updateDecisionNotes(id, value)
  }

  const handleRatingChange = (id: string, value: number) => {
    updateSupplierRating(id, value)
  }

  const handleViewDetail = (record: DecisionRecord) => {
    setSelectedRecord(record)
    setDetailVisible(true)
  }

  const getStatusTag = (status: DecisionStatus) => {
    const statusConfig = {
      [DecisionStatus.PENDING]: { color: 'orange', text: '待下发' },
      [DecisionStatus.ISSUED]: { color: 'blue', text: '已下发' },
      [DecisionStatus.CONFIRMED]: { color: 'green', text: '已确认' },
      [DecisionStatus.CANCELLED]: { color: 'red', text: '已取消' },
    }
    const config = statusConfig[status]
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const handleIssue = async (record: DecisionRecord) => {
    if (!record.quantity || record.quantity <= 0) {
      message.error('请填写有效的报量')
      return
    }

    setIssuingIds((prev) => new Set(prev).add(record.id))

    try {
      await issueDecision(record.id)
      message.success({
        content: `决策单 ${record.decisionNo} 下发成功！`,
        duration: 3,
      })
    } catch (error) {
      message.error((error as Error).message || '下发失败，请重试')
    } finally {
      setIssuingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(record.id)
        return newSet
      })
    }
  }

  const columns: ColumnsType<DecisionRecord> = [
    {
      title: '寻源单号',
      dataIndex: 'sourcingOrderNo',
      key: 'sourcingOrderNo',
      width: 140,
      fixed: 'left',
      render: (text, record, index) => {
        // 计算当前记录在排序后数组中的位置
        const currentIndex = sortedRecords.findIndex(r => r.id === record.id)
        
        // 检查是否是该寻源单号的第一条记录
        if (currentIndex === 0 || sortedRecords[currentIndex - 1].sourcingOrderNo !== text) {
          const rowSpan = mergeMap.get(text) || 1
          return {
            children: <span className="order-no">{text}</span>,
            props: {
              rowSpan,
            },
          }
        }
        
        // 非第一条记录，不显示
        return {
          props: {
            rowSpan: 0,
          },
        }
      },
    },
    {
      title: '决策单号',
      dataIndex: 'decisionNo',
      key: 'decisionNo',
      width: 140,
      render: (text) => <span className="order-no">{text}</span>,
    },
    {
      title: '提报单号',
      dataIndex: 'reportOrderNo',
      key: 'reportOrderNo',
      width: 150,
      render: (text) => <span className="order-no">{text}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status),
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 120,
    },
    {
      title: '供应商评分',
      dataIndex: 'supplierRating',
      key: 'supplierRating',
      width: 150,
      render: (value, record) => (
        <Rate
          value={value || 0}
          onChange={(val) => handleRatingChange(record.id, val)}
          disabled={record.status !== DecisionStatus.PENDING}
          allowHalf
        />
      ),
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
      title: '报价',
      dataIndex: 'price',
      key: 'price',
      width: 110,
      render: (price, record) => (
        <span className="price-text">
          ¥{price.toFixed(2)}/{record.unit}
        </span>
      ),
    },
    {
      title: '报量',
      dataIndex: 'quantity',
      key: 'quantity',
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
          disabled={record.status !== DecisionStatus.PENDING}
        />
      ),
    },
    {
      title: '备注信息',
      dataIndex: 'notes',
      key: 'notes',
      width: 200,
      render: (value, record) => (
        <TextArea
          value={value}
          onChange={(e) => handleNotesChange(record.id, e.target.value)}
          placeholder="请输入备注"
          autoSize={{ minRows: 1, maxRows: 3 }}
          disabled={record.status !== DecisionStatus.PENDING}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            size="small"
          >
            详情
          </Button>
          {record.status === DecisionStatus.PENDING && (
            <Button
              type="primary"
              onClick={() => handleIssue(record)}
              loading={issuingIds.has(record.id)}
              disabled={!record.quantity || record.quantity <= 0}
              size="small"
            >
              下发
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="decision-console">
      <div className="decision-header">
        <div className="header-left">
          <h1 className="decision-title">决策单控制台</h1>
          <p className="decision-subtitle">决策单管理与统计</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} className="statistics-row">
        <Col span={4}>
          <Card>
            <Statistic
              title="总决策单数"
              value={statistics.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="待下发"
              value={statistics.pending}
              valueStyle={{ color: '#faad14' }}
              suffix={`/ ${statistics.total}`}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="已下发"
              value={statistics.issued}
              valueStyle={{ color: '#1890ff' }}
              suffix={`/ ${statistics.total}`}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="已确认"
              value={statistics.confirmed}
              valueStyle={{ color: '#52c41a' }}
              suffix={`/ ${statistics.total}`}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="已取消"
              value={statistics.cancelled}
              valueStyle={{ color: '#ff4d4f' }}
              suffix={`/ ${statistics.total}`}
            />
          </Card>
        </Col>
      </Row>

      {/* 状态筛选 */}
      <div className="status-filters">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            全部 ({statistics.total})
          </button>
          <button
            className={`filter-tab ${statusFilter === DecisionStatus.PENDING ? 'active' : ''}`}
            onClick={() => setStatusFilter(DecisionStatus.PENDING)}
          >
            待下发 ({statistics.pending})
          </button>
          <button
            className={`filter-tab ${statusFilter === DecisionStatus.ISSUED ? 'active' : ''}`}
            onClick={() => setStatusFilter(DecisionStatus.ISSUED)}
          >
            已下发 ({statistics.issued})
          </button>
          <button
            className={`filter-tab ${statusFilter === DecisionStatus.CONFIRMED ? 'active' : ''}`}
            onClick={() => setStatusFilter(DecisionStatus.CONFIRMED)}
          >
            已确认 ({statistics.confirmed})
          </button>
          <button
            className={`filter-tab ${statusFilter === DecisionStatus.CANCELLED ? 'active' : ''}`}
            onClick={() => setStatusFilter(DecisionStatus.CANCELLED)}
          >
            已取消 ({statistics.cancelled})
          </button>
        </div>
      </div>

      <div className="decision-content">
        {filteredRecords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3 className="empty-title">暂无决策单</h3>
            <p className="empty-desc">当前筛选条件下没有决策单</p>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={sortedRecords}
            rowKey="id"
            scroll={{ x: 1950 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
            className="decision-table"
          />
        )}
      </div>

      {/* 详情弹窗 */}
      <DecisionDetailModal
        visible={detailVisible}
        record={selectedRecord}
        onClose={() => {
          setDetailVisible(false)
          setSelectedRecord(null)
        }}
      />
    </div>
  )
}

export default DecisionConsole
