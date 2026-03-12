import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react'

const ToastContext = createContext()

const iconos = {
  exito: CheckCircle,
  error: AlertTriangle,
  info: Info,
}

const estilos = {
  exito: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

const estilosIcono = {
  exito: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-blue-500',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const mostrarToast = useCallback((mensaje, tipo = 'exito') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, mensaje, tipo }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  function cerrarToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}

      <div className="fixed top-6 right-6 z-[100] space-y-3 pointer-events-none">
        {toasts.map((toast) => {
          const Icono = iconos[toast.tipo]
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-lg animate-[slideIn_0.3s_ease-out] ${estilos[toast.tipo]}`}
            >
              <Icono size={20} className={estilosIcono[toast.tipo]} />
              <p className="text-sm font-medium flex-1">{toast.mensaje}</p>
              <button
                onClick={() => cerrarToast(toast.id)}
                className="p-1 rounded-full hover:bg-black/5 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
