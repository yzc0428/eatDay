import { BrowserRouter } from 'react-router-dom'
import { AppProviders } from '@/contexts'
import AppLayout from '@/components/layout/AppLayout'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppLayout />
      </AppProviders>
    </BrowserRouter>
  )
}

export default App
