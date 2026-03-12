export const inputClasses = 'w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all'

export const inputErrorClasses = 'w-full bg-red-50 border border-red-300 rounded-lg py-2.5 px-4 text-sm text-slate-700 placeholder:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all'

export const inputReadOnly = 'w-full bg-slate-100 border border-slate-200 rounded-lg py-2.5 px-4 text-sm text-slate-500 cursor-not-allowed'

export const planes = {
  mensual: { label: 'Mensual (1 mes)', meses: 1 },
  trimestral: { label: 'Trimestral (3 meses)', meses: 3 },
  semestral: { label: 'Semestral (6 meses)', meses: 6 },
}

export const estilosEstado = {
  activo: {
    contenedor: 'bg-emerald-50 border-emerald-200',
    texto: 'text-emerald-800',
    titulo: 'Acceso Permitido',
  },
  vencido: {
    contenedor: 'bg-red-50 border-red-200',
    texto: 'text-red-800',
    titulo: 'Suscripción Vencida',
  },
  pase_activo: {
    contenedor: 'bg-blue-50 border-blue-200',
    texto: 'text-blue-900',
    titulo: 'PASE TEMPORAL ACTIVO',
  },
}
