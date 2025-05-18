
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  )
}

export default App
