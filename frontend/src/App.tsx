import { useEffect, useMemo, useState, type ReactNode } from "react";
import { getAppData, getHealth } from "./api/client";
import { Sidebar, type PageId } from "./layout/Sidebar";
import { Arquitectura } from "./pages/Arquitectura";
import { AsistenteIA } from "./pages/AsistenteIA";
import { Dashboard } from "./pages/Dashboard";
import { Exploratorio } from "./pages/Exploratorio";
import { Inicio } from "./pages/Inicio";
import { Locales } from "./pages/Locales";
import { Metodologia } from "./pages/Metodologia";
import { Prediccion } from "./pages/Prediccion";
import { Presentacion } from "./pages/Presentacion";
import { Problema } from "./pages/Problema";
import { Recomendaciones } from "./pages/Recomendaciones";
import { Segmentacion } from "./pages/Segmentacion";
import type { AppData, HealthResponse } from "./types/api";

function App() {
  const [activePage, setActivePage] = useState<PageId>("inicio");
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getHealth(), getAppData()])
      .then(([healthResponse, appData]) => {
        setHealth(healthResponse);
        setData(appData);
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : "No se pudo cargar el backend.");
      });
  }, []);

  const content = useMemo(() => {
    if (!data) {
      return null;
    }
    const pages: Record<PageId, ReactNode> = {
      inicio: <Inicio data={data} />,
      problema: <Problema />,
      arquitectura: <Arquitectura />,
      dashboard: <Dashboard data={data} />,
      locales: <Locales data={data} />,
      exploratorio: <Exploratorio data={data} />,
      segmentacion: <Segmentacion data={data} />,
      prediccion: <Prediccion data={data} />,
      asistente: <AsistenteIA />,
      recomendaciones: <Recomendaciones data={data} />,
      metodologia: <Metodologia />,
      presentacion: <Presentacion />,
    };
    return pages[activePage];
  }, [activePage, data]);

  return (
    <div className="min-h-screen bg-cazador-cream text-stone-900">
      <Sidebar activePage={activePage} onChange={setActivePage} />
      <main className="px-4 py-6 md:ml-72 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 shadow-sm">
            {health ? `${health.project} conectado (${health.status})` : "Conectando con backend..."}
          </div>
          {error ? (
            <section className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-800">
              <h1 className="text-xl font-bold">Backend no disponible</h1>
              <p className="mt-2">{error}</p>
              <p className="mt-2 text-sm">Ejecuta FastAPI en http://localhost:8000 y genera datos si aún no existen.</p>
            </section>
          ) : content ? (
            content
          ) : (
            <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <p className="text-stone-700">Cargando indicadores, modelos y datos del dashboard...</p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
