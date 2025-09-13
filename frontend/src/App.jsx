import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ServersPage from './pages/ServersPage'

function Private({ children }) {
  const token = localStorage.getItem('token')
  const loc = useLocation()
  return token ? children : <Navigate to="/login" state={{ from: loc }} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Private><ServersPage /></Private>} />
    </Routes>
  )
}
