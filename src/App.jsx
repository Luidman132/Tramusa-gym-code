import { Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/DashboardLayout'
import DashboardHome from './components/DashboardHome'
import SuscripcionesView from './components/SuscripcionesView'
import NuevaInscripcionView from './components/NuevaInscripcionView'
import RegistrarAsistenciaView from './components/RegistrarAsistenciaView'
import CalendarioView from './components/CalendarioView'
import MiembroPerfilView from './components/MiembroPerfilView'
import ReportesView from './components/ReportesView'

function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardHome userName="Dima" />} />
        <Route path="/suscripciones" element={<SuscripcionesView />} />
        <Route path="/nueva-inscripcion" element={<NuevaInscripcionView />} />
        <Route path="/asistencias" element={<RegistrarAsistenciaView />} />
        <Route path="/calendario" element={<CalendarioView />} />
        <Route path="/miembro/:id" element={<MiembroPerfilView />} />
        <Route path="/reportes" element={<ReportesView />} />
        <Route path="*" element={<DashboardHome userName="Dima" />} />
      </Routes>
    </DashboardLayout>
  )
}

export default App
