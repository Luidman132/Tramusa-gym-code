import { inputClasses } from '../utils/constants'

export default function ConfiguracionView() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Configuración del Sistema</h2>
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-800 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nombre del Gimnasio</label>
            <input type="text" defaultValue="TRAMUSA S.A." className={inputClasses} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Moneda Principal</label>
            <select className={inputClasses}>
              <option>Soles (S/)</option>
              <option>Dólares ($)</option>
            </select>
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">Guardar Cambios</button>
        </div>
      </div>
    </div>
  )
}
