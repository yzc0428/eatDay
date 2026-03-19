import { ReactNode } from 'react'
import { ProductProvider } from './ProductContext'
import { ProductWarehouseRelationProvider } from './ProductWarehouseRelationContext'
import { WarehouseProvider } from './WarehouseContext'
import { PlanningProvider } from './PlanningContext'
import { BiddingProvider } from './BiddingContext'
import { DecisionProvider } from './DecisionContext'
import { DeliveryProvider } from './DeliveryContext'

// 组合所有 Provider
export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ProductProvider>
      <ProductWarehouseRelationProvider>
        <WarehouseProvider>
          <PlanningProvider>
            <BiddingProvider>
              <DecisionProvider>
                <DeliveryProvider>{children}</DeliveryProvider>
              </DecisionProvider>
            </BiddingProvider>
          </PlanningProvider>
        </WarehouseProvider>
      </ProductWarehouseRelationProvider>
    </ProductProvider>
  )
}

// 导出所有 hooks
export { useProducts } from './ProductContext'
export { useProductWarehouseRelation } from './ProductWarehouseRelationContext'
export { useWarehouse, WarehouseProvider } from './WarehouseContext'
export { usePlanning } from './PlanningContext'
export { useBidding } from './BiddingContext'
export { useDecision } from './DecisionContext'
export { useDelivery } from './DeliveryContext'
