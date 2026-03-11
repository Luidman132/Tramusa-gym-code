import { useState } from 'react'
import { Search, UserCircle, UserPlus, ArrowRight, X, Ticket, CheckCircle, Pencil, Trash2 } from 'lucide-react'

function getTurno() {
  return new Date().getHours() < 14 ? 'Mañana' : 'Tarde'
}

function formatHora(date) {
  return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(date) {
  return date.toISOString().split('T')[0]
}

function addMonths(date, months) {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

function agregarAlHistorial(setHistorial, nuevoRegistro) {
  setHistorial((prev) => [
    {
      ...nuevoRegistro,
      id: Date.now(),
      hora: new Date(),
      turno: getTurno(),
    },
    ...prev,
  ])
}

const estilosEstado = {
  activo: {
    contenedor: 'bg-emerald-50 border-emerald-200',
    texto: 'text-emerald-800',
    titulo: 'Acceso Permitido',
  },
  vencido: {
    contenedor: 'bg-red-50 border-red-200',
    texto: 'text-red-800',
    titulo: 'Suscripción Vencida',
  },
  pase_activo: {
    contenedor: 'bg-blue-50 border-blue-200',
    texto: 'text-blue-900',
    titulo: 'PASE TEMPORAL ACTIVO',
  },
}

const planesRenovacion = {
  mensual: { label: 'Mensual (1 mes)', meses: 1 },
  trimestral: { label: 'Trimestral (3 meses)', meses: 3 },
  semestral: { label: 'Semestral (6 meses)', meses: 6 },
}

const inputClasses = 'w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all'
const inputReadOnly = 'w-full bg-slate-100 border border-slate-200 rounded-lg py-2.5 px-4 text-sm text-slate-500 cursor-not-allowed'

export default function RegistrarAsistenciaView() {
  const [clientes, setClientes] = useState([
    { id: 1, dni: '70123456', nombre: 'Yomar Crhistian Serrano R.', plan: 'Mensual', estado: 'vencido', fin: '14/02/2026' },
    { id: 2, dni: '70234567', nombre: 'Jose Alfredo Gallegos Garcia', plan: 'Trimestral', estado: 'activo', fin: '20/05/2026' },
    { id: 3, dni: '70345678', nombre: 'Jorge Calderon Quispe', plan: 'Mensual', estado: 'activo', fin: '21/04/2026' },
    { id: 4, dni: '70456789', nombre: 'Janet Huaman Cano', plan: 'Mensual', estado: 'vencido', fin: '20/02/2026' },
    { id: 5, dni: '70567890', nombre: 'Mizael Ferrel Mendoza', plan: 'Pase Día', estado: 'pase_activo', diasRestantes: 2, fin: '08/03/2026' },
    { id: 6, dni: '70678901', nombre: 'Stephanie Pamela Huaranca', plan: 'Semestral', estado: 'activo', fin: '30/10/2026' },
    { id: 7, dni: '71111111', nombre: 'Juan Carlos Perez', plan: 'Mensual', estado: 'activo', fin: '15/04/2026' },
    { id: 8, dni: '71111112', nombre: 'Juan Carlos Gomez', plan: 'Mensual', estado: 'vencido', fin: '01/03/2026' },
    { id: 9, dni: '71111113', nombre: 'Juan Manuel Vargas', plan: 'Trimestral', estado: 'activo', fin: '10/06/2026' },
    { id: 10, dni: '71111114', nombre: 'Juan Diego Flores', plan: 'Pase Día', estado: 'pase_activo', diasRestantes: 1, fin: '07/03/2026' },
    { id: 11, dni: '72222221', nombre: 'Roberto Antonio Silva', plan: 'Mensual', estado: 'vencido', fin: '28/02/2026' },
    { id: 12, dni: '72222222', nombre: 'Roberto Antonio Mendez', plan: 'Semestral', estado: 'activo', fin: '12/08/2026' },
    { id: 13, dni: '72222223', nombre: 'Roberto Luis Martinez', plan: 'Mensual', estado: 'activo', fin: '05/04/2026' },
    { id: 14, dni: '72222224', nombre: 'Roberto Carlos Farfan', plan: 'Mensual', estado: 'vencido', fin: '15/01/2026' },
    { id: 15, dni: '73333331', nombre: 'Maria Fernanda Rojas', plan: 'Trimestral', estado: 'activo', fin: '22/05/2026' },
    { id: 16, dni: '73333332', nombre: 'Lucero Milagros Apaza', plan: 'Pase Día', estado: 'pase_activo', diasRestantes: 3, fin: '09/03/2026' },
    { id: 17, dni: '73333333', nombre: 'Andrea Carolina Ramos', plan: 'Mensual', estado: 'activo', fin: '18/04/2026' },
    { id: 18, dni: '73333334', nombre: 'Julio Cesar Flores', plan: 'Mensual', estado: 'vencido', fin: '10/02/2026' },
    { id: 19, dni: '73333335', nombre: 'Diana Carolina Perez', plan: 'Semestral', estado: 'activo', fin: '01/09/2026' },
    { id: 20, dni: '73333336', nombre: 'Carlos Eduardo Mamani', plan: 'Mensual', estado: 'activo', fin: '25/03/2026' },
    { id: 21, dni: '73333337', nombre: 'Sofia Alejandra Paucar', plan: 'Trimestral', estado: 'vencido', fin: '05/03/2026' },
    { id: 22, dni: '73333338', nombre: 'Diego Alonso Mejia', plan: 'Mensual', estado: 'activo', fin: '29/03/2026' },
  ])

  const [busqueda, setBusqueda] = useState('')
  const [resultadosBusqueda, setResultadosBusqueda] = useState([])
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [historial, setHistorial] = useState([])
  const [filtroTiempo, setFiltroTiempo] = useState('hoy')
  const [mostrandoPaseRapido, setMostrandoPaseRapido] = useState(false)
  const [nombresVisita, setNombresVisita] = useState('')
  const [apellidosVisita, setApellidosVisita] = useState('')
  const [dniVisita, setDniVisita] = useState('')
  const [celularVisita, setCelularVisita] = useState('')
  const [correoVisita, setCorreoVisita] = useState('')
  const [montoVisita, setMontoVisita] = useState('')

  const [mostrarModalRenovacion, setMostrarModalRenovacion] = useState(false)
  const [renovarModoFecha, setRenovarModoFecha] = useState('automatico')
  const [renovarPlan, setRenovarPlan] = useState('mensual')
  const [renovarInicio, setRenovarInicio] = useState(formatDate(new Date()))
  const [renovarFin, setRenovarFin] = useState('')
  const [renovarMonto, setRenovarMonto] = useState('')
  const [renovarTurno, setRenovarTurno] = useState('mañana')
  const [renovarRecibo, setRenovarRecibo] = useState('')

  const [mostrarModalPase, setMostrarModalPase] = useState(false)
  const [diasPase, setDiasPase] = useState(1)
  const [montoPase, setMontoPase] = useState('')

  const [mostrarModalEditarCliente, setMostrarModalEditarCliente] = useState(false)
  const [editNombreCliente, setEditNombreCliente] = useState('')
  const [editDniCliente, setEditDniCliente] = useState('')

  const [registroAEditar, setRegistroAEditar] = useState(null)
  const [editHistorialTitulo, setEditHistorialTitulo] = useState('')
  const [editMonto, setEditMonto] = useState('')
  const [editPlan, setEditPlan] = useState('')

  const renovarInicioCalculado = renovarModoFecha === 'automatico' ? formatDate(new Date()) : renovarInicio
  const renovarFinCalculado = renovarModoFecha === 'automatico' ? formatDate(addMonths(new Date(), planesRenovacion[renovarPlan].meses)) : renovarFin

  function actualizarCliente(id, cambios) {
    setClientes((prev) => prev.map((c) => c.id === id ? { ...c, ...cambios } : c))
  }

  function limpiarBusqueda() {
    setClienteSeleccionado(null)
    setBusqueda('')
    setResultadosBusqueda([])
  }

  function handleSearch(e) {
    const texto = e.target.value
    setBusqueda(texto)

    const normalizarTexto = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    }

    const query = normalizarTexto(texto).trim()
    if (query.length > 2) {
      const terminosBusqueda = query.split(/\s+/)
      setResultadosBusqueda(
        clientes.filter((c) => {
          const nombreNorm = normalizarTexto(c.nombre)
          const dniNorm = c.dni ? normalizarTexto(c.dni) : ''
          return terminosBusqueda.every(termino =>
            nombreNorm.includes(termino) || dniNorm.includes(termino)
          )
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
    agregarAlHistorial(setHistorial, {
      tipo: 'asistencia',
      titulo: clienteSeleccionado.nombre,
      detalle: `Plan: ${clienteSeleccionado.plan}`,
    })
    limpiarBusqueda()
  }

  function registrarAsistenciaPase() {
    if (!clienteSeleccionado) return
    const nuevosDias = clienteSeleccionado.diasRestantes - 1
    agregarAlHistorial(setHistorial, {
      tipo: 'asistencia',
      titulo: clienteSeleccionado.nombre,
      detalle: `Pase: Días restantes ${nuevosDias}`,
    })
    if (nuevosDias <= 0) {
      actualizarCliente(clienteSeleccionado.id, { estado: 'vencido', diasRestantes: 0 })
    } else {
      actualizarCliente(clienteSeleccionado.id, { diasRestantes: nuevosDias })
    }
    limpiarBusqueda()
  }

  function handleMontoChange(e) {
    let val = e.target.value.replace(/[^0-9.]/g, '')
    if (val.split('.').length > 2) return
    setMontoVisita(val)
  }

  function handleMontoBlur() {
    if (!montoVisita) return
    const numericVal = parseFloat(montoVisita)
    if (!isNaN(numericVal)) setMontoVisita('S/ ' + numericVal.toFixed(2))
  }

  function handleRenovarMontoChange(e) {
    let val = e.target.value.replace(/[^0-9.]/g, '')
    if (val.split('.').length > 2) return
    setRenovarMonto(val)
  }

  function handleRenovarMontoBlur() {
    if (!renovarMonto) return
    const numericVal = parseFloat(renovarMonto)
    if (!isNaN(numericVal)) setRenovarMonto('S/ ' + numericVal.toFixed(2))
  }

  function handleMontoPaseChange(e) {
    let val = e.target.value.replace(/[^0-9.]/g, '')
    if (val.split('.').length > 2) return
    setMontoPase(val)
  }

  function handleMontoPaseBlur() {
    if (!montoPase) return
    const numericVal = parseFloat(montoPase)
    if (!isNaN(numericVal)) setMontoPase('S/ ' + numericVal.toFixed(2))
  }

  function resetFormularioVisita() {
    setNombresVisita('')
    setApellidosVisita('')
    setDniVisita('')
    setCelularVisita('')
    setCorreoVisita('')
    setMontoVisita('')
    setMostrandoPaseRapido(false)
  }

  function registrarVisitaLibre() {
    if (!nombresVisita.trim() || !apellidosVisita.trim() || !montoVisita) return
    const monto = parseFloat(montoVisita.replace(/[^0-9.]/g, '')) || 0
    agregarAlHistorial(setHistorial, {
      tipo: 'cobro_asistencia',
      titulo: `Visita Libre: ${nombresVisita.trim()} ${apellidosVisita.trim()}`,
      detalle: `Pago: S/ ${monto.toFixed(2)}`,
    })
    resetFormularioVisita()
  }

  function abrirModalRenovacion() {
    setRenovarModoFecha('automatico')
    setRenovarPlan('mensual')
    setRenovarMonto('')
    setRenovarTurno('mañana')
    setRenovarRecibo('')
    setMostrarModalRenovacion(true)
  }

  function cerrarModalRenovacion() {
    setMostrarModalRenovacion(false)
  }

  function confirmarRenovacion() {
    if (!clienteSeleccionado) return
    const monto = parseFloat(renovarMonto.replace(/[^0-9.]/g, '')) || 0
    const planLabel = planesRenovacion[renovarPlan].label

    // Formatear la fecha de YYYY-MM-DD a DD/MM/YYYY para la UI
    const [year, month, day] = renovarFinCalculado.split('-')
    const fechaFinFormateada = `${day}/${month}/${year}`

    // 1. Actualizar la base de datos principal
    const nombrePlanCorto = planLabel.split(' ')[0]
    actualizarCliente(clienteSeleccionado.id, {
      estado: 'activo',
      plan: nombrePlanCorto,
      fin: fechaFinFormateada,
      diasRestantes: undefined,
    })

    // 2. Registrar en el Historial de Movimientos
    agregarAlHistorial(setHistorial, {
      tipo: 'cobro',
      titulo: `Renovación: ${clienteSeleccionado.nombre}`,
      detalle: `Plan: ${planLabel} - Pago: S/ ${monto.toFixed(2)}`,
    })
    setMostrarModalRenovacion(false)
    limpiarBusqueda()
  }

  function abrirModalPase() {
    setDiasPase(1)
    setMontoPase('')
    setMostrarModalPase(true)
  }

  function procesarVentaPase(registrarIngresoAhora) {
    if (!clienteSeleccionado) return
    const monto = parseFloat(montoPase.replace(/[^0-9.]/g, '')) || 0
    const diasRestantesFinal = registrarIngresoAhora ? diasPase - 1 : diasPase
    const nuevoEstado = (registrarIngresoAhora && diasRestantesFinal <= 0) ? 'vencido' : 'pase_activo'
    actualizarCliente(clienteSeleccionado.id, { estado: nuevoEstado, diasRestantes: diasRestantesFinal })
    setClienteSeleccionado(prev => ({ ...prev, estado: nuevoEstado, diasRestantes: diasRestantesFinal }))
    const txtDias = `${diasPase} día${diasPase > 1 ? 's' : ''}`
    if (registrarIngresoAhora) {
      agregarAlHistorial(setHistorial, {
        tipo: 'cobro_asistencia',
        titulo: `Pase (${txtDias}): ${clienteSeleccionado.nombre}`,
        detalle: `Pago: S/ ${monto.toFixed(2)} • Restan: ${diasRestantesFinal}`,
      })
    } else {
      agregarAlHistorial(setHistorial, {
        tipo: 'cobro',
        titulo: `Venta Pase (${txtDias}): ${clienteSeleccionado.nombre}`,
        detalle: `Pago: S/ ${monto.toFixed(2)}`,
      })
    }
    setMostrarModalPase(false)
    limpiarBusqueda()
  }

  function abrirModalEditarCliente() {
    setEditNombreCliente(clienteSeleccionado.nombre)
    setEditDniCliente(clienteSeleccionado.dni || '')
    setMostrarModalEditarCliente(true)
  }

  function guardarEdicionCliente() {
    actualizarCliente(clienteSeleccionado.id, { nombre: editNombreCliente, dni: editDniCliente })
    setClienteSeleccionado(prev => ({ ...prev, nombre: editNombreCliente, dni: editDniCliente }))
    setMostrarModalEditarCliente(false)
  }

  function abrirModalEditarHistorial(item) {
    setRegistroAEditar(item)
    setEditHistorialTitulo(item.titulo)
    const montoMatch = item.detalle.match(/S\/\s*([0-9.]+)/)
    setEditMonto(montoMatch ? montoMatch[1] : '')
    const planMatch = item.detalle.match(/Plan:\s*([A-Za-z0-9 ()áéíóú]+)(?=\s*-|$)/)
    setEditPlan(planMatch ? planMatch[1].trim() : '')
  }

  function guardarEdicionHistorial() {
    let nuevoDetalle = registroAEditar.detalle
    if (editMonto !== '') {
      const montoVal = parseFloat(editMonto) || 0
      nuevoDetalle = nuevoDetalle.replace(/S\/\s*[0-9.]+/, `S/ ${montoVal.toFixed(2)}`)
    }
    if (editPlan !== '') {
      nuevoDetalle = nuevoDetalle.replace(/Plan:\s*([A-Za-z0-9 ()áéíóú]+)(?=\s*-|$)/, `Plan: ${editPlan}`)
    }
    setHistorial(prev => prev.map(h => h.id === registroAEditar.id ? { ...h, titulo: editHistorialTitulo, detalle: nuevoDetalle } : h))
    setRegistroAEditar(null)
  }

  function eliminarRegistroHistorial() {
    if (window.confirm('¿Estás seguro de eliminar este registro del historial?')) {
      setHistorial(prev => prev.filter(h => h.id !== registroAEditar.id))
      setRegistroAEditar(null)
    }
  }

  const estilo = clienteSeleccionado ? estilosEstado[clienteSeleccionado.estado] : null

  const historialFiltrado = historial.filter(item => {
    const hoy = new Date();
    const fechaItem = new Date(item.hora);

    // Limpiar horas, minutos y segundos para comparar solo los días exactos
    const fechaHoyLimpiada = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const fechaItemLimpiada = new Date(fechaItem.getFullYear(), fechaItem.getMonth(), fechaItem.getDate());

    const diffTiempo = fechaHoyLimpiada.getTime() - fechaItemLimpiada.getTime();
    const diffDias = Math.floor(diffTiempo / (1000 * 60 * 60 * 24));

    if (filtroTiempo === 'hoy') return diffDias === 0;
    if (filtroTiempo === 'ayer') return diffDias === 1;
    if (filtroTiempo === '1semana') return diffDias >= 2 && diffDias <= 7;
    if (filtroTiempo === '2semanas') return diffDias > 7 && diffDias <= 14;
    if (filtroTiempo === '1mes') return diffDias > 14 && diffDias <= 30;
    return true;
  })

  const totalAsistencias = historialFiltrado.filter(h => h.tipo === 'asistencia' || h.tipo === 'cobro_asistencia').length
  const totalCobros = historialFiltrado.filter(h => h.tipo === 'cobro' || h.tipo === 'cobro_asistencia').length

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Registrar Asistencia</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
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
                <input
                  type="text"
                  value={nombresVisita}
                  onChange={(e) => setNombresVisita(e.target.value)}
                  placeholder="Nombre(s)"
                  className={inputClasses}
                />
                <input
                  type="text"
                  value={apellidosVisita}
                  onChange={(e) => setApellidosVisita(e.target.value)}
                  placeholder="Apellido(s)"
                  className={inputClasses}
                />
                <input
                  type="text"
                  value={dniVisita}
                  onChange={(e) => setDniVisita(e.target.value)}
                  placeholder="DNI"
                  className={inputClasses}
                />
                <input
                  type="tel"
                  value={celularVisita}
                  onChange={(e) => setCelularVisita(e.target.value)}
                  placeholder="N° de Celular"
                  className={inputClasses}
                />
                <input
                  type="email"
                  value={correoVisita}
                  onChange={(e) => setCorreoVisita(e.target.value)}
                  placeholder="Correo Electrónico"
                  className={inputClasses}
                />
                <input
                  type="text"
                  value={montoVisita}
                  onChange={handleMontoChange}
                  onBlur={handleMontoBlur}
                  placeholder="Monto S/..."
                  className={inputClasses}
                />
              </div>
              <div className="flex justify-end items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetFormularioVisita}
                  className="text-slate-400 hover:text-slate-600 px-3 py-3 text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={registrarVisitaLibre}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 px-6 font-semibold transition-colors"
                >
                  Registrar Pago y Acceso
                </button>
              </div>
            </div>
          )}

          {clienteSeleccionado && estilo && (
            <div className={`p-6 rounded-2xl shadow-sm border relative ${estilo.contenedor}`}>
              <button onClick={abrirModalEditarCliente} className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"><Pencil size={18} /></button>
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                  <UserCircle size={40} className="text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {clienteSeleccionado.estado === 'pase_activo' && (
                      <Ticket size={18} className="text-blue-600" />
                    )}
                    <h3 className={`text-lg font-bold ${estilo.texto}`}>{estilo.titulo}</h3>
                  </div>
                  <p className="text-base font-semibold text-slate-800 mt-1">
                    {clienteSeleccionado.nombre}
                  </p>
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
                        <span className="text-slate-500">Días restantes</span>
                        <p className="font-semibold text-blue-900">{clienteSeleccionado.diasRestantes}</p>
                      </div>
                    )}
                  </div>
                  {clienteSeleccionado.estado === 'pase_activo' && (
                    <p className="text-sm font-medium text-blue-700 mt-2">
                      Le quedan {clienteSeleccionado.diasRestantes} día(s) de acceso.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                {clienteSeleccionado.estado === 'activo' && (
                  <button
                    type="button"
                    onClick={confirmarAsistencia}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 px-6 font-semibold text-center transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Confirmar Asistencia
                  </button>
                )}
                {clienteSeleccionado.estado === 'pase_activo' && (
                  <button
                    type="button"
                    onClick={registrarAsistenciaPase}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 px-6 font-semibold text-center transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Registrar Asistencia (Descontar 1 día)
                  </button>
                )}
                {clienteSeleccionado.estado === 'vencido' && (
                  <>
                    <button
                      type="button"
                      onClick={abrirModalRenovacion}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 px-6 font-semibold text-center transition-colors"
                    >
                      Renovar Suscripción
                    </button>
                    <button
                      type="button"
                      onClick={abrirModalPase}
                      className="flex-1 bg-white hover:bg-red-50 border border-red-300 text-red-600 rounded-xl py-3 px-6 font-semibold text-center transition-colors"
                    >
                      Cobrar Pase por Día
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-150 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Registro de Recepción</h3>
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
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md">🏃 {totalAsistencias} Entradas</span>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">💰 {totalCobros} Cobros</span>
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
                  <li
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100"
                  >
                    <span className="text-sm font-mono font-semibold text-slate-500 w-14 shrink-0">
                      {formatHora(item.hora)}
                    </span>
                    <div className="flex-1 min-w-0">
                      {item.tipo === 'asistencia' && (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 mb-1">ASISTENCIA</span>
                      )}
                      {item.tipo === 'cobro' && (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 mb-1">SOLO COBRO</span>
                      )}
                      {item.tipo === 'cobro_asistencia' && (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 mb-1">COBRO + ENTRADA</span>
                      )}
                      <p className="text-sm text-slate-700 font-medium truncate">{item.titulo}</p>
                      <p className="text-xs text-slate-400 truncate">{item.detalle}</p>
                    </div>
                    <span className="bg-slate-100 text-slate-600 rounded-full px-2 py-1 text-xs font-medium shrink-0">
                      {item.turno}
                    </span>
                    <button onClick={() => abrirModalEditarHistorial(item)} className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all ml-2 shrink-0"><Pencil size={16} /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {mostrarModalRenovacion && clienteSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-red-50 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-red-800">Renovar Suscripción</h3>
                <p className="text-sm text-red-600 mt-1">{clienteSeleccionado.nombre}</p>
              </div>
              <button
                type="button"
                onClick={cerrarModalRenovacion}
                className="p-2 rounded-full hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex bg-slate-100 rounded-lg p-1 w-fit">
                <button
                  type="button"
                  onClick={() => setRenovarModoFecha('automatico')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    renovarModoFecha === 'automatico'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Automático (Planes)
                </button>
                <button
                  type="button"
                  onClick={() => setRenovarModoFecha('personalizado')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    renovarModoFecha === 'personalizado'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Personalizado
                </button>
              </div>

              {renovarModoFecha === 'automatico' && (
                <div>
                  <label className="block text-sm text-slate-600 mb-1.5">Plan</label>
                  <select
                    value={renovarPlan}
                    onChange={(e) => setRenovarPlan(e.target.value)}
                    className={inputClasses}
                  >
                    {Object.entries(planesRenovacion).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1.5">Fecha de Inicio</label>
                  <input
                    type="date"
                    value={renovarInicioCalculado}
                    onChange={(e) => setRenovarInicio(e.target.value)}
                    readOnly={renovarModoFecha === 'automatico'}
                    className={renovarModoFecha === 'automatico' ? inputReadOnly : inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1.5">Fecha de Fin</label>
                  <input
                    type="date"
                    value={renovarFinCalculado}
                    onChange={(e) => setRenovarFin(e.target.value)}
                    readOnly={renovarModoFecha === 'automatico'}
                    className={renovarModoFecha === 'automatico' ? inputReadOnly : inputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1.5">Monto S/</label>
                  <input
                    type="text"
                    value={renovarMonto}
                    onChange={handleRenovarMontoChange}
                    onBlur={handleRenovarMontoBlur}
                    placeholder="0.00"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1.5">Turno</label>
                  <select
                    value={renovarTurno}
                    onChange={(e) => setRenovarTurno(e.target.value)}
                    className={inputClasses}
                  >
                    <option value="mañana">Mañana</option>
                    <option value="tarde">Tarde</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1.5">N° de Recibo / Boleta</label>
                <input
                  type="text"
                  value={renovarRecibo}
                  onChange={(e) => setRenovarRecibo(e.target.value)}
                  placeholder="000-0000"
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={cerrarModalRenovacion}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarRenovacion}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl py-2.5 px-6 font-semibold transition-colors"
              >
                Confirmar Renovación
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalPase && clienteSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-50 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-blue-800">Vender Pase Temporal</h3>
                <p className="text-sm text-blue-600 mt-1">{clienteSeleccionado.nombre}</p>
              </div>
              <button
                type="button"
                onClick={() => setMostrarModalPase(false)}
                className="p-2 rounded-full hover:bg-blue-100 text-blue-400 hover:text-blue-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm text-slate-600 mb-3">Cantidad de días</label>
                <div className="flex gap-3">
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setDiasPase(n)}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                        diasPase === n
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {n} Día{n > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1.5">Monto S/</label>
                <input
                  type="text"
                  value={montoPase}
                  onChange={handleMontoPaseChange}
                  onBlur={handleMontoPaseBlur}
                  placeholder="0.00"
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setMostrarModalPase(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => procesarVentaPase(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-emerald-600 bg-white border border-emerald-600 hover:bg-emerald-50 transition-colors"
              >
                Solo Cobrar
              </button>
              <button
                type="button"
                onClick={() => procesarVentaPase(true)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Cobrar y Registrar Ingreso
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalEditarCliente && clienteSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-slate-50 p-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Editar Cliente</h3>
              <button
                type="button"
                onClick={() => setMostrarModalEditarCliente(false)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1.5">Nombre Completo</label>
                <input
                  type="text"
                  value={editNombreCliente}
                  onChange={(e) => setEditNombreCliente(e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1.5">DNI</label>
                <input
                  type="text"
                  value={editDniCliente}
                  onChange={(e) => setEditDniCliente(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setMostrarModalEditarCliente(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={guardarEdicionCliente}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 px-6 font-semibold transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {registroAEditar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-slate-50 p-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Editar Registro</h3>
              <button
                type="button"
                onClick={() => setRegistroAEditar(null)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1.5">Descripción</label>
                <input
                  type="text"
                  value={editHistorialTitulo}
                  onChange={(e) => setEditHistorialTitulo(e.target.value)}
                  className={inputClasses}
                />
              </div>
              {editPlan !== '' && (
                <div>
                  <label className="block text-sm text-slate-600 mb-1.5">Tipo de Plan</label>
                  <select
                    value={editPlan}
                    onChange={(e) => setEditPlan(e.target.value)}
                    className={inputClasses}
                  >
                    <option value="Mensual (1 mes)">Mensual (1 mes)</option>
                    <option value="Trimestral (3 meses)">Trimestral (3 meses)</option>
                    <option value="Semestral (6 meses)">Semestral (6 meses)</option>
                    <option value="Mensual">Mensual (Solo texto)</option>
                    <option value="Trimestral">Trimestral (Solo texto)</option>
                    <option value="Semestral">Semestral (Solo texto)</option>
                  </select>
                </div>
              )}
              {editMonto !== '' && (
                <div>
                  <label className="block text-sm text-slate-600 mb-1.5">Monto Cobrado</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">S/</span>
                    <input
                      type="number"
                      value={editMonto}
                      onChange={(e) => setEditMonto(e.target.value)}
                      className={`${inputClasses} pl-10`}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={eliminarRegistroHistorial}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} />
                Eliminar Registro
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRegistroAEditar(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={guardarEdicionHistorial}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 px-6 font-semibold transition-colors"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
