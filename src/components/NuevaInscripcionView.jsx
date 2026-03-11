import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'

const inputClasses = 'w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all'
const inputReadOnly = 'w-full bg-slate-100 border border-slate-200 rounded-lg py-2.5 px-4 text-sm text-slate-500 cursor-not-allowed'

function formatDate(date) {
  return date.toISOString().split('T')[0]
}

function addMonths(date, months) {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

const planes = {
  mensual: { label: 'Mensual (1 mes)', meses: 1 },
  trimestral: { label: 'Trimestral (3 meses)', meses: 3 },
  semestral: { label: 'Semestral (6 meses)', meses: 6 },
}

export default function NuevaInscripcionView({ setVistaActual }) {
  const [tipoDoc, setTipoDoc] = useState('dni')
  const [numDoc, setNumDoc] = useState('')
  const [modoFecha, setModoFecha] = useState('automatico')
  const [plan, setPlan] = useState('mensual')
  const [fechaInicio, setFechaInicio] = useState(formatDate(new Date()))
  const [fechaFin, setFechaFin] = useState('')

  useEffect(() => {
    if (modoFecha === 'automatico') {
      const hoy = new Date()
      const inicio = formatDate(hoy)
      const fin = formatDate(addMonths(hoy, planes[plan].meses))
      setFechaInicio(inicio)
      setFechaFin(fin)
    }
  }, [modoFecha, plan])

  function handleSubmit(e) {
    e.preventDefault()
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Nueva Inscripción</h2>
        <button
          onClick={() => setVistaActual('inicio')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Volver
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mt-6 space-y-8">
        <fieldset>
          <legend className="text-sm font-semibold text-slate-800 mb-4">Información Personal</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Nombre(s)</label>
              <input type="text" placeholder="Ej. Carlos" className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Apellido(s)</label>
              <input type="text" placeholder="Ej. López Mendoza" className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Documento de Identidad</label>
              <div className="flex border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-red-100 focus-within:border-red-400">
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
                  onChange={(e) => setNumDoc(e.target.value)}
                  placeholder="Número de documento"
                  className="flex-1 bg-slate-50 text-sm text-slate-700 py-2.5 px-4 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">N° de Celular</label>
              <input type="tel" placeholder="999 999 999" className={inputClasses} />
            </div>
          </div>
        </fieldset>

        <div>
          <h3 className="text-lg font-semibold text-slate-700 mt-8 mb-4 border-b border-slate-100 pb-2">Contacto de Emergencia</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Nombre del Contacto</label>
              <input type="text" placeholder="Ej. María López" className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Teléfono de Emergencia</label>
              <input type="tel" placeholder="999 999 999" className={inputClasses} />
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
              <label className="block text-sm text-slate-600 mb-1.5">Fecha de Inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                readOnly={modoFecha === 'automatico'}
                className={modoFecha === 'automatico' ? inputReadOnly : inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Fecha de Fin</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                readOnly={modoFecha === 'automatico'}
                className={modoFecha === 'automatico' ? inputReadOnly : inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Turno</label>
              <select className={inputClasses}>
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
              <label className="block text-sm text-slate-600 mb-1.5">Monto Reciente (S/)</label>
              <input type="number" placeholder="0.00" step="0.01" className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Otros</label>
              <input type="text" placeholder="Detalle adicional" className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">N° de Recibo</label>
              <input type="text" placeholder="000-0000" className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">N° Boleta Electrónica</label>
              <input type="text" placeholder="BE-000000" className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">N° de Depósito</label>
              <input type="text" placeholder="DEP-000000" className={inputClasses} />
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
