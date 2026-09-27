import { useState } from 'react';
import { Logo } from './Logo';

export const ConsultaIA = () => {
  const [pregunta, setPregunta] = useState('');
  const [cargando, setCargando] = useState(false);
  const [historialSimulado, setHistorialSimulado] = useState<
    Array<{ id: number; pregunta: string; respuesta: string; nivelRiesgo: string }>
  >([]);

  const suguerencias = [
    "¿Qué EPP es obligatorio para trabajo en alturas según la norma?",
    "¿Cuál es el protocolo en caso de accidente por riesgo eléctrico?",
    "¿Cada cuánto se deben realizar las inspecciones de extintores?"
  ];

  const handleEnviarConsulta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pregunta.trim()) return;

    setCargando(true);

    // Simulación previa a la integración con el backend de Python
    setTimeout(() => {
      const nuevaRespuesta = {
        id: Date.now(),
        pregunta: pregunta,
        respuesta: "Esta es una respuesta simulada del Asistente SST. Próximamente se conectará con el servidor en Python (FastAPI) para consultar normatividades vigentes.",
        nivelRiesgo: "Medio"
      };

      setHistorialSimulado([nuevaRespuesta, ...historialSimulado]);
      setPregunta('');
      setCargando(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado del Módulo */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Asistente de Inteligencia Artificial SST
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Realiza consultas normativas, procedimientos de seguridad y análisis de riesgos en tiempo real.
          </p>
        </div>
        <div className="hidden sm:block">
          <Logo className="h-10 w-10" />
        </div>
      </div>

      {/* Sugerencias Rápidas */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-semibold text-gray-500 self-center">Consultas frecuentes:</span>
        {suguerencias.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setPregunta(item)}
            className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Formulario de Entrada */}
      <form onSubmit={handleEnviarConsulta} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Escribe tu consulta normativa o describe la situación de riesgo:
        </label>
        <textarea
          rows={3}
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          placeholder="Ej: ¿Cuáles son las medidas mínimas preventivas para espacios confinados?"
          className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={cargando || !pregunta.trim()}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {cargando ? 'Analizando...' : 'Consultar Asistente'}
          </button>
        </div>
      </form>

      {/* Resultados de la Consulta */}
      <div className="space-y-4">
        {historialSimulado.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-gray-900 text-base">Pregunta: {item.pregunta}</h3>
              <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md font-medium">
                Riesgo: {item.nivelRiesgo}
              </span>
            </div>
            <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
              {item.respuesta}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};