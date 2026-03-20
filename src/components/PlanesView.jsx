import { useState } from 'react'
import { Plus, Edit2, Power, CheckCircle2, X } from 'lucide-react'
import { inputClasses } from '../utils/constants'
import { CurrencyInput } from './CurrencyInput'

export default function PlanesView() {
  const [planes, setPlanes] = useState([
    { id: 1, nombre: 'Mensual', precio: 90, duracion: '1 mes', activo: true },
    { id: 2, nombre: 'Trimestral', precio: 250, duracion: '3 meses', activo: true },
    { id: 3, nombre: 'Semestral', precio: 450, duracion: '6 meses', activo: true },
    { id: 4, nombre: 'Pase por Día', precio: 15, duracion: '1 día', activo: true },
    { id: 5, nombre: 'Promo Verano VIP', precio: 160, duracion: '2 meses', activo: false },
  ])

  const [mostrarModal, setMostrarModal] = useState(false)
  const [planEditando, setPlanEditando] = useState(null)
  const [formNombre, setFormNombre] = useState('')
  const [formPrecio, setFormPrecio] = useState('')
  const [formDuracion, setFormDuracion] = useState('')

  function toggleActivo(id) {
    setPlanes(prev => prev.map(p => p.id === id ? { ...p, activo: !p.activo } : p))
  }

  function abrirModalCrear() {
    setPlanEditando(null)
    setFormNombre('')
    setFormPrecio('')
    setFormDuracion('')
    setMostrarModal(true)
  }

  function abrirModalEditar(plan) {
    setPlanEditando(plan)
    setFormNombre(plan.nombre)
    setFormPrecio(String(plan.precio))
    setFormDuracion(plan.duracion)
    setMostrarModal(true)
  }

  function guardarPlan() {
    if (!formNombre.trim() || !formPrecio || !formDuracion.trim()) return

    const precio = parseFloat(formPrecio) || 0

    if (planEditando) {
      setPlanes(prev => prev.map(p =>
        p.id === planEditando.id
          ? { ...p, nombre: formNombre.trim(), precio, duracion: formDuracion.trim() }
          : p
      ))
    } else {
      setPlanes(prev => [...prev, {
        id: Date.now(),
        nombre: formNombre.trim(),
        precio,
        duracion: formDuracion.trim(),
        activo: true,
      }])
    }

    setMostrarModal(false)
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Gestión de Planes y Precios</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Botón Crear Nuevo Plan */}
        <button
          onClick={abrirModalCrear}
          className="bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-500/50 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all min-h-[250px] group"
        >
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:bg-red-100 dark:group-hover:bg-red-500/20 flex items-center justify-center mb-3 transition-colors">
            <Plus size={28} className="group-hover:scale-110 transition-transform" />
          </div>
          <span className="font-semibold text-sm">Crear Nuevo Plan</span>
        </button>

        {/* Tarjetas de Planes */}
        {planes.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl shadow-sm dark:shadow-none border p-6 flex flex-col transition-all ${
              plan.activo
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-70'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">{plan.nombre}</h3>
              {plan.activo ? (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                  <CheckCircle2 size={12} />
                  Activo
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 border border-red-100 dark:border-red-500/20">
                  Inactivo
                </span>
              )}
            </div>

            {/* Precio */}
            <p className="text-3xl font-black text-slate-800 dark:text-slate-100 my-4">
              S/ {plan.precio.toFixed(2)}
            </p>

            {/* Duración */}
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Duración: <span className="font-semibold text-slate-600 dark:text-slate-300">{plan.duracion}</span>
            </p>

            {/* Acciones */}
            <div className="mt-auto flex items-center gap-3">
              <button
                onClick={() => abrirModalEditar(plan)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm rounded-xl transition-colors"
              >
                <Edit2 size={15} />
                Editar
              </button>
              <button
                onClick={() => toggleActivo(plan.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 font-semibold text-sm rounded-xl transition-colors ${
                  plan.activo
                    ? 'bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    : 'bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                <Power size={15} />
                {plan.activo ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Crear / Editar */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-transparent dark:border-slate-800">
            {/* Header */}
            <div className="bg-slate-50 dark:bg-slate-800 px-6 py-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {planEditando ? 'Editar Plan' : 'Crear Nuevo Plan'}
              </h3>
              <button
                type="button"
                onClick={() => setMostrarModal(false)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Formulario */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Nombre del Plan
                </label>
                <input
                  type="text"
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  placeholder="Ej: Plan Mensual"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Precio
                </label>
                <CurrencyInput value={formPrecio} onChange={setFormPrecio} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Duración
                </label>
                <input
                  type="text"
                  value={formDuracion}
                  onChange={(e) => setFormDuracion(e.target.value)}
                  placeholder="Ej: 1 mes, 3 meses, 1 día"
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setMostrarModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={guardarPlan}
                disabled={!formNombre.trim() || !formPrecio || !formDuracion.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl py-2.5 px-6 font-semibold text-sm transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
