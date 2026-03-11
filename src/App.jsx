import { useState } from 'react'
import DashboardLayout from './components/DashboardLayout'
import DashboardHome from './components/DashboardHome'
import SuscripcionesView from './components/SuscripcionesView'
import NuevaInscripcionView from './components/NuevaInscripcionView'
import RegistrarAsistenciaView from './components/RegistrarAsistenciaView'

function App() {
  const [vistaActual, setVistaActual] = useState('inicio')

  function renderizarVista() {
    switch (vistaActual) {
      case 'inicio':
        return <DashboardHome userName="Dima" setVistaActual={setVistaActual} />
      case 'suscripciones':
        return <SuscripcionesView />
      case 'nueva_inscripcion':
        return <NuevaInscripcionView setVistaActual={setVistaActual} />
      case 'miembros':
        return <div className="p-8 text-slate-500">Pantalla de Miembros en construcción...</div>
      case 'asistencias':
        return <RegistrarAsistenciaView setVistaActual={setVistaActual} />
      case 'finanzas':
        return <div className="p-8 text-slate-500">Pantalla de Finanzas en construcción...</div>
      case 'planes':
        return <div className="p-8 text-slate-500">Pantalla de Planes en construcción...</div>
      case 'configuracion':
        return <div className="p-8 text-slate-500">Pantalla de Configuración en construcción...</div>
      default:
        return <DashboardHome userName="Dima" setVistaActual={setVistaActual} />
    }
  }

  return (
    <DashboardLayout vistaActual={vistaActual} setVistaActual={setVistaActual}>
      {renderizarVista()}
    </DashboardLayout>
  )
}

export default App
