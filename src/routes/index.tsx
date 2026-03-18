import { Routes, Route, Navigate } from 'react-router-dom'
import PlanningConsolePage from '@/pages/PlanningConsole'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PlanningConsolePage />} />
      <Route path="/planning" element={<PlanningConsolePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
