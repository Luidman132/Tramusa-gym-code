import { UserPlus, ClipboardCheck, BarChart3, Search } from 'lucide-react'

const quickActions = [
  {
    label: 'Nueva Inscripción',
    icon: UserPlus,
    accent: 'text-red-600',
    iconBg: 'bg-red-50',
    vista: 'nueva_inscripcion',
  },
  {
    label: 'Registrar Asistencia',
    icon: ClipboardCheck,
    accent: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    vista: 'asistencias',
  },
  {
    label: 'Ver Resumen',
    icon: BarChart3,
    accent: 'text-blue-600',
    iconBg: 'bg-blue-50',
    vista: 'finanzas',
  },
]

export default function DashboardHome({ userName = 'Dima', setVistaActual }) {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Hola, {userName} 👋
        </h1>
        <p className="text-slate-500 mt-2">¿Qué haremos hoy?</p>
      </div>

      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
        <input
          type="text"
          placeholder="Buscar miembro, plan o acción..."
          className="w-full bg-slate-50 rounded-2xl py-4 pl-14 pr-6 text-base text-slate-700 placeholder:text-slate-400 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => setVistaActual?.(action.vista)}
            className="bg-white border border-slate-100 rounded-2xl p-8 min-h-[160px] flex items-center gap-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer text-left"
          >
            <div className={`${action.iconBg} ${action.accent} p-4 rounded-xl shrink-0`}>
              <action.icon size={28} />
            </div>
            <span className={`text-xl font-bold ${action.accent}`}>
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
