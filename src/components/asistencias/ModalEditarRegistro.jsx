import { useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { inputClasses } from '../../utils/constants'

export default function ModalEditarRegistro({ registro, onGuardar, onEliminar, onCerrar }) {
  const [titulo, setTitulo] = useState(registro.titulo)

  const montoMatch = registro.detalle.match(/S\/\s*([0-9.]+)/)
  const [monto, setMonto] = useState(montoMatch ? montoMatch[1] : '')

  const planMatch = registro.detalle.match(/Plan:\s*([A-Za-z0-9 ()áéíóú]+)(?=\s*-|$)/)
  const [plan, setPlan] = useState(planMatch ? planMatch[1].trim() : '')

  function handleGuardar() {
    let nuevoDetalle = registro.detalle
    if (monto !== '') {
      const montoVal = parseFloat(monto) || 0
      nuevoDetalle = nuevoDetalle.replace(/S\/\s*[0-9.]+/, `S/ ${montoVal.toFixed(2)}`)
    }
    if (plan !== '') {
      nuevoDetalle = nuevoDetalle.replace(/Plan:\s*([A-Za-z0-9 ()áéíóú]+)(?=\s*-|$)/, `Plan: ${plan}`)
    }
    onGuardar(registro.id, titulo, nuevoDetalle)
  }

  function handleEliminar() {
    if (window.confirm('¿Estás seguro de eliminar este registro del historial?')) {
      onEliminar(registro.id)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-slate-50 p-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Editar Registro</h3>
          <button
            type="button"
            onClick={onCerrar}
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
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className={inputClasses}
            />
          </div>
          {plan !== '' && (
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Tipo de Plan</label>
              <select value={plan} onChange={(e) => setPlan(e.target.value)} className={inputClasses}>
                <option value="Mensual (1 mes)">Mensual (1 mes)</option>
                <option value="Trimestral (3 meses)">Trimestral (3 meses)</option>
                <option value="Semestral (6 meses)">Semestral (6 meses)</option>
                <option value="Mensual">Mensual (Solo texto)</option>
                <option value="Trimestral">Trimestral (Solo texto)</option>
                <option value="Semestral">Semestral (Solo texto)</option>
              </select>
            </div>
          )}
          {monto !== '' && (
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Monto Cobrado</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">S/</span>
                <input
                  type="number"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
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
            onClick={handleEliminar}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} />
            Eliminar Registro
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCerrar}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleGuardar}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 px-6 font-semibold transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
