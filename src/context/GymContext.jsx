import { createContext, useContext, useState } from 'react'

const GymContext = createContext()

const miembrosIniciales = [
  { id: 1, dni: '70123456', nombre: 'Yomar Crhistian Serrano R.', celular: '987654321', plan: 'Mensual', estado: 'vencido', inicio: '14/01/2026', fin: '14/02/2026', notas: 'Prefiere turno manana. Tiene lesion en rodilla derecha.' },
  { id: 2, dni: '70234567', nombre: 'Jose Alfredo Gallegos Garcia', celular: '987654322', plan: 'Trimestral', estado: 'activo', inicio: '20/02/2026', fin: '20/05/2026', notas: '' },
  { id: 3, dni: '70345678', nombre: 'Jorge Calderon Quispe', celular: '987654323', plan: 'Mensual', estado: 'activo', inicio: '21/03/2026', fin: '21/04/2026', notas: 'Viene con su hermano (id 7).' },
  { id: 4, dni: '70456789', nombre: 'Janet Huaman Cano', celular: '987654324', plan: 'Mensual', estado: 'vencido', inicio: '20/01/2026', fin: '20/02/2026', notas: '' },
  { id: 5, dni: '70567890', nombre: 'Mizael Ferrel Mendoza', celular: '987654325', plan: 'Pase Dia', estado: 'pase_activo', diasRestantes: 2, inicio: '06/03/2026', fin: '08/03/2026', notas: '' },
  { id: 6, dni: '70678901', nombre: 'Stephanie Pamela Huaranca', celular: '987654326', plan: 'Semestral', estado: 'activo', inicio: '30/04/2026', fin: '30/10/2026', notas: 'Entrena para competencia de crossfit.' },
  { id: 7, dni: '71111111', nombre: 'Juan Carlos Perez', celular: '987654327', plan: 'Mensual', estado: 'activo', inicio: '15/03/2026', fin: '15/04/2026', notas: '' },
  { id: 8, dni: '71111112', nombre: 'Juan Carlos Gomez', celular: '987654328', plan: 'Mensual', estado: 'vencido', inicio: '01/02/2026', fin: '01/03/2026', notas: '' },
  { id: 9, dni: '71111113', nombre: 'Juan Manuel Vargas', celular: '987654329', plan: 'Trimestral', estado: 'activo', inicio: '10/03/2026', fin: '10/06/2026', notas: '' },
  { id: 10, dni: '71111114', nombre: 'Juan Diego Flores', celular: '987654330', plan: 'Pase Dia', estado: 'pase_activo', diasRestantes: 1, inicio: '06/03/2026', fin: '07/03/2026', notas: '' },
  { id: 11, dni: '72222221', nombre: 'Roberto Antonio Silva', celular: '987654331', plan: 'Mensual', estado: 'vencido', inicio: '28/01/2026', fin: '28/02/2026', notas: '' },
  { id: 12, dni: '72222222', nombre: 'Roberto Antonio Mendez', celular: '987654332', plan: 'Semestral', estado: 'activo', inicio: '12/02/2026', fin: '12/08/2026', notas: '' },
  { id: 13, dni: '72222223', nombre: 'Roberto Luis Martinez', celular: '987654333', plan: 'Mensual', estado: 'activo', inicio: '05/03/2026', fin: '05/04/2026', notas: '' },
  { id: 14, dni: '72222224', nombre: 'Roberto Carlos Farfan', celular: '987654334', plan: 'Mensual', estado: 'vencido', inicio: '15/12/2025', fin: '15/01/2026', notas: 'Dijo que va a renovar la proxima semana.' },
  { id: 15, dni: '73333331', nombre: 'Maria Fernanda Rojas', celular: '987654335', plan: 'Trimestral', estado: 'activo', inicio: '22/02/2026', fin: '22/05/2026', notas: '' },
  { id: 16, dni: '73333332', nombre: 'Lucero Milagros Apaza', celular: '987654336', plan: 'Pase Dia', estado: 'pase_activo', diasRestantes: 3, inicio: '06/03/2026', fin: '09/03/2026', notas: '' },
  { id: 17, dni: '73333333', nombre: 'Andrea Carolina Ramos', celular: '987654337', plan: 'Mensual', estado: 'activo', inicio: '18/03/2026', fin: '18/04/2026', notas: '' },
  { id: 18, dni: '73333334', nombre: 'Julio Cesar Flores', celular: '987654338', plan: 'Mensual', estado: 'vencido', inicio: '10/01/2026', fin: '10/02/2026', notas: '' },
  { id: 19, dni: '73333335', nombre: 'Diana Carolina Perez', celular: '987654339', plan: 'Semestral', estado: 'activo', inicio: '01/03/2026', fin: '01/09/2026', notas: '' },
  { id: 20, dni: '73333336', nombre: 'Carlos Eduardo Mamani', celular: '987654340', plan: 'Mensual', estado: 'activo', inicio: '25/02/2026', fin: '25/03/2026', notas: '' },
  { id: 21, dni: '73333337', nombre: 'Sofia Alejandra Paucar', celular: '987654341', plan: 'Trimestral', estado: 'vencido', inicio: '05/12/2025', fin: '05/03/2026', notas: '' },
  { id: 22, dni: '73333338', nombre: 'Diego Alonso Mejia', celular: '987654342', plan: 'Mensual', estado: 'activo', inicio: '01/03/2026', fin: '29/03/2026', notas: '' },
]

export function GymProvider({ children }) {
  const [miembros, setMiembros] = useState(miembrosIniciales)
  const [historial, setHistorial] = useState([])

  function agregarMiembro(nuevoMiembro) {
    const id = miembros.length > 0 ? Math.max(...miembros.map(m => m.id)) + 1 : 1
    setMiembros(prev => [...prev, { ...nuevoMiembro, id }])
    return id
  }

  function actualizarMiembro(id, cambios) {
    setMiembros(prev => prev.map(m => m.id === id ? { ...m, ...cambios } : m))
  }

  function agregarRegistro(nuevoRegistro) {
    const registro = {
      ...nuevoRegistro,
      id: Date.now(),
      hora: new Date(),
      turno: new Date().getHours() < 14 ? 'Manana' : 'Tarde',
    }
    setHistorial(prev => [registro, ...prev])
    return registro
  }

  function actualizarRegistro(id, cambios) {
    setHistorial(prev => prev.map(h => h.id === id ? { ...h, ...cambios } : h))
  }

  function eliminarRegistro(id) {
    setHistorial(prev => prev.filter(h => h.id !== id))
  }

  return (
    <GymContext.Provider value={{
      miembros,
      historial,
      agregarMiembro,
      actualizarMiembro,
      agregarRegistro,
      actualizarRegistro,
      eliminarRegistro,
    }}>
      {children}
    </GymContext.Provider>
  )
}

export function useGym() {
  return useContext(GymContext)
}
