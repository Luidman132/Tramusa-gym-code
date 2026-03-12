import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useGym } from '../context/GymContext'

const filtros = [
  { id: 'todas', label: 'Todas', color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400', active: 'bg-slate-600 dark:bg-slate-200 text-white dark:text-slate-900' },
  { id: 'activo', label: 'Activas', color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', active: 'bg-emerald-500 dark:bg-emerald-400 text-white dark:text-emerald-950' },
  { id: 'pase_activo', label: 'Pases Activos', color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400', active: 'bg-blue-500 dark:bg-blue-400 text-white dark:text-blue-950' },
  { id: 'vencido', label: 'Vencidas', color: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400', active: 'bg-red-500 dark:bg-red-400 text-white dark:text-red-950' },
]

const estadoBadge = {
  activo: 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30',
  pase_activo: 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/30',
  vencido: 'bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/30',
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
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Gestion de Suscripciones</h2>
        <div className="flex gap-3">
          <span className="bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg">{totalActivos} Activas</span>
          <span className="bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold px-3 py-1.5 rounded-lg">{totalPases} Pases</span>
          <span className="bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-xs font-bold px-3 py-1.5 rounded-lg">{totalVencidos} Vencidas</span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o DNI..."
          className="w-full bg-white dark:bg-slate-900 rounded-2xl py-3.5 pl-14 pr-6 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 dark:focus:border-red-500/50 transition-all"
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

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="text-left px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">Miembro</th>
              <th className="text-left px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">DNI</th>
              <th className="text-left px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">Plan</th>
              <th className="text-left px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">Inicio</th>
              <th className="text-left px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">Fin</th>
              <th className="text-left px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.map((item) => (
              <tr key={item.id} onClick={() => navigate(`/miembro/${item.id}`)} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">{item.nombre}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.dni}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.plan}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.inicio}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.fin}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoBadge[item.estado]}`}>
                    {estadoLabel[item.estado]}
                  </span>
                </td>
              </tr>
            ))}
            {datosFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
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
