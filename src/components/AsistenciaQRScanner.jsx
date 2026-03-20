import { Scanner } from '@yudiel/react-qr-scanner';
import { X, QrCode } from 'lucide-react';

export function AsistenciaQRScanner({ onClose, onScanValid }) {

  const handleScanSuccess = (results) => {
    if (results && results[0] && results[0].rawValue) {
      const scannedData = results[0].rawValue;
      onScanValid(scannedData);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 sm:p-6 transition-opacity duration-300">

      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[380px] overflow-hidden flex flex-col max-h-[90vh] border-[6px] border-white relative transition-transform duration-300">

        {/* Botón cerrar */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 shadow-sm transition-colors z-110 cursor-pointer">
          <X size={20} />
        </button>

        {/* Encabezado */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 rounded-t-[2rem]">
          <div className="flex items-center gap-3 justify-center">
            <div className="bg-emerald-100 p-2.5 rounded-2xl border border-emerald-200 shadow-inner">
              <QrCode size={24} className="text-emerald-600" />
            </div>
            <div className="text-center">
              <h2 className="font-extrabold text-slate-800 text-xl leading-tight tracking-tight">Escanear Asistencia</h2>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Acerca el QR del Miembro a la Cámara</p>
            </div>
          </div>
        </div>

        {/* Contenedor de la Cámara */}
        <div className="p-5 flex-1 flex items-center justify-center relative">
          {/* Viewfinder decorativo */}
          <div className="absolute inset-x-8 inset-y-10 border-4 border-emerald-500 rounded-2xl z-10 opacity-70 border-dashed animate-pulse pointer-events-none"></div>

          {/* Cámara real */}
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner border border-slate-100 aspect-square">
            <Scanner
              onScan={handleScanSuccess}
              paused={false}
              styles={{ container: { width: '100%', height: '100%' } }}
              constraints={{ facingMode: 'environment' }}
              onError={(error) => console.error("Error al iniciar la cámara:", error)}
            />
          </div>
        </div>

        {/* Pie de página */}
        <div className="p-6 text-center bg-slate-50 border-t border-slate-100 rounded-b-[2rem]">
          <p className="text-sm font-medium text-slate-600 tracking-tight">Asegúrate de tener buena iluminación para un escaneo rápido.</p>
          <p className="text-[10px] text-slate-400 mt-1">Lector de QR v1.0 | Tramusa Gym</p>
        </div>

      </div>
    </div>
  );
}
