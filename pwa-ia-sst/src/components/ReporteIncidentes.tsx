import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Incidente {
  id: string;
  tipo: string;
  ubicacion: string;
  descripcion: string;
  nivel_riesgo: string;
  estado: string;
  created_at: string;
}

export const ReporteIncidentes = () => {
  const [tipo, setTipo] = useState('Condición Insegura');
  const [ubicacion, setUbicacion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [nivelRiesgo, setNivelRiesgo] = useState('Medio');
  const [loading, setLoading] = useState(false);
  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  // Cargar incidentes al montar el componente
  useEffect(() => {
    cargarIncidentes();
  }, []);

  const cargarIncidentes = async () => {
    const { data, error } = await supabase
      .from('incidentes')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setIncidentes(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ubicacion.trim() || !descripcion.trim()) return;

    setLoading(true);
    setMensaje(null);

    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase.from('incidentes').insert([
      {
        user_id: userData.user?.id,
        tipo,
        ubicacion,
        descripcion,
        nivel_riesgo: nivelRiesgo,
      },
    ]);

    setLoading(false);

    if (error) {
      setMensaje({ tipo: 'error', texto: 'Error al registrar el reporte: ' + error.message });
    } else {
      setMensaje({ tipo: 'exito', texto: '¡Reporte registrado exitosamente!' });
      setUbicacion('');
      setDescripcion('');
      cargarIncidentes(); // Recargar lista
    }
  };

  return (
    <div className="space-y-8">
      {/* Formulario de Registro */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Reporte de Incidentes SST</h2>
        <p className="text-sm text-gray-500 mb-6">
          Registra actos o condiciones inseguras detectadas en tu área de trabajo.
        </p>

        {mensaje && (
          <div
            className={`p-4 rounded-lg mb-6 text-sm font-medium ${
              mensaje.tipo === 'exito' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Reporte</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Condición Insegura">Condición Insegura</option>
                <option value="Acto Inseguro">Acto Inseguro</option>
                <option value="Casi-Accidente">Casi-Accidente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Riesgo</label>
              <select
                value={nivelRiesgo}
                onChange={(e) => setNivelRiesgo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Bajo">Bajo</option>
                <option value="Medio">Medio</option>
                <option value="Alto">Alto</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación / Área</label>
            <input
              type="text"
              required
              placeholder="Ej. Planta de producción - Zona B"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del Hallazgo</label>
            <textarea
              required
              rows={3}
              placeholder="Describe detalladamente la situación observada..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? 'Guardando...' : 'Guardar Reporte'}
          </button>
        </form>
      </div>

      {/* Historial de Reportes */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Historial de Reportes</h3>
        
        {incidentes.length === 0 ? (
          <p className="text-sm text-gray-500">No hay reportes registrados aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Ubicación</th>
                  <th className="p-3">Descripción</th>
                  <th className="p-3">Riesgo</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {incidentes.map((inc) => (
                  <tr key={inc.id} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">{inc.tipo}</td>
                    <td className="p-3 text-gray-600">{inc.ubicacion}</td>
                    <td className="p-3 text-gray-600 max-w-xs truncate">{inc.descripcion}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          inc.nivel_riesgo === 'Alto'
                            ? 'bg-red-100 text-red-700'
                            : inc.nivel_riesgo === 'Medio'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {inc.nivel_riesgo}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                        {inc.estado}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400 text-xs">
                      {new Date(inc.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};