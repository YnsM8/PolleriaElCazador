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
    <div className="min-h-screen bg-cazador-dark text-cazador-cream font-sans noise-bg selection:bg-cazador-amber selection:text-cazador-dark">
      <Sidebar activePage={activePage} onChange={setActivePage} />
      <main className="px-4 py-8 md:ml-72 md:px-10 lg:px-12 relative z-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8 rounded-xl border border-cazador-amber/20 bg-cazador-panel/80 backdrop-blur-md px-6 py-3 text-sm text-cazador-amber shadow-lg shadow-black/20 flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cazador-amber opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cazador-amber"></span>
            </span>
            {health ? `${health.project} conectado (${health.status})` : "Conectando con backend..."}
          </div>
          {error ? (
            <section className="premium-card p-6 border-red-900/50 bg-red-950/20 text-red-200">
              <h1 className="text-2xl font-serif font-bold text-red-400">Backend no disponible</h1>
              <p className="mt-2 text-red-300/80">{error}</p>
              <p className="mt-4 text-sm text-red-400/60 font-mono bg-black/40 p-3 rounded-lg border border-red-900/30">Ejecuta FastAPI en http://localhost:8000 y genera datos si aún no existen.</p>
            </section>
          ) : content ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
              {content}
            </div>
          ) : (
            <section className="premium-card p-10 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-12 h-12 border-4 border-cazador-border border-t-cazador-amber rounded-full animate-spin mb-4"></div>
              <p className="text-cazador-cream/60 font-serif text-lg tracking-wide">Cargando indicadores, modelos y datos del dashboard...</p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
