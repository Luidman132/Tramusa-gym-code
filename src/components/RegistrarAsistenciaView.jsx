import { useState } from 'react'
import { Search, UserCircle, UserPlus, ArrowRight, CheckCircle, Pencil, Ticket } from 'lucide-react'
import { formatHora, handleMontoInput, formatMontoBlur, parseMonto } from '../utils/helpers'
import { inputClasses, inputErrorClasses, estilosEstado } from '../utils/constants'
import { useToast } from '../context/ToastContext'
import { useGym } from '../context/GymContext'
import ModalRenovacion from './asistencias/ModalRenovacion'
import ModalPaseTemporal from './asistencias/ModalPaseTemporal'
import ModalEditarCliente from './asistencias/ModalEditarCliente'
import ModalEditarRegistro from './asistencias/ModalEditarRegistro'

export default function RegistrarAsistenciaView() {
  const { mostrarToast } = useToast()
  const { miembros, historial, actualizarMiembro, agregarRegistro, actualizarRegistro, eliminarRegistro } = useGym()

  const [busqueda, setBusqueda] = useState('')
  const [resultadosBusqueda, setResultadosBusqueda] = useState([])
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [filtroTiempo, setFiltroTiempo] = useState('hoy')

  // Visita libre
  const [mostrandoPaseRapido, setMostrandoPaseRapido] = useState(false)
  const [nombresVisita, setNombresVisita] = useState('')
  const [apellidosVisita, setApellidosVisita] = useState('')
  const [dniVisita, setDniVisita] = useState('')
  const [celularVisita, setCelularVisita] = useState('')
  const [correoVisita, setCorreoVisita] = useState('')
  const [montoVisita, setMontoVisita] = useState('')

  const [erroresVisita, setErroresVisita] = useState({})

  // Modales
  const [mostrarModalRenovacion, setMostrarModalRenovacion] = useState(false)
  const [mostrarModalPase, setMostrarModalPase] = useState(false)
  const [mostrarModalEditarCliente, setMostrarModalEditarCliente] = useState(false)
  const [registroAEditar, setRegistroAEditar] = useState(null)

  function limpiarBusqueda() {
    setClienteSeleccionado(null)
    setBusqueda('')
    setResultadosBusqueda([])
  }

  function handleSearch(e) {
    const texto = e.target.value
    setBusqueda(texto)
    const normalizarTexto = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    const query = normalizarTexto(texto).trim()
    if (query.length > 2) {
      const terminosBusqueda = query.split(/\s+/)
      setResultadosBusqueda(
        miembros.filter((c) => {
          const nombreNorm = normalizarTexto(c.nombre)
          const dniNorm = c.dni ? normalizarTexto(c.dni) : ''
          return terminosBusqueda.every(termino => nombreNorm.includes(termino) || dniNorm.includes(termino))
        })
      )
    } else {
      setResultadosBusqueda([])
    }
  }

  function seleccionarCliente(cliente) {
    setClienteSeleccionado(cliente)
    setBusqueda('')
    setResultadosBusqueda([])
  }

  function confirmarAsistencia() {
    if (!clienteSeleccionado) return
    agregarRegistro({
      tipo: 'asistencia',
      titulo: clienteSeleccionado.nombre,
      detalle: `Plan: ${clienteSeleccionado.plan}`,
    })
    mostrarToast(`Asistencia registrada: ${clienteSeleccionado.nombre}`)
    limpiarBusqueda()
  }

  function registrarAsistenciaPase() {
    if (!clienteSeleccionado) return
    const nuevosDias = clienteSeleccionado.diasRestantes - 1
    agregarRegistro({
      tipo: 'asistencia',
      titulo: clienteSeleccionado.nombre,
      detalle: `Pase: Dias restantes ${nuevosDias}`,
    })
    if (nuevosDias <= 0) {
      actualizarMiembro(clienteSeleccionado.id, { estado: 'vencido', diasRestantes: 0 })
      mostrarToast(`Pase agotado: ${clienteSeleccionado.nombre}`, 'info')
    } else {
      actualizarMiembro(clienteSeleccionado.id, { diasRestantes: nuevosDias })
      mostrarToast(`Asistencia registrada: ${clienteSeleccionado.nombre} (${nuevosDias} dia${nuevosDias > 1 ? 's' : ''} restante${nuevosDias > 1 ? 's' : ''})`)
    }
    limpiarBusqueda()
  }

  function resetFormularioVisita() {
    setNombresVisita('')
    setApellidosVisita('')
    setDniVisita('')
    setCelularVisita('')
    setCorreoVisita('')
    setMontoVisita('')
    setErroresVisita({})
    setMostrandoPaseRapido(false)
  }

  function limpiarErrorVisita(campo) {
    setErroresVisita((prev) => { const c = { ...prev }; delete c[campo]; return c })
  }

  function registrarVisitaLibre() {
    const errs = {}
    if (!nombresVisita.trim()) errs.nombres = true
    if (!apellidosVisita.trim()) errs.apellidos = true
    if (!montoVisita || parseMonto(montoVisita) <= 0) errs.monto = true
    setErroresVisita(errs)
    if (Object.keys(errs).length > 0) {
      mostrarToast('Completa nombre, apellido y monto', 'error')
      return
    }
    const monto = parseMonto(montoVisita)
    agregarRegistro({
      tipo: 'cobro_asistencia',
      titulo: `Visita Libre: ${nombresVisita.trim()} ${apellidosVisita.trim()}`,
      detalle: `Pago: S/ ${monto.toFixed(2)}`,
    })
    mostrarToast(`Visita libre registrada: ${nombresVisita.trim()} ${apellidosVisita.trim()}`)
    resetFormularioVisita()
  }

  function confirmarRenovacion(datos) {
    if (!clienteSeleccionado) return
    const monto = parseMonto(datos.monto)
    const [year, month, day] = datos.fechaFin.split('-')
    const fechaFinFormateada = `${day}/${month}/${year}`
    const nombrePlanCorto = datos.planLabel.split(' ')[0]

    actualizarMiembro(clienteSeleccionado.id, {
      estado: 'activo',
      plan: nombrePlanCorto,
      fin: fechaFinFormateada,
      diasRestantes: undefined,
    })
    agregarRegistro({
      tipo: 'cobro',
      titulo: `Renovacion: ${clienteSeleccionado.nombre}`,
      detalle: `Plan: ${datos.planLabel} - Pago: S/ ${monto.toFixed(2)}`,
    })
    mostrarToast(`Suscripcion renovada: ${clienteSeleccionado.nombre} - ${datos.planLabel}`)
    setMostrarModalRenovacion(false)
    limpiarBusqueda()
  }

  function procesarVentaPase(diasPase, montoRaw, registrarIngresoAhora) {
    if (!clienteSeleccionado) return
    const monto = parseMonto(montoRaw)
    const diasRestantesFinal = registrarIngresoAhora ? diasPase - 1 : diasPase
    const nuevoEstado = (registrarIngresoAhora && diasRestantesFinal <= 0) ? 'vencido' : 'pase_activo'

    actualizarMiembro(clienteSeleccionado.id, { estado: nuevoEstado, diasRestantes: diasRestantesFinal })
    setClienteSeleccionado(prev => ({ ...prev, estado: nuevoEstado, diasRestantes: diasRestantesFinal }))

    const txtDias = `${diasPase} dia${diasPase > 1 ? 's' : ''}`
    if (registrarIngresoAhora) {
      agregarRegistro({
        tipo: 'cobro_asistencia',
        titulo: `Pase (${txtDias}): ${clienteSeleccionado.nombre}`,
        detalle: `Pago: S/ ${monto.toFixed(2)} - Restan: ${diasRestantesFinal}`,
      })
    } else {
      agregarRegistro({
        tipo: 'cobro',
        titulo: `Venta Pase (${txtDias}): ${clienteSeleccionado.nombre}`,
        detalle: `Pago: S/ ${monto.toFixed(2)}`,
      })
    }
    mostrarToast(`Pase vendido: ${clienteSeleccionado.nombre} - ${diasPase} dia${diasPase > 1 ? 's' : ''}`)
    setMostrarModalPase(false)
    limpiarBusqueda()
  }

  function guardarEdicionCliente(nombre, dni) {
    actualizarMiembro(clienteSeleccionado.id, { nombre, dni })
    setClienteSeleccionado(prev => ({ ...prev, nombre, dni }))
    mostrarToast('Cliente actualizado correctamente')
    setMostrarModalEditarCliente(false)
  }

  function guardarEdicionHistorial(id, titulo, detalle) {
    actualizarRegistro(id, { titulo, detalle })
    mostrarToast('Registro actualizado')
    setRegistroAEditar(null)
  }

  function eliminarRegistroHistorial(id) {
    eliminarRegistro(id)
    mostrarToast('Registro eliminado', 'info')
    setRegistroAEditar(null)
  }

  const estilo = clienteSeleccionado ? estilosEstado[clienteSeleccionado.estado] : null

  const historialFiltrado = historial.filter(item => {
    const hoy = new Date()
    const fechaItem = new Date(item.hora)
    const fechaHoyLimpiada = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
    const fechaItemLimpiada = new Date(fechaItem.getFullYear(), fechaItem.getMonth(), fechaItem.getDate())
    const diffDias = Math.floor((fechaHoyLimpiada.getTime() - fechaItemLimpiada.getTime()) / (1000 * 60 * 60 * 24))

    if (filtroTiempo === 'hoy') return diffDias === 0
    if (filtroTiempo === 'ayer') return diffDias === 1
    if (filtroTiempo === '1semana') return diffDias >= 2 && diffDias <= 7
    if (filtroTiempo === '2semanas') return diffDias > 7 && diffDias <= 14
    if (filtroTiempo === '1mes') return diffDias > 14 && diffDias <= 30
    return true
  })

  const totalAsistencias = historialFiltrado.filter(h => h.tipo === 'asistencia' || h.tipo === 'cobro_asistencia').length
  const totalCobros = historialFiltrado.filter(h => h.tipo === 'cobro' || h.tipo === 'cobro_asistencia').length

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Registrar Asistencia</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Barra de busqueda */}
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input
              type="text"
              value={busqueda}
              onChange={handleSearch}
              placeholder="Buscar DNI o Nombres..."
              className="w-full py-4 pl-14 pr-6 text-lg bg-white shadow-sm rounded-2xl border border-slate-200 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
            />
            {busqueda.trim().length > 2 && !clienteSeleccionado && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 max-h-64 overflow-y-auto z-50">
                {resultadosBusqueda.length > 0 ? (
                  resultadosBusqueda.map((cliente) => (
                    <div
                      key={cliente.id}
                      onClick={() => seleccionarCliente(cliente)}
                      className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 flex justify-between items-center transition-colors"
                    >
                      <span className="text-slate-700 font-medium">{cliente.nombre}</span>
                      <span className="text-sm text-slate-400">{cliente.dni}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-sm text-slate-400 text-center">No se encontraron clientes.</div>
                )}
              </div>
            )}
          </div>

          {/* Visita libre */}
          {!mostrandoPaseRapido ? (
            <button
              type="button"
              onClick={() => setMostrandoPaseRapido(true)}
              className="w-full flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-red-300 hover:shadow-md transition-all group text-left cursor-pointer mt-4"
            >
              <div className="flex items-center gap-5">
                <div className="p-4 bg-red-50 rounded-xl text-red-600 group-hover:bg-red-100 group-hover:scale-105 transition-all">
                  <UserPlus size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Registrar Visita Libre</h3>
                  <p className="text-sm text-slate-500 mt-1">Ingresa el nombre y el monto para personas no registradas.</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-slate-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all shrink-0" />
            </button>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-semibold text-slate-700">Registrar Visita Libre</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <input type="text" value={nombresVisita} onChange={(e) => { setNombresVisita(e.target.value); limpiarErrorVisita('nombres') }} placeholder="Nombre(s) *" className={erroresVisita.nombres ? inputErrorClasses : inputClasses} />
                <input type="text" value={apellidosVisita} onChange={(e) => { setApellidosVisita(e.target.value); limpiarErrorVisita('apellidos') }} placeholder="Apellido(s) *" className={erroresVisita.apellidos ? inputErrorClasses : inputClasses} />
                <input type="text" value={dniVisita} onChange={(e) => setDniVisita(e.target.value.replace(/\D/g, ''))} maxLength={8} placeholder="DNI" className={inputClasses} />
                <input type="tel" value={celularVisita} onChange={(e) => setCelularVisita(e.target.value.replace(/\D/g, ''))} maxLength={9} placeholder="N de Celular" className={inputClasses} />
                <input type="email" value={correoVisita} onChange={(e) => setCorreoVisita(e.target.value)} placeholder="Correo Electronico" className={inputClasses} />
                <input type="text" value={montoVisita} onChange={(e) => { const v = handleMontoInput(e.target.value); if (v !== null) setMontoVisita(v); limpiarErrorVisita('monto') }} onBlur={() => setMontoVisita(formatMontoBlur(montoVisita))} placeholder="Monto S/ *" className={erroresVisita.monto ? inputErrorClasses : inputClasses} />
              </div>
              <div className="flex justify-end items-center gap-3 pt-2">
                <button type="button" onClick={resetFormularioVisita} className="text-slate-400 hover:text-slate-600 px-3 py-3 text-sm font-medium transition-colors">Cancelar</button>
                <button type="button" onClick={registrarVisitaLibre} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 px-6 font-semibold transition-colors">Registrar Pago y Acceso</button>
              </div>
            </div>
          )}

          {/* Tarjeta del cliente seleccionado */}
          {clienteSeleccionado && estilo && (
            <div className={`p-6 rounded-2xl shadow-sm border relative ${estilo.contenedor}`}>
              <button onClick={() => setMostrarModalEditarCliente(true)} className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"><Pencil size={18} /></button>
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                  <UserCircle size={40} className="text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {clienteSeleccionado.estado === 'pase_activo' && <Ticket size={18} className="text-blue-600" />}
                    <h3 className={`text-lg font-bold ${estilo.texto}`}>{estilo.titulo}</h3>
                  </div>
                  <p className="text-base font-semibold text-slate-800 mt-1">{clienteSeleccionado.nombre}</p>
                  <div className="mt-3 flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-slate-500">Plan</span>
                      <p className={`font-semibold ${estilo.texto}`}>{clienteSeleccionado.plan}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Vence</span>
                      <p className={`font-semibold ${estilo.texto}`}>{clienteSeleccionado.fin}</p>
                    </div>
                    {clienteSeleccionado.estado === 'pase_activo' && (
                      <div>
                        <span className="text-slate-500">Dias restantes</span>
                        <p className="font-semibold text-blue-900">{clienteSeleccionado.diasRestantes}</p>
                      </div>
                    )}
                  </div>
                  {clienteSeleccionado.estado === 'pase_activo' && (
                    <p className="text-sm font-medium text-blue-700 mt-2">Le quedan {clienteSeleccionado.diasRestantes} dia(s) de acceso.</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                {clienteSeleccionado.estado === 'activo' && (
                  <button type="button" onClick={confirmarAsistencia} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 px-6 font-semibold text-center transition-colors flex items-center justify-center gap-2">
                    <CheckCircle size={18} />
                    Confirmar Asistencia
                  </button>
                )}
                {clienteSeleccionado.estado === 'pase_activo' && (
                  <button type="button" onClick={registrarAsistenciaPase} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 px-6 font-semibold text-center transition-colors flex items-center justify-center gap-2">
                    <CheckCircle size={18} />
                    Registrar Asistencia (Descontar 1 dia)
                  </button>
                )}
                {clienteSeleccionado.estado === 'vencido' && (
                  <>
                    <button type="button" onClick={() => setMostrarModalRenovacion(true)} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 px-6 font-semibold text-center transition-colors">Renovar Suscripcion</button>
                    <button type="button" onClick={() => setMostrarModalPase(true)} className="flex-1 bg-white hover:bg-red-50 border border-red-300 text-red-600 rounded-xl py-3 px-6 font-semibold text-center transition-colors">Cobrar Pase por Dia</button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Panel de historial */}
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-150 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Registro de Recepcion</h3>
              <select
                value={filtroTiempo}
                onChange={(e) => setFiltroTiempo(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg focus:ring-red-100 focus:border-red-400 py-1.5 px-3 outline-none cursor-pointer"
              >
                <option value="hoy">Hoy</option>
                <option value="ayer">Ayer</option>
                <option value="1semana">Hace 1 semana</option>
                <option value="2semanas">Hace 2 semanas</option>
                <option value="1mes">Hace 1 mes</option>
              </select>
            </div>
            <div className="flex gap-2 mb-6">
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md">{totalAsistencias} Entradas</span>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">{totalCobros} Cobros</span>
            </div>

            {historialFiltrado.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <UserCircle size={24} className="text-slate-400" />
                </div>
                <p className="text-sm text-slate-400">Sin movimientos registrados</p>
              </div>
            ) : (
              <ul className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {historialFiltrado.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100">
                    <span className="text-sm font-mono font-semibold text-slate-500 w-14 shrink-0">{formatHora(item.hora)}</span>
                    <div className="flex-1 min-w-0">
                      {item.tipo === 'asistencia' && <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 mb-1">ASISTENCIA</span>}
                      {item.tipo === 'cobro' && <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 mb-1">SOLO COBRO</span>}
                      {item.tipo === 'cobro_asistencia' && <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 mb-1">COBRO + ENTRADA</span>}
                      <p className="text-sm text-slate-700 font-medium truncate">{item.titulo}</p>
                      <p className="text-xs text-slate-400 truncate">{item.detalle}</p>
                    </div>
                    <span className="bg-slate-100 text-slate-600 rounded-full px-2 py-1 text-xs font-medium shrink-0">{item.turno}</span>
                    <button onClick={() => setRegistroAEditar(item)} className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all ml-2 shrink-0"><Pencil size={16} /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      {mostrarModalRenovacion && clienteSeleccionado && (
        <ModalRenovacion
          cliente={clienteSeleccionado}
          onConfirmar={confirmarRenovacion}
          onCerrar={() => setMostrarModalRenovacion(false)}
        />
      )}

      {mostrarModalPase && clienteSeleccionado && (
        <ModalPaseTemporal
          cliente={clienteSeleccionado}
          onProcesar={procesarVentaPase}
          onCerrar={() => setMostrarModalPase(false)}
        />
      )}

      {mostrarModalEditarCliente && clienteSeleccionado && (
        <ModalEditarCliente
          cliente={clienteSeleccionado}
          onGuardar={guardarEdicionCliente}
          onCerrar={() => setMostrarModalEditarCliente(false)}
        />
      )}

      {registroAEditar && (
        <ModalEditarRegistro
          registro={registroAEditar}
          onGuardar={guardarEdicionHistorial}
          onEliminar={eliminarRegistroHistorial}
          onCerrar={() => setRegistroAEditar(null)}
        />
      )}
    </div>
  )
}
