import { useState, useEffect } from 'react'
import { Building2, MessageCircle, Save, Loader2 } from 'lucide-react'
import { inputClasses } from '../utils/constants'
import { useToast } from '../context/ToastContext'
import { useGym } from '../context/GymContext'

export default function ConfiguracionView() {
  const { mostrarToast } = useToast()
  const { configuracion, guardarConfiguracion } = useGym()
  const [guardando, setGuardando] = useState(false)

  const [form, setForm] = useState({
    nombre_gimnasio: '',
    moneda: 'S/',
    direccion: '',
    telefono: '',
    mensaje_ticket: '',
    plantilla_bienvenida: '',
    plantilla_vencimiento: '',
  })

  // Sincronizar con el contexto cuando cargue la config de la BD
  useEffect(() => {
    if (configuracion) {
      setForm({
        nombre_gimnasio: configuracion.nombre_gimnasio || '',
        moneda: configuracion.moneda || 'S/',
        direccion: configuracion.direccion || '',
        telefono: configuracion.telefono || '',
        mensaje_ticket: configuracion.mensaje_ticket || '',
        plantilla_bienvenida: configuracion.plantilla_bienvenida || '',
        plantilla_vencimiento: configuracion.plantilla_vencimiento || '',
      })
    }
  }, [configuracion])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleGuardar(e) {
    e.preventDefault()
    if (!form.nombre_gimnasio.trim()) {
      mostrarToast('El nombre del gimnasio es obligatorio', 'error')
      return
    }
    setGuardando(true)
    const result = await guardarConfiguracion(form)
    setGuardando(false)
    if (result.success) {
      mostrarToast('Configuracion guardada con exito')
    } else {
      mostrarToast(result.mensaje || 'Error al guardar', 'error')
    }
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nombre Oficial <span className="text-red-400">*</span></label>
              <input type="text" name="nombre_gimnasio" value={form.nombre_gimnasio} onChange={handleChange} className={inputClasses} placeholder="Ej: Mi Gimnasio S.A." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Moneda Principal</label>
              <select name="moneda" value={form.moneda} onChange={handleChange} className={inputClasses}>
                <option value="S/">Soles (S/)</option>
                <option value="$">Dólares ($)</option>
                <option value="€">Euros (€)</option>
                <option value="Bs.">Bolivianos (Bs.)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Direccion Local</label>
              <input type="text" name="direccion" value={form.direccion} onChange={handleChange} className={inputClasses} placeholder="Ej: Av. Principal 123, Ciudad" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Telefono / WhatsApp de Contacto</label>
              <input type="text" name="telefono" value={form.telefono} onChange={handleChange} className={inputClasses} placeholder="+51 999 888 777" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Mensaje al pie del ticket</label>
              <input type="text" name="mensaje_ticket" value={form.mensaje_ticket} onChange={handleChange} placeholder="Ej: Gracias por tu preferencia!" className={inputClasses} />
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
              <textarea name="plantilla_bienvenida" value={form.plantilla_bienvenida} onChange={handleChange} rows="3" className={`${inputClasses} resize-none`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Mensaje de Vencimiento de Plan</label>
              <textarea name="plantilla_vencimiento" value={form.plantilla_vencimiento} onChange={handleChange} rows="3" className={`${inputClasses} resize-none`} />
            </div>
          </div>
        </div>

        {/* BOTON GUARDAR */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={guardando}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-sm flex items-center gap-2"
          >
            {guardando ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {guardando ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

      </form>
    </div>
  )
}
