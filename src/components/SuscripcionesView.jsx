import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useGym } from '../context/GymContext'

const filtros = [
  { id: 'todas', label: 'Todas', color: 'bg-slate-100 text-slate-600', active: 'bg-slate-600 text-white' },
  { id: 'activo', label: 'Activas', color: 'bg-emerald-50 text-emerald-600', active: 'bg-emerald-500 text-white' },
  { id: 'pase_activo', label: 'Pases Activos', color: 'bg-blue-50 text-blue-600', active: 'bg-blue-500 text-white' },
  { id: 'vencido', label: 'Vencidas', color: 'bg-red-50 text-red-600', active: 'bg-red-500 text-white' },
]

const estadoBadge = {
  activo: 'bg-emerald-50 text-emerald-600',
  pase_activo: 'bg-blue-50 text-blue-600',
  vencido: 'bg-red-50 text-red-600',
}

const estadoLabel = {
  activo: 'Activa',
  pase_activo: 'Pase Activo',
  vencido: 'Vencida',
}

export default function SuscripcionesView() {
  const { miembros } = useGym()
  const navigate = useNavigate()
  const [filtroActual, setFiltroActual] = useState('todas')
  const [busqueda, setBusqueda] = useState('')

  const datosFiltrados = miembros.filter((item) => {
    const coincideFiltro = filtroActual === 'todas' || item.estado === filtroActual
    const query = busqueda.toLowerCase()
    const coincideBusqueda = item.nombre.toLowerCase().includes(query) || item.dni.includes(query)
    return coincideFiltro && coincideBusqueda
  })

  const totalActivos = miembros.filter(m => m.estado === 'activo').length
  const totalPases = miembros.filter(m => m.estado === 'pase_activo').length
  const totalVencidos = miembros.filter(m => m.estado === 'vencido').length

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Gestion de Suscripciones</h2>
        <div className="flex gap-3">
          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg">{totalActivos} Activas</span>
          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg">{totalPases} Pases</span>
          <span className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg">{totalVencidos} Vencidas</span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o DNI..."
          className="w-full bg-white rounded-2xl py-3.5 pl-14 pr-6 text-sm text-slate-700 placeholder:text-slate-400 border border-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filtros.map((f) => (
          <button
            key={f.id}
            onClick={() => setFiltroActual(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filtroActual === f.id ? f.active : f.color
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Miembro</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">DNI</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Plan</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Inicio</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Fin</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.map((item) => (
              <tr key={item.id} onClick={() => navigate(`/miembro/${item.id}`)} className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                <td className="px-6 py-4 text-slate-800 font-medium">{item.nombre}</td>
                <td className="px-6 py-4 text-slate-600">{item.dni}</td>
                <td className="px-6 py-4 text-slate-600">{item.plan}</td>
                <td className="px-6 py-4 text-slate-600">{item.inicio}</td>
                <td className="px-6 py-4 text-slate-600">{item.fin}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoBadge[item.estado]}`}>
                    {estadoLabel[item.estado]}
                  </span>
                </td>
              </tr>
            ))}
            {datosFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  No se encontraron suscripciones.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
