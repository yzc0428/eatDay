import * as XLSX from 'xlsx'
import { Plan, PlanType, PlanStatus, PurchasePlan, TransferPlan } from '@/types'
import { formatDate } from './date'

const getStatusText = (status: PlanStatus): string => {
  const statusMap = {
    [PlanStatus.PENDING]: '待处理',
    [PlanStatus.IN_PROGRESS]: '进行中',
    [PlanStatus.COMPLETED]: '已完成',
    [PlanStatus.CANCELLED]: '已取消',
  }
  return statusMap[status]
}

const getScenarioText = (scenarioType?: string): string => {
  if (!scenarioType) return '无'
  const scenarioMap: Record<string, string> = {
    evening_peak: '晚高峰',
    rainstorm: '暴雨',
    holiday: '节假日',
    promotion: '促销活动',
  }
  return scenarioMap[scenarioType] || scenarioType
}

export const exportPlansToExcel = (plans: Plan[], filename: string = '计划列表') => {
  // 创建工作簿
  const wb = XLSX.utils.book_new()

  // 准备数据
  const data = plans.map((plan) => {
    const baseInfo = {
      计划ID: plan.id,
      计划类型: plan.type === PlanType.PURCHASE ? '采购计划' : '调拨计划',
      关联场景: getScenarioText(plan.scenario),
      计划状态: getStatusText(plan.status),
      创建时间: formatDate(plan.createdAt),
      更新时间: formatDate(plan.updatedAt),
      备注: plan.notes || '',
    }

    if (plan.type === PlanType.PURCHASE) {
      const purchasePlan = plan as PurchasePlan
      const reason = (purchasePlan as any).reason
      return {
        ...baseInfo,
        项目数量: purchasePlan.items.length,
        触发原因: reason ? reason.description : '-',
      }
    } else {
      const transferPlan = plan as TransferPlan
      return {
        ...baseInfo,
        项目数量: transferPlan.items.length,
        触发原因: '-',
      }
    }
  })

  // 创建工作表
  const ws = XLSX.utils.json_to_sheet(data)

  // 设置列宽
  const colWidths = [
    { wch: 25 }, // 计划ID
    { wch: 12 }, // 计划类型
    { wch: 12 }, // 关联场景
    { wch: 10 }, // 计划状态
    { wch: 20 }, // 创建时间
    { wch: 20 }, // 更新时间
    { wch: 30 }, // 备注
    { wch: 10 }, // 项目数量
    { wch: 35 }, // 触发原因
  ]
  ws['!cols'] = colWidths

  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(wb, ws, '计划列表')

  // 为每个计划创建详细的项目明细表
  plans.forEach((plan, index) => {
    if (plan.type === PlanType.PURCHASE) {
      const purchasePlan = plan as PurchasePlan
      const itemsData = purchasePlan.items.map((item) => ({
        物品名称: item.itemName,
        计划量: item.quantity,
        单位: item.unit,
        目标仓库: item.warehouse || '-',
      }))

      const itemsWs = XLSX.utils.json_to_sheet(itemsData)
      itemsWs['!cols'] = [{ wch: 20 }, { wch: 10 }, { wch: 8 }, { wch: 20 }]
      XLSX.utils.book_append_sheet(wb, itemsWs, `采购明细${index + 1}`)
    } else {
      const transferPlan = plan as TransferPlan
      const itemsData = transferPlan.items.map((item) => ({
        物品名称: item.itemName,
        数量: item.quantity,
        单位: item.unit,
        起始位置: item.fromLocation,
        目标位置: item.toLocation,
      }))

      const itemsWs = XLSX.utils.json_to_sheet(itemsData)
      itemsWs['!cols'] = [{ wch: 20 }, { wch: 10 }, { wch: 8 }, { wch: 20 }, { wch: 20 }]
      XLSX.utils.book_append_sheet(wb, itemsWs, `调拨明细${index + 1}`)
    }
  })

  // 生成文件并下载
  const timestamp = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`)
}
