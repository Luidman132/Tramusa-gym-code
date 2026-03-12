import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, UserCircle, Phone, CreditCard, CalendarCheck, Clock, FileText, Save, Ticket } from 'lucide-react'
import { useGym } from '../context/GymContext'
import { useToast } from '../context/ToastContext'
import { formatHora } from '../utils/helpers'

const estadoBadge = {
  activo: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  pase_activo: 'bg-blue-100 text-blue-700 border-blue-200',
  vencido: 'bg-red-100 text-red-700 border-red-200',
}

const estadoTexto = {
  activo: 'Activo',
  pase_activo: 'Pase Activo',
  vencido: 'Vencido',
}

export default function MiembroPerfilView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { miembros, historial, actualizarMiembro } = useGym()
  const { mostrarToast } = useToast()

  const miembro = miembros.find(m => m.id === parseInt(id))

  const [notas, setNotas] = useState(miembro?.notas || '')
  const [notasGuardadas, setNotasGuardadas] = useState(miembro?.notas || '')

  if (!miembro) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-96">
        <UserCircle size={48} className="text-slate-300 mb-4" />
        <p className="text-lg text-slate-500 mb-4">Miembro no encontrado</p>
        <Link to="/suscripciones" className="text-red-500 hover:text-red-700 font-medium text-sm no-underline">
          Volver a Suscripciones
        </Link>
      </div>
    )
  }

  // Historial de este miembro (busca por nombre en titulo)
  const historialMiembro = historial.filter(h =>
    h.titulo.includes(miembro.nombre)
  )

  const asistencias = historialMiembro.filter(h => h.tipo === 'asistencia' || h.tipo === 'cobro_asistencia')
  const pagos = historialMiembro.filter(h => h.tipo === 'cobro' || h.tipo === 'cobro_asistencia')

  const totalPagado = pagos.reduce((total, h) => {
    const match = h.detalle.match(/S\/\s*([0-9.]+)/)
    return total + (match ? parseFloat(match[1]) : 0)
  }, 0)

  function guardarNotas() {
    actualizarMiembro(miembro.id, { notas })
    setNotasGuardadas(notas)
    mostrarToast('Notas guardadas correctamente')
  }

  const notasCambiaron = notas !== notasGuardadas

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Volver
        </button>
      </div>

      {/* Tarjeta principal del miembro */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
            <UserCircle size={48} className="text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-800">{miembro.nombre}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${estadoBadge[miembro.estado]}`}>
                {estadoTexto[miembro.estado]}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-4 text-sm">
              <div>
                <span className="text-slate-400">DNI</span>
                <p className="font-semibold text-slate-700">{miembro.dni}</p>
              </div>
              <div>
                <span className="text-slate-400">Celular</span>
                <p className="font-semibold text-slate-700">{miembro.celular || '-'}</p>
              </div>
              <div>
                <span className="text-slate-400">Plan</span>
                <p className="font-semibold text-slate-700 flex items-center gap-1">
                  {miembro.estado === 'pase_activo' && <Ticket size={14} className="text-blue-600" />}
                  {miembro.plan}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Inicio</span>
                <p className="font-semibold text-slate-700">{miembro.inicio}</p>
              </div>
              <div>
                <span className="text-slate-400">Vencimiento</span>
                <p className={`font-semibold ${miembro.estado === 'vencido' ? 'text-red-600' : 'text-slate-700'}`}>{miembro.fin}</p>
              </div>
              {miembro.estado === 'pase_activo' && miembro.diasRestantes !== undefined && (
                <div>
                  <span className="text-slate-400">Dias restantes</span>
                  <p className="font-semibold text-blue-700">{miembro.diasRestantes}</p>
                </div>
              )}
              {miembro.contactoNombre && (
                <div>
                  <span className="text-slate-400">Contacto emergencia</span>
                  <p className="font-semibold text-slate-700">{miembro.contactoNombre} {miembro.contactoTelefono ? `(${miembro.contactoTelefono})` : ''}</p>
                </div>
              )}
            </div>
          </div>

          {/* Estadisticas rapidas */}
          <div className="flex sm:flex-col gap-3 shrink-0">
            <div className="bg-emerald-50 rounded-xl p-3 text-center min-w-[80px]">
              <p className="text-xl font-bold text-emerald-700">{asistencias.length}</p>
              <p className="text-[10px] text-emerald-600 font-medium">asistencias</p>
            </div>
            <div className="bg-violet-50 rounded-xl p-3 text-center min-w-[80px]">
              <p className="text-xl font-bold text-violet-700">S/{totalPagado.toFixed(0)}</p>
              <p className="text-[10px] text-violet-600 font-medium">pagado</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda: Historial de asistencias + pagos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Historial de asistencias */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarCheck size={18} className="text-emerald-600" />
              <h3 className="text-base font-semibold text-slate-800">Historial de Asistencias</h3>
              <span className="text-xs text-slate-400 ml-auto">{asistencias.length} registros</span>
            </div>

            {asistencias.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-slate-400">
                <Clock size={24} className="mb-2" />
                <p className="text-sm">Sin asistencias registradas</p>
              </div>
            ) : (
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {asistencias.map(h => (
                  <li key={h.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-mono font-semibold text-slate-400 w-12 shrink-0">{formatHora(h.hora)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 truncate">{h.detalle}</p>
                    </div>
                    <span className="bg-slate-200 text-slate-500 rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0">{h.turno}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(h.hora).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Historial de pagos */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={18} className="text-violet-600" />
              <h3 className="text-base font-semibold text-slate-800">Historial de Pagos</h3>
              <span className="text-xs text-slate-400 ml-auto">S/ {totalPagado.toFixed(2)} total</span>
            </div>

            {pagos.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-slate-400">
                <CreditCard size={24} className="mb-2" />
                <p className="text-sm">Sin pagos registrados</p>
              </div>
            ) : (
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {pagos.map(h => {
                  const montoMatch = h.detalle.match(/S\/\s*([0-9.]+)/)
                  const monto = montoMatch ? parseFloat(montoMatch[1]) : 0
                  return (
                    <li key={h.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-xs font-mono font-semibold text-slate-400 w-12 shrink-0">{formatHora(h.hora)}</span>
                      <div className="flex-1 min-w-0">
                        {h.tipo === 'cobro' && <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 mb-0.5">COBRO</span>}
                        {h.tipo === 'cobro_asistencia' && <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-700 mb-0.5">COBRO+ENTRADA</span>}
                        <p className="text-sm text-slate-700 truncate">{h.detalle}</p>
                      </div>
                      <span className="font-bold text-sm text-emerald-700 shrink-0">S/ {monto.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(h.hora).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Columna derecha: Notas */}
        <div className="col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={18} className="text-slate-600" />
              <h3 className="text-base font-semibold text-slate-800">Notas</h3>
            </div>

            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Escribe notas sobre este miembro... (lesiones, preferencias, observaciones)"
              rows={6}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all resize-none"
            />

            {notasCambiaron && (
              <button
                onClick={guardarNotas}
                className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-2.5 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Save size={16} />
                Guardar Notas
              </button>
            )}

            {/* Acciones rapidas */}
            <div className="mt-6 space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Acciones rapidas</h4>
              <Link
                to="/asistencias"
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 hover:bg-emerald-100 transition-colors no-underline text-sm font-medium"
              >
                <CalendarCheck size={16} />
                Registrar Asistencia
              </Link>
              <Link
                to="/asistencias"
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 hover:bg-blue-100 transition-colors no-underline text-sm font-medium"
              >
                <Phone size={16} />
                Llamar: {miembro.celular || 'Sin numero'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
