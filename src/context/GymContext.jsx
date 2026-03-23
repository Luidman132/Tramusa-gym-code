import { createContext, useContext, useState } from 'react'

const GymContext = createContext()

export function GymProvider({ children }) {
  const [miembros, setMiembros] = useState([])
  const [historial, setHistorial] = useState([])
  const [planes, setPlanes] = useState([])

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

  function agregarPlan(nuevoPlan) {
    const id = planes.length > 0 ? Math.max(...planes.map(p => p.id)) + 1 : 1
    setPlanes(prev => [...prev, { ...nuevoPlan, id, activo: true }])
  }

  function actualizarPlan(id, cambios) {
    setPlanes(prev => prev.map(p => p.id === id ? { ...p, ...cambios } : p))
  }

  function eliminarPlan(id) {
    setPlanes(prev => prev.filter(p => p.id !== id))
  }

  function toggleActivoPlan(id) {
    setPlanes(prev => prev.map(p => p.id === id ? { ...p, activo: !p.activo } : p))
  }

  return (
    <GymContext.Provider value={{
      miembros,
      historial,
      planes,
      agregarMiembro,
      actualizarMiembro,
      agregarRegistro,
      actualizarRegistro,
      eliminarRegistro,
      agregarPlan,
      actualizarPlan,
      eliminarPlan,
      toggleActivoPlan,
    }}>
      {children}
    </GymContext.Provider>
  )
}

export function useGym() {
  return useContext(GymContext)
}
