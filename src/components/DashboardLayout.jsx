import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, UserPlus, CreditCard, CalendarCheck, CalendarDays, BarChart3, Bell, Check, BellOff, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const logoTramusa = '/logo_empresa_tramusa.svg'

const menuItems = [
  { name: 'Inicio', path: '/', icon: Home },
  { name: 'Asistencias', path: '/asistencias', icon: CalendarCheck },
  { name: 'Nueva Inscripción', path: '/nueva-inscripcion', icon: UserPlus },
  { name: 'Suscripciones', path: '/suscripciones', icon: CreditCard },
  { name: 'Calendario', path: '/calendario', icon: CalendarDays },
  { name: 'Reportes', path: '/reportes', icon: BarChart3 },
]

function formatDateTime(date) {
  const day = date.getDate()
  const month = date.toLocaleDateString('es-ES', { month: 'short' })
  const year = date.getFullYear()
  const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })
  return `${day} ${month} ${year} • ${time}`
}

export default function DashboardLayout({ children }) {
  const { darkMode, toggleDarkMode } = useTheme()
  const location = useLocation()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificaciones, setNotificaciones] = useState([])
  const dropdownRef = useRef(null)

  const activeItem = menuItems.find((i) => i.path === location.pathname)
  const isHome = location.pathname === '/'

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
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <aside className="w-64 bg-white dark:bg-slate-900 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:shadow-none dark:border-r dark:border-slate-800 flex flex-col transition-colors">
        <div className="px-6 py-8 flex items-center">
          <img src={logoTramusa} alt="Tramusa Gym" className="w-auto h-36" />
        </div>

        <nav className="flex-1 px-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`w-full text-left py-2.5 px-4 rounded-2xl text-sm transition-all flex items-center gap-3 ${
                    location.pathname === item.path
                      ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 font-semibold'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

      </aside>

      <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
        <header className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm dark:shadow-none dark:border dark:border-slate-800 px-8 py-5 flex items-center justify-between transition-colors">
          <h2 className="text-slate-800 dark:text-slate-100 text-lg font-semibold">
            {isHome ? 'Panel Principal' : activeItem?.name || 'Panel Principal'}
          </h2>

          <div className="flex items-center gap-5">
            <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              {formatDateTime(currentTime)}
            </span>

            <button
              onClick={toggleDarkMode}
              className="relative p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all hover:scale-105"
              aria-label="Alternar modo oscuro"
            >
              {darkMode ? <Sun size={20} className="animate-[themeSpin_0.5s_ease-out]" /> : <Moon size={20} className="animate-[themeSpin_0.5s_ease-out]" />}
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <Bell size={20} />
                {noLeidas > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-3 w-80 z-50 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-slate-800 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Notificaciones</h3>
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
                      <div className="px-5 py-8 flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
                        <BellOff size={24} />
                        <span className="text-sm">No hay alertas pendientes</span>
                      </div>
                    ) : (
                      notificaciones
                        .filter((n) => !n.leido)
                        .map((n) => (
                          <div
                            key={n.id}
                            className="px-5 py-3.5 border-b border-slate-50 dark:border-slate-800/50 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <span
                              className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                                n.tipo === 'danger' ? 'bg-red-500' : 'bg-amber-500'
                              }`}
                            />
                            <p className="text-sm text-slate-700 dark:text-slate-300 flex-1">{n.texto}</p>
                            <button
                              onClick={() => marcarComoLeido(n.id)}
                              className="shrink-0 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
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

      {!isHome && (
        <Link
          to="/"
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-full font-medium shadow-lg shadow-red-600/20 dark:shadow-none hover:-translate-y-1 hover:shadow-xl hover:bg-red-700 transition-all duration-300"
        >
          <Home size={18} />
          Inicio
        </Link>
      )}
    </div>
  )
}
