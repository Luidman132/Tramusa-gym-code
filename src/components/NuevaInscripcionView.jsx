import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { formatDate, addMonths } from '../utils/helpers'
import { inputClasses, inputErrorClasses, inputReadOnly, planes } from '../utils/constants'
import { useToast } from '../context/ToastContext'
import { useGym } from '../context/GymContext'

export default function NuevaInscripcionView() {
  const { mostrarToast } = useToast()
  const { agregarMiembro, agregarRegistro } = useGym()
  const navigate = useNavigate()

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
  const [otros, setOtros] = useState('')
  const [recibo, setRecibo] = useState('')
  const [boleta, setBoleta] = useState('')
  const [deposito, setDeposito] = useState('')

  const [errores, setErrores] = useState({})

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

    const nombrePlan = modoFecha === 'automatico' ? planes[plan].label.split(' ')[0] : 'Personalizado'
    const [yi, mi, di] = fechaInicio.split('-')
    const [yf, mf, df] = fechaFin.split('-')

    agregarMiembro({
      dni: numDoc,
      nombre: `${nombre.trim()} ${apellido.trim()}`,
      celular,
      plan: nombrePlan,
      estado: 'activo',
      inicio: `${di}/${mi}/${yi}`,
      fin: `${df}/${mf}/${yf}`,
      contactoNombre: contactoNombre || undefined,
      contactoTelefono: contactoTelefono || undefined,
      turno: turno || undefined,
    })

    if (monto) {
      agregarRegistro({
        tipo: 'cobro',
        titulo: `Inscripcion: ${nombre.trim()} ${apellido.trim()}`,
        detalle: `Plan: ${nombrePlan} - Pago: S/ ${parseFloat(monto).toFixed(2)}`,
      })
    }

    mostrarToast(`${nombre.trim()} ${apellido.trim()} inscrito correctamente`)
    navigate('/suscripciones')
  }

  function getClase(campo) {
    return errores[campo] ? inputErrorClasses : inputClasses
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Nueva Inscripción</h2>
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors no-underline"
        >
          <ArrowLeft size={16} />
          Volver
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mt-6 space-y-8">
        <fieldset>
          <legend className="text-sm font-semibold text-slate-800 mb-4">Información Personal</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Nombre(s) <span className="text-red-400">*</span></label>
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
              <label className="block text-sm text-slate-600 mb-1.5">Apellido(s) <span className="text-red-400">*</span></label>
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
              <label className="block text-sm text-slate-600 mb-1.5">Documento de Identidad <span className="text-red-400">*</span></label>
              <div className={`flex rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-red-100 focus-within:border-red-400 ${errores.numDoc ? 'border border-red-300 bg-red-50' : 'border border-slate-200'}`}>
                <select
                  value={tipoDoc}
                  onChange={(e) => setTipoDoc(e.target.value)}
                  className="bg-slate-50 text-sm text-slate-700 py-2.5 px-3 border-r border-slate-200 focus:outline-none"
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
                  className={`flex-1 text-sm text-slate-700 py-2.5 px-4 placeholder:text-slate-400 focus:outline-none ${errores.numDoc ? 'bg-red-50' : 'bg-slate-50'}`}
                />
              </div>
              {errores.numDoc && <p className="text-xs text-red-500 mt-1">{numDoc.trim() ? 'DNI debe tener 8 dígitos' : 'Campo obligatorio'}</p>}
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">N° de Celular <span className="text-red-400">*</span></label>
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
          <h3 className="text-lg font-semibold text-slate-700 mt-8 mb-4 border-b border-slate-100 pb-2">Contacto de Emergencia</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Nombre del Contacto</label>
              <input
                type="text"
                value={contactoNombre}
                onChange={(e) => setContactoNombre(e.target.value)}
                placeholder="Ej. María López"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Teléfono de Emergencia</label>
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
          <legend className="text-sm font-semibold text-slate-800 mb-4">Detalles de Suscripción</legend>

          <div className="flex bg-slate-100 rounded-lg p-1 w-fit mb-6">
            <button
              type="button"
              onClick={() => setModoFecha('automatico')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                modoFecha === 'automatico'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Automático (Planes)
            </button>
            <button
              type="button"
              onClick={() => setModoFecha('personalizado')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                modoFecha === 'personalizado'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Personalizado
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modoFecha === 'automatico' && (
              <div>
                <label className="block text-sm text-slate-600 mb-1.5">Plan</label>
                <select value={plan} onChange={(e) => setPlan(e.target.value)} className={inputClasses}>
                  {Object.entries(planes).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Fecha de Inicio {modoFecha === 'personalizado' && <span className="text-red-400">*</span>}</label>
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
              <label className="block text-sm text-slate-600 mb-1.5">Fecha de Fin {modoFecha === 'personalizado' && <span className="text-red-400">*</span>}</label>
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
              <label className="block text-sm text-slate-600 mb-1.5">Turno</label>
              <select value={turno} onChange={(e) => setTurno(e.target.value)} className={inputClasses}>
                <option value="">Seleccionar turno</option>
                <option value="mañana">Mañana</option>
                <option value="tarde">Tarde</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-slate-800 mb-4">Datos de Pago</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Monto (S/) <span className="text-red-400">*</span></label>
              <input
                type="number"
                value={monto}
                onChange={(e) => { setMonto(e.target.value); limpiarError('monto') }}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={getClase('monto')}
              />
              {errores.monto && <p className="text-xs text-red-500 mt-1">Ingresa el monto</p>}
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Otros</label>
              <input type="text" value={otros} onChange={(e) => setOtros(e.target.value)} placeholder="Detalle adicional" className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">N° de Recibo</label>
              <input type="text" value={recibo} onChange={(e) => setRecibo(e.target.value)} placeholder="000-0000" className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">N° Boleta Electrónica</label>
              <input type="text" value={boleta} onChange={(e) => setBoleta(e.target.value)} placeholder="BE-000000" className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">N° de Depósito</label>
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
    </div>
  )
}
