import { useState, useEffect, useRef } from 'react'
import { Home, Users, CreditCard, CalendarCheck, DollarSign, ClipboardList, Settings, Bell, Check, BellOff } from 'lucide-react'

const logoTramusa = '/logo_empresa_tramusa.svg'

const menuItems = [
  { name: 'Inicio', id: 'inicio', icon: Home },
  { name: 'Miembros', id: 'miembros', icon: Users },
  { name: 'Suscripciones', id: 'suscripciones', icon: CreditCard },
  { name: 'Asistencias', id: 'asistencias', icon: CalendarCheck },
  { name: 'Finanzas', id: 'finanzas', icon: DollarSign },
  { name: 'Planes', id: 'planes', icon: ClipboardList },
  { name: 'Configuración', id: 'configuracion', icon: Settings },
]

const alertasIniciales = [
  { id: 1, texto: 'Suscripción de Juan Pérez vence mañana', tipo: 'warning', leido: false },
  { id: 2, texto: 'Plan de María Gómez vencido hace 3 días', tipo: 'danger', leido: false },
  { id: 3, texto: 'Carlos López tiene pago pendiente', tipo: 'danger', leido: false },
]

function formatDateTime(date) {
  const day = date.getDate()
  const month = date.toLocaleDateString('es-ES', { month: 'short' })
  const year = date.getFullYear()
  const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })
  return `${day} ${month} ${year} • ${time}`
}

export default function DashboardLayout({ children, vistaActual, setVistaActual }) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificaciones, setNotificaciones] = useState(alertasIniciales)
  const dropdownRef = useRef(null)
  const activeLabel = menuItems.find((i) => i.id === vistaActual)?.name

  const noLeidas = notificaciones.filter((n) => !n.leido).length

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function marcarComoLeido(id) {
    setNotificaciones((prev) => prev.map((n) => (n.id === id ? { ...n, leido: true } : n)))
  }

  function marcarTodasLeidas() {
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leido: true })))
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col">
        <div className="px-6 py-8 flex items-center">
          <img src={logoTramusa} alt="Tramusa Gym" className="w-auto h-36" />
        </div>

        <nav className="flex-1 px-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setVistaActual(item.id)}
                  className={`w-full text-left py-2.5 px-4 rounded-2xl text-sm transition-all flex items-center gap-3 ${
                    vistaActual === item.id
                      ? 'bg-red-50 text-red-600 font-semibold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  <item.icon size={18} />
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
        <header className="bg-white rounded-2xl shadow-sm px-8 py-5 flex items-center justify-between">
          <h2 className="text-slate-800 text-lg font-semibold">
            Hola, {activeLabel}
          </h2>

          <div className="flex items-center gap-5">
            <span className="text-lg font-semibold text-slate-700">
              {formatDateTime(currentTime)}
            </span>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <Bell size={20} />
                {noLeidas > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-3 w-80 z-50 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-800">Notificaciones</h3>
                    {noLeidas > 0 && (
                      <button
                        onClick={marcarTodasLeidas}
                        className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                      >
                        Marcar todas como leídas
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {notificaciones.filter((n) => !n.leido).length === 0 ? (
                      <div className="px-5 py-8 flex flex-col items-center gap-2 text-slate-400">
                        <BellOff size={24} />
                        <span className="text-sm">No hay alertas pendientes</span>
                      </div>
                    ) : (
                      notificaciones
                        .filter((n) => !n.leido)
                        .map((n) => (
                          <div
                            key={n.id}
                            className="px-5 py-3.5 border-b border-slate-50 flex items-start gap-3 hover:bg-slate-50 transition-colors"
                          >
                            <span
                              className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                                n.tipo === 'danger' ? 'bg-red-500' : 'bg-amber-500'
                              }`}
                            />
                            <p className="text-sm text-slate-700 flex-1">{n.texto}</p>
                            <button
                              onClick={() => marcarComoLeido(n.id)}
                              className="shrink-0 p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-emerald-600 transition-colors"
                            >
                              <Check size={14} />
                            </button>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto rounded-2xl">
          {children}
        </main>
      </div>

      {vistaActual !== 'inicio' && (
        <button
          onClick={() => setVistaActual('inicio')}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-full font-medium shadow-lg shadow-red-600/20 hover:-translate-y-1 hover:shadow-xl hover:bg-red-700 transition-all duration-300"
        >
          <Home size={18} />
          Inicio
        </button>
      )}
    </div>
  )
}
