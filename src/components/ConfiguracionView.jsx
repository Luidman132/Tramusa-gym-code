import { useState } from 'react'
import { Building2, MessageCircle } from 'lucide-react'
import { inputClasses } from '../utils/constants'
import { useToast } from '../context/ToastContext'

export default function ConfiguracionView() {
  const { mostrarToast } = useToast()

  const [config, setConfig] = useState({
    nombreGimnasio: 'TRAMUSA S.A.',
    moneda: 'Soles (S/)',
    direccion: 'Av. Machupicchu s/n, Cusco',
    telefono: '+51 999 888 777',
    mensajeTicket: 'Gracias por entrenar con nosotros! Recuerda traer tu toalla.',
    plantillaBienvenida: 'Hola {nombre}! Bienvenido a {gimnasio}. Tu pase de acceso es: {codigoQR}. A darle con todo!',
    plantillaVencimiento: 'Hola {nombre}, te recordamos que tu plan {plan} acaba de vencer. Te esperamos para renovarlo!',
  })

  function handleChange(e) {
    setConfig(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleGuardar(e) {
    e.preventDefault()
    mostrarToast('Configuracion guardada con exito')
  }

  return (
    <div className="p-8 max-w-5xl mx-auto pb-12">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight mb-6">Configuracion del Sistema</h2>

      <form onSubmit={handleGuardar} className="space-y-6">

        {/* TARJETA 1: DATOS DEL NEGOCIO */}
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Building2 size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Datos del Negocio (Tickets y Recibos)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nombre Oficial</label>
              <input type="text" name="nombreGimnasio" value={config.nombreGimnasio} onChange={handleChange} className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Moneda Principal</label>
              <select name="moneda" value={config.moneda} onChange={handleChange} className={inputClasses}>
                <option value="Soles (S/)">Soles (S/)</option>
                <option value="Dolares ($)">Dolares ($)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Direccion Local</label>
              <input type="text" name="direccion" value={config.direccion} onChange={handleChange} className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Telefono / WhatsApp de Contacto</label>
              <input type="text" name="telefono" value={config.telefono} onChange={handleChange} className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Mensaje al pie del ticket</label>
              <input type="text" name="mensajeTicket" value={config.mensajeTicket} onChange={handleChange} placeholder="Ej: Gracias por tu preferencia!" className={inputClasses} />
            </div>
          </div>
        </div>

        {/* TARJETA 2: PLANTILLAS DE WHATSAPP */}
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <MessageCircle size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Plantillas de WhatsApp</h3>
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 ml-[52px]">
            Usa variables como <code className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded text-xs font-bold">{'{nombre}'}</code>, <code className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded text-xs font-bold">{'{codigoQR}'}</code>, <code className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded text-xs font-bold">{'{plan}'}</code> o <code className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded text-xs font-bold">{'{gimnasio}'}</code>.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Mensaje de Bienvenida (Nueva Inscripcion)</label>
              <textarea name="plantillaBienvenida" value={config.plantillaBienvenida} onChange={handleChange} rows="3" className={`${inputClasses} resize-none`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Mensaje de Vencimiento de Plan</label>
              <textarea name="plantillaVencimiento" value={config.plantillaVencimiento} onChange={handleChange} rows="3" className={`${inputClasses} resize-none`} />
            </div>
          </div>
        </div>

        {/* BOTON GUARDAR */}
        <div className="flex justify-end pt-2">
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-sm">
            Guardar Cambios
          </button>
        </div>

      </form>
    </div>
  )
}
