import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Logo } from './Logo';
import { ConsultaIA } from './ConsultaIA';
import { ReporteIncidentes } from './ReporteIncidentes';
import { InspeccionesSST } from './InspeccionesSST';

interface DashboardProps {
  user: any;
}

export const Dashboard = ({ user }: DashboardProps) => {
  const [tabActiva, setTabActiva] = useState<'inicio' | 'ia' | 'reportes' | 'inspecciones'>('inicio');

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra de navegación superior */}
      <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Logo />
          {/* Menú de Navegación */}
          <div className="flex space-x-2">
            <button
              onClick={() => setTabActiva('inicio')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                tabActiva === 'inicio'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => setTabActiva('ia')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                tabActiva === 'ia'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Asistente IA
            </button>
            <button
              onClick={() => setTabActiva('reportes')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                tabActiva === 'reportes'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reporte Incidentes
            </button>
            <button
              onClick={() => setTabActiva('inspecciones')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                tabActiva === 'inspecciones'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Inspecciones SST
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 hidden md:inline">
            {user?.user_metadata?.full_name || user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido según la pestaña activa */}
      <main className="max-w-7xl mx-auto py-8 px-6">
        {tabActiva === 'inicio' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Bienvenido a la Plataforma SST
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Asistente IA</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Consulta normatividad y recomendaciones de seguridad con el motor de IA.
                </p>
                <button
                  onClick={() => setTabActiva('ia')}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Ir al Asistente →
                </button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Reporte de Incidentes</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Registra y realiza seguimiento a condiciones o actos inseguros.
                </p>
                <button
                  onClick={() => setTabActiva('reportes')}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Ir a Reportes →
                </button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Inspecciones SST</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Diligencia listas de chequeo y verificaciones en campo.
                </p>
                <button
                  onClick={() => setTabActiva('inspecciones')}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Ir a Inspecciones →
                </button>
              </div>
            </div>
          </div>
        )}

        {tabActiva === 'ia' && <ConsultaIA />}
        {tabActiva === 'reportes' && <ReporteIncidentes />}
        {tabActiva === 'inspecciones' && <InspeccionesSST />}
      </main>
    </div>
  );
};