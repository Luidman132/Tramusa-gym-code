import { useState } from 'react'
import { ChevronLeft, ChevronRight, AlertTriangle, CalendarCheck, DollarSign, X } from 'lucide-react'
import { useGym } from '../context/GymContext'
import { formatHora } from '../utils/helpers'

const DIAS_SEMANA = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function parseFecha(fechaStr) {
  const [d, m, y] = fechaStr.split('/')
  return new Date(parseInt(y), parseInt(m) - 1, parseInt(d))
}

function mismaFecha(a, b) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
}

function getDiasDelMes(year, month) {
  const primerDia = new Date(year, month, 1)
  const ultimoDia = new Date(year, month + 1, 0)

  // Lunes = 0, Domingo = 6
  let diaInicio = primerDia.getDay() - 1
  if (diaInicio < 0) diaInicio = 6

  const dias = []

  // Dias del mes anterior para llenar la primera semana
  for (let i = diaInicio - 1; i >= 0; i--) {
    const fecha = new Date(year, month, -i)
    dias.push({ fecha, esMesActual: false })
  }

  // Dias del mes actual
  for (let d = 1; d <= ultimoDia.getDate(); d++) {
    dias.push({ fecha: new Date(year, month, d), esMesActual: true })
  }

  // Dias del mes siguiente para completar la grilla
  const restante = 42 - dias.length
  for (let i = 1; i <= restante; i++) {
    dias.push({ fecha: new Date(year, month + 1, i), esMesActual: false })
  }

  return dias
}

