import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './components/DashboardLayout'
import DashboardHome from './components/DashboardHome'
import SuscripcionesView from './components/SuscripcionesView'
import NuevaInscripcionView from './components/NuevaInscripcionView'
import RegistrarAsistenciaView from './components/RegistrarAsistenciaView'
import CalendarioView from './components/CalendarioView'
import MiembroPerfilView from './components/MiembroPerfilView'
import ReportesView from './components/ReportesView'
import LoginView from './components/LoginView'

function App() {
  const [user, setUser] = useState(null)

  // Recuperar sesión persistente simple al recargar
  useEffect(() => {
    const savedUser = localStorage.getItem('tramusa_user_temp')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  function handleLogin(userData) {
    setUser(userData)
    localStorage.setItem('tramusa_user_temp', JSON.stringify(userData))
  }

  function handleLogout() {
    setUser(null)
    localStorage.removeItem('tramusa_user_temp')
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginView onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <DashboardLayout userName={user.nombre} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<DashboardHome userName={user.nombre} />} />
        <Route path="/suscripciones" element={<SuscripcionesView />} />
        <Route path="/nueva-inscripcion" element={<NuevaInscripcionView />} />
        <Route path="/asistencias" element={<RegistrarAsistenciaView />} />
        <Route path="/calendario" element={<CalendarioView />} />
        <Route path="/miembro/:id" element={<MiembroPerfilView />} />
        <Route path="/reportes" element={<ReportesView />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<DashboardHome userName={user.nombre} />} />
      </Routes>
    </DashboardLayout>
  )
}

export default App
