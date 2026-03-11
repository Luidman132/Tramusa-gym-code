import { useState } from 'react'
import { Search } from 'lucide-react'

const mockData = [
  {
    miembro: 'Carlos López',
    plan: 'Mensual Full',
    inicio: '01/02/2026',
    fin: '01/03/2026',
    estado: 'activa',
  },
  {
    miembro: 'María González',
    plan: 'Trimestral',
    inicio: '15/12/2025',
    fin: '15/03/2026',
    estado: 'proxima',
  },
  {
    miembro: 'Juan Pérez',
    plan: 'Mensual Básico',
    inicio: '01/01/2026',
    fin: '01/02/2026',
    estado: 'vencida',
  },
]

const filtros = [
  { id: 'todas', label: 'Todas', color: 'bg-slate-100 text-slate-600', active: 'bg-slate-600 text-white' },
  { id: 'activa', label: 'Activas', color: 'bg-emerald-50 text-emerald-600', active: 'bg-emerald-500 text-white' },
  { id: 'proxima', label: 'Próximas a Vencer', color: 'bg-amber-50 text-amber-600', active: 'bg-amber-500 text-white' },
  { id: 'vencida', label: 'Vencidas', color: 'bg-red-50 text-red-600', active: 'bg-red-500 text-white' },
]

const estadoBadge = {
  activa: 'bg-emerald-50 text-emerald-600',
  proxima: 'bg-amber-50 text-amber-600',
  vencida: 'bg-red-50 text-red-600',
}

const estadoLabel = {
  activa: 'Activa',
  proxima: 'Próxima a vencer',
  vencida: 'Vencida',
}

export default function SuscripcionesView() {
  const [filtroActual, setFiltroActual] = useState('todas')
  const [busqueda, setBusqueda] = useState('')

  const datosFiltrados = mockData.filter((item) => {
    const coincideFiltro = filtroActual === 'todas' || item.estado === filtroActual
    const coincideBusqueda = item.miembro.toLowerCase().includes(busqueda.toLowerCase())
    return coincideFiltro && coincideBusqueda
  })

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Gestión de Suscripciones</h2>

      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre de miembro..."
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
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Plan</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Inicio</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Fin</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Estado</th>
              <th className="text-left px-6 py-4 text-slate-500 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.map((item, index) => (
              <tr key={index} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-800 font-medium">{item.miembro}</td>
                <td className="px-6 py-4 text-slate-600">{item.plan}</td>
                <td className="px-6 py-4 text-slate-600">{item.inicio}</td>
                <td className="px-6 py-4 text-slate-600">{item.fin}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoBadge[item.estado]}`}>
                    {estadoLabel[item.estado]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
                    Renovar
                  </button>
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