export default function CalendarioView() {
  const { miembros, historial } = useGym()
  const hoy = new Date()
  const [mesActual, setMesActual] = useState(hoy.getMonth())
  const [anioActual, setAnioActual] = useState(hoy.getFullYear())
  const [diaSeleccionado, setDiaSeleccionado] = useState(null)

  const dias = getDiasDelMes(anioActual, mesActual)

  function mesAnterior() {
    if (mesActual === 0) {
      setMesActual(11)
      setAnioActual(anioActual - 1)
    } else {
      setMesActual(mesActual - 1)
    }
    setDiaSeleccionado(null)
  }

  function mesSiguiente() {
    if (mesActual === 11) {
      setMesActual(0)
      setAnioActual(anioActual + 1)
    } else {
      setMesActual(mesActual + 1)
    }
    setDiaSeleccionado(null)
  }

  function irAHoy() {
    setMesActual(hoy.getMonth())
    setAnioActual(hoy.getFullYear())
    setDiaSeleccionado(hoy)
  }

  // Precalcular datos por dia para el mes visible
  function getVencimientosDelDia(fecha) {
    return miembros.filter(m => {
      if (!m.fin || m.estado === 'vencido') return false
      const fechaFin = parseFecha(m.fin)
      return mismaFecha(fechaFin, fecha)
    })
  }

  function getActividadDelDia(fecha) {
    return historial.filter(h => {
      const fechaH = new Date(h.hora)
      return mismaFecha(fechaH, fecha)
    })
  }

  // Datos del dia seleccionado
  const vencimientosSel = diaSeleccionado ? getVencimientosDelDia(diaSeleccionado) : []
  const actividadSel = diaSeleccionado ? getActividadDelDia(diaSeleccionado) : []
  const asistenciasSel = actividadSel.filter(h => h.tipo === 'asistencia' || h.tipo === 'cobro_asistencia')
  const cobrosSel = actividadSel.filter(h => h.tipo === 'cobro' || h.tipo === 'cobro_asistencia')
  const ingresosSel = cobrosSel.reduce((total, h) => {
    const match = h.detalle.match(/S\/\s*([0-9.]+)/)
    return total + (match ? parseFloat(match[1]) : 0)
  }, 0)

  // Resumen del mes
  const vencimientosMes = miembros.filter(m => {
    if (!m.fin || m.estado === 'vencido') return false
    const f = parseFecha(m.fin)
    return f.getMonth() === mesActual && f.getFullYear() === anioActual
  }).length

  const actividadMes = historial.filter(h => {
    const f = new Date(h.hora)
    return f.getMonth() === mesActual && f.getFullYear() === anioActual
  })

  const asistenciasMes = actividadMes.filter(h => h.tipo === 'asistencia' || h.tipo === 'cobro_asistencia').length
  const ingresosMes = actividadMes
    .filter(h => h.tipo === 'cobro' || h.tipo === 'cobro_asistencia')
    .reduce((total, h) => {
      const match = h.detalle.match(/S\/\s*([0-9.]+)/)
      return total + (match ? parseFloat(match[1]) : 0)
    }, 0)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Calendario</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario */}
        <div className="lg:col-span-2">
          {/* Resumen del mes */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex items-center gap-3">
              <AlertTriangle size={16} className="text-amber-500" />
              <div>
                <p className="text-lg font-bold text-slate-800">{vencimientosMes}</p>
                <p className="text-[11px] text-slate-400">vencen este mes</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex items-center gap-3">
              <CalendarCheck size={16} className="text-emerald-500" />
              <div>
                <p className="text-lg font-bold text-slate-800">{asistenciasMes}</p>
                <p className="text-[11px] text-slate-400">asistencias del mes</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex items-center gap-3">
              <DollarSign size={16} className="text-violet-500" />
              <div>
                <p className="text-lg font-bold text-slate-800">S/ {ingresosMes.toFixed(0)}</p>
                <p className="text-[11px] text-slate-400">ingresos del mes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Header navegacion */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <button onClick={mesAnterior} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-slate-800">
                  {MESES[mesActual]} {anioActual}
                </h3>
                <button onClick={irAHoy} className="text-xs text-red-500 hover:text-red-700 font-medium px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors">
                  Hoy
                </button>
              </div>
              <button onClick={mesSiguiente} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Dias de la semana */}
            <div className="grid grid-cols-7 border-b border-slate-100">
              {DIAS_SEMANA.map(d => (
                <div key={d} className="text-center py-2.5 text-xs font-semibold text-slate-400">
                  {d}
                </div>
              ))}
            </div>

            {/* Grilla de dias */}
            <div className="grid grid-cols-7">
              {dias.map((dia, i) => {
                const esHoy = mismaFecha(dia.fecha, hoy)
                const esSeleccionado = diaSeleccionado && mismaFecha(dia.fecha, diaSeleccionado)
                const vencimientos = getVencimientosDelDia(dia.fecha)
                const actividad = getActividadDelDia(dia.fecha)
                const tieneVencimientos = vencimientos.length > 0
                const tieneActividad = actividad.length > 0

                return (
                  <button
                    key={i}
                    onClick={() => setDiaSeleccionado(dia.fecha)}
                    className={`relative py-3 px-1 border-b border-r border-slate-50 text-center transition-all hover:bg-slate-50 ${
                      !dia.esMesActual ? 'text-slate-300' : 'text-slate-700'
                    } ${esSeleccionado ? 'bg-red-50 ring-1 ring-red-200' : ''}`}
                  >
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      esHoy ? 'bg-red-600 text-white' : ''
                    }`}>
                      {dia.fecha.getDate()}
                    </span>

                    {dia.esMesActual && (tieneVencimientos || tieneActividad) && (
                      <div className="flex justify-center gap-1 mt-1">
                        {tieneVencimientos && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        )}
                        {tieneActividad && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        )}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Leyenda */}
            <div className="flex items-center justify-center gap-6 py-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-[11px] text-slate-400">Vencimientos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[11px] text-slate-400">Actividad</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">{hoy.getDate()}</span>
                </span>
                <span className="text-[11px] text-slate-400">Hoy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel lateral - detalle del dia */}
        <div className="col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-6">
            {!diaSeleccionado ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <CalendarCheck size={32} className="mb-3" />
                <p className="text-sm font-medium">Selecciona un dia</p>
                <p className="text-xs mt-1">para ver sus detalles</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      {diaSeleccionado.getDate()} de {MESES[diaSeleccionado.getMonth()]}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {mismaFecha(diaSeleccionado, hoy) ? 'Hoy' : DIAS_SEMANA[(diaSeleccionado.getDay() + 6) % 7]}
                    </p>
                  </div>
                  <button onClick={() => setDiaSeleccionado(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                    <X size={16} />
                  </button>
                </div>

                {/* Resumen rapido del dia */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  <div className="bg-emerald-50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-emerald-700">{asistenciasSel.length}</p>
                    <p className="text-[10px] text-emerald-600">entradas</p>
                  </div>
                  <div className="bg-violet-50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-violet-700">S/{ingresosSel.toFixed(0)}</p>
                    <p className="text-[10px] text-violet-600">ingresos</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-amber-700">{vencimientosSel.length}</p>
                    <p className="text-[10px] text-amber-600">vencen</p>
                  </div>
                </div>

                {/* Vencimientos del dia */}
                {vencimientosSel.length > 0 && (
                  <div className="mb-5">
                    <h4 className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Vencimientos</h4>
                    <ul className="space-y-2">
                      {vencimientosSel.map(m => (
                        <li key={m.id} className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-700 truncate">{m.nombre}</p>
                            <p className="text-[11px] text-slate-400">{m.plan}</p>
                          </div>
                          <span className="shrink-0 ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-800">
                            {m.fin}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actividad del dia */}
                {actividadSel.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">Actividad</h4>
                    <ul className="space-y-2 max-h-64 overflow-y-auto">
                      {actividadSel.map(item => (
                        <li key={item.id} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-[11px] font-mono text-slate-400 w-10 shrink-0">{formatHora(item.hora)}</span>
                          <div className="flex-1 min-w-0">
                            {item.tipo === 'asistencia' && <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-700 mb-0.5">ENTRADA</span>}
                            {item.tipo === 'cobro' && <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 mb-0.5">COBRO</span>}
                            {item.tipo === 'cobro_asistencia' && <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-700 mb-0.5">COBRO+ENTRADA</span>}
                            <p className="text-xs text-slate-700 font-medium truncate">{item.titulo}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {vencimientosSel.length === 0 && actividadSel.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-6 text-slate-400">
                    <p className="text-sm">Sin actividad este dia</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
