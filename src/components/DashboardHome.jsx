import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Users, CalendarCheck, AlertTriangle, DollarSign, UserPlus, ClipboardCheck, CreditCard, Search, ArrowRight, Clock } from 'lucide-react'
import { useGym } from '../context/GymContext'
import { formatHora } from '../utils/helpers'

function parseFechaDDMMYYYY(fechaStr) {
  const [d, m, y] = fechaStr.split('/')
  return new Date(parseInt(y), parseInt(m) - 1, parseInt(d))
}

function diasHastaVencimiento(fechaFinStr) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const fechaFin = parseFechaDDMMYYYY(fechaFinStr)
  fechaFin.setHours(0, 0, 0, 0)
  return Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24))
}

const quickActions = [
  { label: 'Nueva Inscripcion', icon: UserPlus, accent: 'text-red-600 dark:text-red-400', iconBg: 'bg-red-50 dark:bg-red-500/10', path: '/nueva-inscripcion' },
  { label: 'Registrar Asistencia', icon: ClipboardCheck, accent: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-50 dark:bg-emerald-500/10', path: '/asistencias' },
  { label: 'Suscripciones', icon: CreditCard, accent: 'text-blue-600 dark:text-blue-400', iconBg: 'bg-blue-50 dark:bg-blue-500/10', path: '/suscripciones' },
]

export default function DashboardHome({ userName = 'Dima' }) {
  const { miembros, historial } = useGym()
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')
  const [resultados, setResultados] = useState([])

  // Estadisticas
  const activos = miembros.filter(m => m.estado === 'activo').length
  const pasesActivos = miembros.filter(m => m.estado === 'pase_activo').length
  const vencidos = miembros.filter(m => m.estado === 'vencido').length

  const hoy = new Date()
  const asistenciasHoy = historial.filter(h => {
    const fecha = new Date(h.hora)
    return fecha.toDateString() === hoy.toDateString() && (h.tipo === 'asistencia' || h.tipo === 'cobro_asistencia')
  }).length

  const ingresosHoy = historial
    .filter(h => {
      const fecha = new Date(h.hora)
      return fecha.toDateString() === hoy.toDateString() && (h.tipo === 'cobro' || h.tipo === 'cobro_asistencia')
    })
    .reduce((total, h) => {
      const match = h.detalle.match(/S\/\s*([0-9.]+)/)
      return total + (match ? parseFloat(match[1]) : 0)
    }, 0)

  // Miembros que vencen en los proximos 7 dias (solo activos)
  const proximosAVencer = miembros
    .filter(m => m.estado === 'activo' && m.fin)
    .map(m => ({ ...m, diasRestantesVenc: diasHastaVencimiento(m.fin) }))
    .filter(m => m.diasRestantesVenc >= 0 && m.diasRestantesVenc <= 7)
    .sort((a, b) => a.diasRestantesVenc - b.diasRestantesVenc)
    .slice(0, 6)

  // Actividad reciente (ultimos 5)
  const actividadReciente = historial.slice(0, 5)

  // Busqueda rapida
  function handleSearch(e) {
    const texto = e.target.value
    setBusqueda(texto)
    const normalizar = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    const query = normalizar(texto).trim()
    if (query.length > 2) {
      const terminos = query.split(/\s+/)
      setResultados(
        miembros.filter(c => {
          const nombreNorm = normalizar(c.nombre)
          const dniNorm = c.dni
          return terminos.every(t => nombreNorm.includes(t) || dniNorm.includes(t))
        }).slice(0, 5)
      )
    } else {
      setResultados([])
    }
  }

  function seleccionarMiembro(miembro) {
    setBusqueda('')
    setResultados([])
    navigate(`/miembro/${miembro.id}`)
  }

  const estadoBadge = {
    activo: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30',
    pase_activo: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30',
    vencido: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-500/30',
  }
  const estadoTexto = {
    activo: 'Activo',
    pase_activo: 'Pase',
    vencido: 'Vencido',
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Saludo + Busqueda */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Hola, {userName}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Resumen de hoy</p>
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input
            type="text"
            value={busqueda}
            onChange={handleSearch}
            placeholder="Buscar miembro por nombre o DNI..."
            className="w-full py-3 pl-11 pr-4 text-sm bg-white dark:bg-slate-900 shadow-sm rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-100 dark:focus:ring-red-500/20 focus:border-red-400 dark:focus:border-red-500/50 transition-all"
          />
          {resultados.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 max-h-64 overflow-y-auto z-50">
              {resultados.map(m => (
                <div
                  key={m.id}
                  onClick={() => seleccionarMiembro(m)}
                  className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer border-b border-slate-50 dark:border-slate-800/50 last:border-0 flex items-center justify-between transition-colors"
                >
                  <div>
                    <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">{m.nombre}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">DNI: {m.dni}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${estadoBadge[m.estado]}`}>
                    {estadoTexto[m.estado]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tarjetas de estadisticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
              <Users size={20} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">Miembros Activos</span>
          </div>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{activos + pasesActivos}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{activos} planes + {pasesActivos} pases</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
              <CalendarCheck size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">Asistencias Hoy</span>
          </div>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{asistenciasHoy}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">entradas registradas</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-500/10 rounded-xl">
              <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">Vencidos</span>
          </div>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{vencidos}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">necesitan renovar</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-violet-50 dark:bg-violet-500/10 rounded-xl">
              <DollarSign size={20} className="text-violet-600 dark:text-violet-400" />
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">Ingresos Hoy</span>
          </div>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">S/ {ingresosHoy.toFixed(2)}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">cobros del dia</p>
        </div>
      </div>

      {/* Accesos rapidos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            to={action.path}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm dark:shadow-none hover:shadow-md dark:hover:bg-slate-800/50 hover:-translate-y-0.5 transition-all no-underline"
          >
            <div className={`${action.iconBg} ${action.accent} p-3 rounded-xl shrink-0`}>
              <action.icon size={22} />
            </div>
            <span className={`text-base font-bold ${action.accent}`}>{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Dos columnas: Proximos a vencer + Actividad reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Proximos a vencer */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Vencen esta semana</h3>
            <Link to="/suscripciones" className="text-xs text-red-500 hover:text-red-700 font-medium no-underline flex items-center gap-1">
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>

          {proximosAVencer.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-500">
              <CalendarCheck size={28} className="mb-2" />
              <p className="text-sm">Ningun miembro vence esta semana</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {proximosAVencer.map(m => (
                <li key={m.id} onClick={() => navigate(`/miembro/${m.id}`)} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{m.nombre}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{m.plan} - Vence: {m.fin}</p>
                  </div>
                  <span className={`shrink-0 ml-3 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                    m.diasRestantesVenc <= 2
                      ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                  }`}>
                    {m.diasRestantesVenc === 0 ? 'Hoy' : m.diasRestantesVenc === 1 ? 'Manana' : `${m.diasRestantesVenc} dias`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actividad reciente */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Actividad reciente</h3>
            <Link to="/asistencias" className="text-xs text-red-500 hover:text-red-700 font-medium no-underline flex items-center gap-1">
              Ver historial <ArrowRight size={12} />
            </Link>
          </div>

          {actividadReciente.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-500">
              <Clock size={28} className="mb-2" />
              <p className="text-sm">Sin actividad registrada hoy</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {actividadReciente.map(item => (
                <li key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-mono font-semibold text-slate-400 dark:text-slate-500 w-12 shrink-0">{formatHora(item.hora)}</span>
                  <div className="flex-1 min-w-0">
                    {item.tipo === 'asistencia' && <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 mb-0.5">ENTRADA</span>}
                    {item.tipo === 'cobro' && <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 mb-0.5">COBRO</span>}
                    {item.tipo === 'cobro_asistencia' && <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 mb-0.5">COBRO+ENTRADA</span>}
                    <p className="text-sm text-slate-700 dark:text-slate-200 font-medium truncate">{item.titulo}</p>
                  </div>
                  <span className="bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0">{item.turno}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
