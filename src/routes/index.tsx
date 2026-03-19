import { Routes, Route, Navigate } from 'react-router-dom'
import WarehouseConsolePage from '@/pages/WarehouseConsole'
import PlanningConsolePage from '@/pages/PlanningConsole'
import MerchantBiddingPage from '@/pages/MerchantBidding'
import DecisionConsolePage from '@/pages/DecisionConsole'
import DeliveryWorkbenchPage from '@/pages/DeliveryWorkbench'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PlanningConsolePage />} />
      <Route path="/planning" element={<PlanningConsolePage />} />
      <Route path="/bidding" element={<MerchantBiddingPage />} />
      <Route path="/decision" element={<DecisionConsolePage />} />
      <Route path="/delivery" element={<DeliveryWorkbenchPage />} />
      <Route path="/warehouse" element={<WarehouseConsolePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
