import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Inspeccion {
  id: string;
  tipo_inspeccion: string;
  area_inspeccionada: string;
  inspector_nombre: string;
  estado_general: string;
  hallazgos: string;
  created_at: string;
}

export const InspeccionesSST = () => {
  const [tipoInspeccion, setTipoInspeccion] = useState('Extintores');
  const [area, setArea] = useState('');
  const [inspector, setInspector] = useState('');
  const [hallazgos, setHallazgos] = useState('');
  const [estadoGeneral, setEstadoGeneral] = useState('Aprobado');
  const [loading, setLoading] = useState(false);
  const [inspecciones, setInspecciones] = useState<Inspeccion[]>([]);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  // Lista de chequeo dinámica básica
  const [checkList, setCheckList] = useState([
    { id: 1, item: 'Se encuentra en la ubicación asignada', cumple: true },
    { id: 2, item: 'Acceso despejado y señalizado', cumple: true },
    { id: 3, item: 'Estado físico y presión adecuados', cumple: true },
  ]);

  useEffect(() => {
    cargarInspecciones();
  }, []);

  const cargarInspecciones = async () => {
    const { data, error } = await supabase
      .from('inspecciones')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setInspecciones(data);
    }
  };

  const toggleCheck = (id: number) => {
    setCheckList(
      checkList.map((chk) => (chk.id === id ? { ...chk, cumple: !chk.cumple } : chk))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!area.trim() || !inspector.trim()) return;

    setLoading(true);
    setMensaje(null);

    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase.from('inspecciones').insert([
      {
        user_id: userData.user?.id,
        tipo_inspeccion: tipoInspeccion,
        area_inspeccionada: area,
        inspector_nombre: inspector,
        estado_general: estadoGeneral,
        hallazgos,
        items_verificados: checkList,
      },
    ]);

    setLoading(false);

    if (error) {
      setMensaje({ tipo: 'error', texto: 'Error al registrar la inspección: ' + error.message });
    } else {
      setMensaje({ tipo: 'exito', texto: '¡Inspección registrada exitosamente!' });
      setArea('');
      setInspector('');
      setHallazgos('');
      cargarInspecciones();
    }
  };

  return (
    <div className="space-y-8">
      {/* Formulario de Inspección */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Inspecciones de Seguridad SST</h2>
        <p className="text-sm text-gray-500 mb-6">
          Diligencia las listas de chequeo y verificaciones periódicas en las instalaciones.
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Inspección</label>
              <select
                value={tipoInspeccion}
                onChange={(e) => setTipoInspeccion(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Extintores">Extintores / Emergencia</option>
                <option value="Botiquines">Botiquines de Primeros Auxilios</option>
                <option value="EPP">Equipos de Protección Personal (EPP)</option>
                <option value="Herramientas">Herramientas y Equipos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Área / Sección</label>
              <input
                type="text"
                required
                placeholder="Ej. Oficina Central / Almacén"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inspector / Responsable</label>
              <input
                type="text"
                required
                placeholder="Nombre de quien inspecciona"
                value={inspector}
                onChange={(e) => setInspector(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Lista de Chequeo / Verificaciones */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 my-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Lista de Chequeo Rápida</h4>
            <div className="space-y-2">
              {checkList.map((chk) => (
                <div key={chk.id} className="flex items-center justify-between bg-white p-2.5 rounded border border-gray-200">
                  <span className="text-sm text-gray-700">{chk.item}</span>
                  <button
                    type="button"
                    onClick={() => toggleCheck(chk.id)}
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      chk.cumple ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {chk.cumple ? '✓ Cumple' : '✕ No Cumple'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resultado / Estado General</label>
              <select
                value={estadoGeneral}
                onChange={(e) => setEstadoGeneral(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Aprobado">Aprobado</option>
                <option value="Requiere Acción">Requiere Acción / Mantenimiento</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones / Hallazgos</label>
              <input
                type="text"
                placeholder="Observaciones adicionales..."
                value={hallazgos}
                onChange={(e) => setHallazgos(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? 'Guardando...' : 'Guardar Inspección'}
          </button>
        </form>
      </div>

      {/* Historial de Inspecciones */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Historial de Inspecciones</h3>
        
        {inspecciones.length === 0 ? (
          <p className="text-sm text-gray-500">No hay inspecciones registradas aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Área</th>
                  <th className="p-3">Inspector</th>
                  <th className="p-3">Resultado</th>
                  <th className="p-3">Hallazgos</th>
                  <th className="p-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inspecciones.map((insp) => (
                  <tr key={insp.id} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">{insp.tipo_inspeccion}</td>
                    <td className="p-3 text-gray-600">{insp.area_inspeccionada}</td>
                    <td className="p-3 text-gray-600">{insp.inspector_nombre}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          insp.estado_general === 'Aprobado'
                            ? 'bg-green-100 text-green-700'
                            : insp.estado_general === 'Requiere Acción'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {insp.estado_general}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600 max-w-xs truncate">{insp.hallazgos || '-'}</td>
                    <td className="p-3 text-gray-400 text-xs">
                      {new Date(insp.created_at).toLocaleDateString()}
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