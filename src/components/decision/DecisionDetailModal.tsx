import { Modal, Descriptions, Tag, Rate } from 'antd'
import { DecisionRecord, DecisionStatus } from '@/types'
import { formatDate } from '@/utils/date'

interface DecisionDetailModalProps {
  visible: boolean
  record: DecisionRecord | null
  onClose: () => void
}

const DecisionDetailModal = ({ visible, record, onClose }: DecisionDetailModalProps) => {
  if (!record) return null

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

  return (
    <Modal
      title={`决策单详情 - ${record.decisionNo}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Descriptions column={2} bordered>
        <Descriptions.Item label="决策单号" span={2}>
          <span style={{ fontFamily: 'Monaco, Consolas, monospace', color: '#1890ff', fontWeight: 500 }}>
            {record.decisionNo}
          </span>
        </Descriptions.Item>
        
        <Descriptions.Item label="寻源单号">
          <span style={{ fontFamily: 'Monaco, Consolas, monospace', color: '#1890ff' }}>
            {record.sourcingOrderNo}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="提报单号">
          <span style={{ fontFamily: 'Monaco, Consolas, monospace', color: '#1890ff' }}>
            {record.reportOrderNo}
          </span>
        </Descriptions.Item>

        <Descriptions.Item label="状态" span={2}>
          {getStatusTag(record.status)}
        </Descriptions.Item>

        <Descriptions.Item label="供应商ID">
          <Tag color="blue">{record.supplierId}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="供应商名称">
          {record.supplierName}
        </Descriptions.Item>

        {record.supplierRating && (
          <Descriptions.Item label="供应商评分" span={2}>
            <Rate value={record.supplierRating} disabled allowHalf />
            <span style={{ marginLeft: '8px', color: '#666' }}>
              {record.supplierRating.toFixed(1)} 分
            </span>
          </Descriptions.Item>
        )}

        <Descriptions.Item label="货品ID">
          <Tag color="blue">{record.productId}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="货品名称">
          <strong>{record.productName}</strong>
        </Descriptions.Item>

        <Descriptions.Item label="仓库ID">
          <Tag color="purple">{record.warehouseId}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="仓库名称">
          {record.warehouseName}
        </Descriptions.Item>

        <Descriptions.Item label="报价">
          <span style={{ color: '#ff4d4f', fontWeight: 600, fontSize: '14px' }}>
            ¥{record.price.toFixed(2)}/{record.unit}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="报量">
          <span style={{ color: '#52c41a', fontWeight: 600, fontSize: '14px' }}>
            {record.quantity} {record.unit}
          </span>
        </Descriptions.Item>

        <Descriptions.Item label="创建时间">
          {formatDate(record.createdAt)}
        </Descriptions.Item>
        <Descriptions.Item label="更新时间">
          {formatDate(record.updatedAt)}
        </Descriptions.Item>

        {record.issuedAt && (
          <>
            <Descriptions.Item label="下发时间">
              {formatDate(record.issuedAt)}
            </Descriptions.Item>
            <Descriptions.Item label="下发人">
              {record.issuedBy || '-'}
            </Descriptions.Item>
          </>
        )}

        {record.notes && (
          <Descriptions.Item label="备注信息" span={2}>
            <div style={{ 
              padding: '8px 12px', 
              background: '#fafafa', 
              borderRadius: '4px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {record.notes}
            </div>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  )
}

export default DecisionDetailModal
