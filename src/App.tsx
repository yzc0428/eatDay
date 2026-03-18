import { AppProviders } from '@/contexts'
import PlanningConsole from '@/pages/PlanningConsole'
import './App.css'

function App() {
  return (
    <AppProviders>
      <PlanningConsole />
    </AppProviders>
  )
}

export default App
