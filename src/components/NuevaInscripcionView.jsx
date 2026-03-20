import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, UserPlus, Download, Send, X, AlertTriangle } from 'lucide-react'
import QRCode from 'react-qr-code'
import { toPng } from 'html-to-image'
import { formatDate, addMonths } from '../utils/helpers'
import { inputClasses, inputErrorClasses, inputReadOnly, planes } from '../utils/constants'
import { useToast } from '../context/ToastContext'
import { useGym } from '../context/GymContext'
import { TicketWhatsApp } from './TicketWhatsApp'

// Genera un código tipo: TRAMUSA-ANDR-X7B2
function generarCodigoQRUnico(nombreCompleto) {
  // VALIDACIÓN DE SEGURIDAD: Si no hay nombre, usa 'USER' por defecto
  const nombreSeguro = nombreCompleto ? String(nombreCompleto) : 'USER'

  const nombreLimpio = nombreSeguro.replace(/\s+/g, '')
  const prefijo = nombreLimpio.substring(0, 4).toUpperCase().padEnd(4, 'X')

  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let sufijoAleatorio = ''
  for (let i = 0; i < 4; i++) {
    sufijoAleatorio += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
  }

  return `TRAMUSA-${prefijo}-${sufijoAleatorio}`
}

export default function NuevaInscripcionView({ setVistaActiva }) {
  const { mostrarToast } = useToast()
  const { miembros, agregarMiembro, agregarRegistro } = useGym()

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [tipoDoc, setTipoDoc] = useState('dni')
  const [numDoc, setNumDoc] = useState('')
  const [celular, setCelular] = useState('')
  const [contactoNombre, setContactoNombre] = useState('')
  const [contactoTelefono, setContactoTelefono] = useState('')
  const [modoFecha, setModoFecha] = useState('automatico')
  const [plan, setPlan] = useState('mensual')
  const [fechaInicio, setFechaInicio] = useState(formatDate(new Date()))
  const [fechaFin, setFechaFin] = useState('')
  const [turno, setTurno] = useState('')
  const [monto, setMonto] = useState('')
  const [montoDisplay, setMontoDisplay] = useState('')

  function handleMontoChange(e) {
    // Solo permite digitos y un punto decimal
    let raw = e.target.value.replace(/[^0-9]/g, '')
    if (!raw) {
      setMonto('')
      setMontoDisplay('')
      limpiarError('monto')
      return
    }
    // Guarda el valor numerico real (en centimos)
    const numero = parseInt(raw, 10)
    // Valor real en soles
    const valorReal = (numero / 100).toFixed(2)
    setMonto(valorReal)
    // Formato display: S/ 2,300.00
    const partes = valorReal.split('.')
    const entero = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    setMontoDisplay(`S/ ${entero}.${partes[1]}`)
    limpiarError('monto')
  }
  const [otros, setOtros] = useState('')
  const [recibo, setRecibo] = useState('')
  const [boleta, setBoleta] = useState('')
  const [deposito, setDeposito] = useState('')

  const [errores, setErrores] = useState({})
  const [ticketExito, setTicketExito] = useState(null)

  // Flujo de bienvenida QR (Paso 2)
  const [nuevoMiembroQR, setNuevoMiembroQR] = useState(null)
  const [mostrarAlertaWA, setMostrarAlertaWA] = useState(false)
  const qrBienvenidaRef = useRef(null)

  useEffect(() => {
    if (modoFecha === 'automatico') {
      const hoy = new Date()
      setFechaInicio(formatDate(hoy))
      setFechaFin(formatDate(addMonths(hoy, planes[plan].meses)))
    }
  }, [modoFecha, plan])

  function limpiarError(campo) {
    setErrores((prev) => {
      const copia = { ...prev }
      delete copia[campo]
      return copia
    })
  }

  function validar() {
    const nuevosErrores = {}

    if (!nombre.trim()) nuevosErrores.nombre = true
    if (!apellido.trim()) nuevosErrores.apellido = true
    if (!numDoc.trim()) nuevosErrores.numDoc = true
    if (!celular.trim()) nuevosErrores.celular = true
    if (!monto.trim()) nuevosErrores.monto = true

    // Validar formato DNI (8 dígitos)
    if (numDoc.trim() && tipoDoc === 'dni' && !/^\d{8}$/.test(numDoc.trim())) {
      nuevosErrores.numDoc = true
    }

    // Validar celular (9 dígitos)
    if (celular.trim() && !/^\d{9}$/.test(celular.trim())) {
      nuevosErrores.celular = true
    }

    // Validar fechas en modo personalizado
    if (modoFecha === 'personalizado') {
      if (!fechaInicio) nuevosErrores.fechaInicio = true
      if (!fechaFin) nuevosErrores.fechaFin = true
      if (fechaInicio && fechaFin && fechaFin <= fechaInicio) nuevosErrores.fechaFin = true
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validar()) {
      mostrarToast('Completa los campos obligatorios correctamente', 'error')
      return
    }

    try {
      // Verificar si el documento ya está registrado
      if (numDoc.trim()) {
        const miembroExistente = miembros.find((m) => m.dni === numDoc.trim())
        if (miembroExistente) {
          mostrarToast(`Error: El documento ${numDoc} ya está registrado a nombre de ${miembroExistente.nombre}.`, 'error')
          setErrores((prev) => ({ ...prev, numDoc: true }))
          return
        }
      }

      const nombrePlan = modoFecha === 'automatico' ? planes[plan].label.split(' ')[0] : 'Personalizado'
      const [yi, mi, di] = fechaInicio.split('-')
      const [yf, mf, df] = fechaFin.split('-')

      // FIX: Declarar nombreCompleto ANTES de usarlo en generarCodigoQRUnico
      const nombreCompleto = `${nombre.trim()} ${apellido.trim()}`
      const codigoQR = generarCodigoQRUnico(nombreCompleto)

      agregarMiembro({
        dni: numDoc,
        nombre: nombreCompleto,
        celular,
        plan: nombrePlan,
        estado: 'activo',
        inicio: `${di}/${mi}/${yi}`,
        fin: `${df}/${mf}/${yf}`,
        contactoNombre: contactoNombre || undefined,
        contactoTelefono: contactoTelefono || undefined,
        turno: turno || undefined,
        codigoQR,
        otros: otros || undefined,
        recibo: recibo || undefined,
        boleta: boleta || undefined,
        deposito: deposito || undefined,
      })

      // Guardar datos para el modal de bienvenida QR (Paso 2)
      setNuevoMiembroQR({ nombre: nombreCompleto, celular, codigoQR })

      if (monto) {
        agregarRegistro({
          tipo: 'cobro',
          titulo: `Inscripcion: ${nombre.trim()} ${apellido.trim()}`,
          detalle: `Plan: ${nombrePlan} - Pago: S/ ${parseFloat(monto).toFixed(2)}`,
          recibo: recibo || undefined,
          boleta: boleta || undefined,
          deposito: deposito || undefined,
        })
      }

      mostrarToast(`${nombre.trim()} ${apellido.trim()} inscrito correctamente`)

      setTicketExito({
        cliente: `${nombre.trim()} ${apellido.trim()}`,
        operacion: `Inscripción: ${nombrePlan}`,
        monto: parseFloat(monto).toFixed(2),
        fecha: new Date().toLocaleDateString('es-PE'),
      })
    } catch (error) {
      console.error('🚨 ERROR CRÍTICO AL REGISTRAR:', error)
      alert(`Ocurrió un error al guardar: ${error.message}. Revisa la consola (F12) para más detalles.`)
    }
  }

  // --- Funciones del flujo de bienvenida QR ---
  const descargarQRBienvenida = async () => {
    if (!qrBienvenidaRef.current || !nuevoMiembroQR) return
    try {
      const dataUrl = await toPng(qrBienvenidaRef.current, { quality: 1.0, pixelRatio: 3, backgroundColor: '#ffffff' })
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `Pase_QR_${nuevoMiembroQR.nombre.replace(/\s+/g, '_')}.png`
      link.click()
      mostrarToast(`QR de ${nuevoMiembroQR.nombre.split(' ')[0]} descargado`)
    } catch (err) {
      console.error('Error al descargar QR:', err)
      mostrarToast('Error al descargar el QR', 'error')
    }
  }

  const enviarQRWhatsApp = () => {
    setMostrarAlertaWA(true)
  }

  const confirmarEnvioWA = () => {
    if (!nuevoMiembroQR) return

    const mensaje = `¡Hola *${nuevoMiembroQR.nombre}*! 👋\n\n¡Bienvenido a *TRAMUSA S.A.*!\n\nAdjunto a este mensaje te enviamos tu *Pase de Ingreso QR*. Por favor, muéstralo en recepción cada vez que vengas a entrenar.\n\n¡A darle con todo! 💪`
    const celular = nuevoMiembroQR.celular ? `51${nuevoMiembroQR.celular}` : ''
    const url = celular
      ? `https://wa.me/${celular}?text=${encodeURIComponent(mensaje)}`
      : `https://wa.me/?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')

    setMostrarAlertaWA(false)
  }

  const cerrarFlujoBienvenida = () => {
    // 1. Cerrar modal QR
    setNuevoMiembroQR(null)

    // 2. Limpiar formulario completo
    setNombre('')
    setApellido('')
    setTipoDoc('dni')
    setNumDoc('')
    setCelular('')
    setContactoNombre('')
    setContactoTelefono('')
    setModoFecha('automatico')
    setPlan('mensual')
    setFechaInicio(formatDate(new Date()))
    setFechaFin('')
    setTurno('')
    setMonto('')
    setMontoDisplay('')
    setOtros('')
    setRecibo('')
    setBoleta('')
    setDeposito('')
    setErrores({})

    // 3. Redirigir al Inicio
    setVistaActiva('Inicio')
  }

  function getClase(campo) {
    return errores[campo] ? inputErrorClasses : inputClasses
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Nueva Inscripción</h2>
        <button
          onClick={() => setVistaActiva('Inicio')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          Volver
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 space-y-8">
        <fieldset>
          <legend className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 w-full">
            1. Información Personal
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nombre(s) <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => { setNombre(e.target.value); limpiarError('nombre') }}
                placeholder="Ej. Carlos"
                className={getClase('nombre')}
              />
              {errores.nombre && <p className="text-xs text-red-500 mt-1">Campo obligatorio</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Apellido(s) <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => { setApellido(e.target.value); limpiarError('apellido') }}
                placeholder="Ej. López Mendoza"
                className={getClase('apellido')}
              />
              {errores.apellido && <p className="text-xs text-red-500 mt-1">Campo obligatorio</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Documento de Identidad <span className="text-red-400">*</span></label>
              <div className={`flex rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-red-100 focus-within:border-red-400 ${errores.numDoc ? 'border border-red-300 bg-red-50' : 'border border-slate-200 dark:border-slate-700'}`}>
                <select
                  value={tipoDoc}
                  onChange={(e) => setTipoDoc(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 py-2.5 px-3 border-r border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  <option value="dni">DNI</option>
                  <option value="extranjeria">C. Extranjería</option>
                  <option value="pasaporte">Pasaporte</option>
                </select>
                <input
                  type="text"
                  value={numDoc}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '')
                    setNumDoc(val)
                    limpiarError('numDoc')
                  }}
                  maxLength={tipoDoc === 'dni' ? 8 : 12}
                  placeholder={tipoDoc === 'dni' ? '8 dígitos' : 'Número de documento'}
                  className={`flex-1 text-sm text-slate-700 dark:text-slate-200 py-2.5 px-4 placeholder:text-slate-400 focus:outline-none ${errores.numDoc ? 'bg-red-50 dark:bg-red-950' : 'bg-slate-50 dark:bg-slate-800'}`}
                />
              </div>
              {errores.numDoc && <p className="text-xs text-red-500 mt-1">{!numDoc.trim() ? 'Campo obligatorio' : miembros.some(m => m.dni === numDoc.trim()) ? 'Este documento ya está registrado' : 'DNI debe tener 8 dígitos'}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">N° de Celular <span className="text-red-400">*</span></label>
              <input
                type="tel"
                value={celular}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '')
                  setCelular(val)
                  limpiarError('celular')
                }}
                maxLength={9}
                placeholder="9 dígitos"
                className={getClase('celular')}
              />
              {errores.celular && <p className="text-xs text-red-500 mt-1">{celular.trim() ? 'Debe tener 9 dígitos' : 'Campo obligatorio'}</p>}
            </div>
          </div>
        </fieldset>

        <div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mt-8 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Contacto de Emergencia</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nombre del Contacto</label>
              <input
                type="text"
                value={contactoNombre}
                onChange={(e) => setContactoNombre(e.target.value)}
                placeholder="Ej. María López"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Teléfono de Emergencia</label>
              <input
                type="tel"
                value={contactoTelefono}
                onChange={(e) => setContactoTelefono(e.target.value.replace(/\D/g, ''))}
                maxLength={9}
                placeholder="999 999 999"
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        <fieldset>
          <legend className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 w-full">
            2. Detalles de Suscripción
          </legend>

          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-fit mb-6">
            <button
              type="button"
              onClick={() => setModoFecha('automatico')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                modoFecha === 'automatico'
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Automático (Planes)
            </button>
            <button
              type="button"
              onClick={() => setModoFecha('personalizado')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                modoFecha === 'personalizado'
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Personalizado
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modoFecha === 'automatico' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Plan</label>
                <select value={plan} onChange={(e) => setPlan(e.target.value)} className={inputClasses}>
                  {Object.entries(planes).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Fecha de Inicio {modoFecha === 'personalizado' && <span className="text-red-400">*</span>}</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => { setFechaInicio(e.target.value); limpiarError('fechaInicio') }}
                readOnly={modoFecha === 'automatico'}
                className={modoFecha === 'automatico' ? inputReadOnly : getClase('fechaInicio')}
              />
              {errores.fechaInicio && <p className="text-xs text-red-500 mt-1">Fecha requerida</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Fecha de Fin {modoFecha === 'personalizado' && <span className="text-red-400">*</span>}</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => { setFechaFin(e.target.value); limpiarError('fechaFin') }}
                readOnly={modoFecha === 'automatico'}
                className={modoFecha === 'automatico' ? inputReadOnly : getClase('fechaFin')}
              />
              {errores.fechaFin && <p className="text-xs text-red-500 mt-1">{fechaFin ? 'La fecha fin debe ser posterior al inicio' : 'Fecha requerida'}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Turno</label>
              <select value={turno} onChange={(e) => setTurno(e.target.value)} className={inputClasses}>
                <option value="">Seleccionar turno</option>
                <option value="mañana">Mañana</option>
                <option value="tarde">Tarde</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 w-full">
            3. Datos de Pago
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Monto (S/) <span className="text-red-400">*</span></label>
              <input
                type="text"
                inputMode="numeric"
                value={montoDisplay}
                onChange={handleMontoChange}
                placeholder="S/ 0.00"
                className={getClase('monto')}
              />
              {errores.monto && <p className="text-xs text-red-500 mt-1">Ingresa el monto</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Otros</label>
              <input type="text" value={otros} onChange={(e) => setOtros(e.target.value)} placeholder="Detalle adicional" className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">N° de Recibo</label>
              <input type="text" value={recibo} onChange={(e) => setRecibo(e.target.value)} placeholder="000-0000" className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">N° Boleta Electrónica</label>
              <input type="text" value={boleta} onChange={(e) => setBoleta(e.target.value)} placeholder="BE-000000" className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">N° de Depósito</label>
              <input type="text" value={deposito} onChange={(e) => setDeposito(e.target.value)} placeholder="DEP-000000" className={inputClasses} />
            </div>
          </div>
        </fieldset>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 px-8 font-semibold transition-colors"
          >
            Registrar Suscripción
          </button>
        </div>
      </form>

      {/* COMPROBANTE ELECTRÓNICO (Paso 1) */}
      {ticketExito && (
        <TicketWhatsApp
          ticket={ticketExito}
          onClose={() => {
            setTicketExito(null)
          }}
        />
      )}

      {/* MODAL DE BIENVENIDA Y ENTREGA DE QR (Paso 2) */}
      {nuevoMiembroQR && !ticketExito && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-transparent dark:border-slate-800">

            {/* Cabecera */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-center relative">
              <button
                onClick={cerrarFlujoBienvenida}
                className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 bg-white dark:bg-slate-800 rounded-full p-1 shadow-sm cursor-pointer transition-colors"
              >
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserPlus size={32} />
              </div>
              <h2 className="font-black text-slate-800 dark:text-slate-100 text-2xl tracking-tight">Inscripcion Exitosa!</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Entrega el pase de acceso al nuevo miembro.</p>
            </div>

            {/* Contenedor del QR (se descarga como imagen) */}
            <div className="p-8 flex flex-col items-center justify-center bg-white" ref={qrBienvenidaRef}>
              <h3 className="font-bold text-slate-800 text-xl mb-1">{nuevoMiembroQR.nombre}</h3>
              <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-6">ID: {nuevoMiembroQR.codigoQR}</p>
              <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm inline-block">
                <QRCode value={nuevoMiembroQR.codigoQR || 'ERROR'} size={180} level="H" />
              </div>
              <p className="text-[10px] text-slate-400 mt-4 font-bold tracking-wider">TRAMUSA S.A. - PASE OFICIAL</p>
            </div>

            {/* Botones de accion */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <button
                onClick={descargarQRBienvenida}
                className="w-full bg-slate-800 dark:bg-slate-200 hover:bg-slate-700 dark:hover:bg-slate-300 text-white dark:text-slate-900 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <Download size={18} /> Descargar QR de {nuevoMiembroQR.nombre.split(' ')[0]}
              </button>

              <button
                onClick={enviarQRWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <Send size={18} /> Enviar por WhatsApp
              </button>

              <button
                onClick={cerrarFlujoBienvenida}
                className="w-full text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium py-2 text-sm transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL MINIMALISTA DE ADVERTENCIA WHATSAPP */}
      {mostrarAlertaWA && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center border border-transparent dark:border-slate-800">

            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Advertencia Importante</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Recuerda adjuntar la imagen del QR que acabas de descargar junto con este mensaje para <span className="font-bold text-slate-700 dark:text-slate-200">{nuevoMiembroQR?.nombre}</span>.
              <br /><br />
              ¿Ya descargaste el QR y deseas continuar a WhatsApp?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setMostrarAlertaWA(false)}
                className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEnvioWA}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Aceptar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
