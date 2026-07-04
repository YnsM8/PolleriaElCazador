export type PageId =
  | "inicio"
  | "problema"
  | "arquitectura"
  | "dashboard"
  | "locales"
  | "exploratorio"
  | "segmentacion"
  | "prediccion"
  | "asistente"
  | "recomendaciones"
  | "metodologia"
  | "presentacion";

export const navigationItems: Array<{ id: PageId; label: string }> = [
  { id: "inicio", label: "Inicio" },
  { id: "problema", label: "Problema" },
  { id: "arquitectura", label: "Arquitectura" },
  { id: "dashboard", label: "Dashboard" },
  { id: "locales", label: "Locales" },
  { id: "exploratorio", label: "Exploratorio" },
  { id: "segmentacion", label: "K-Means" },
  { id: "prediccion", label: "Predicción" },
  { id: "asistente", label: "Asistente IA" },
  { id: "recomendaciones", label: "Recomendaciones" },
  { id: "metodologia", label: "Metodología" },
  { id: "presentacion", label: "Presentación" },
];

type SidebarProps = {
  activePage: PageId;
  onChange: (page: PageId) => void;
};

export function Sidebar({ activePage, onChange }: SidebarProps) {
  return (
    <aside className="border-r border-cazador-border bg-cazador-panel text-cazador-cream md:fixed md:inset-y-0 md:left-0 md:w-72 shadow-xl shadow-black/50 z-20">
      <div className="px-6 py-8 border-b border-cazador-border/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cazador-amber via-cazador-gold to-cazador-amber opacity-80"></div>
        <p className="text-xs font-semibold uppercase tracking-widest text-cazador-amber/80 font-sans">Pollos y Parrillas</p>
        <h2 className="mt-2 text-2xl font-serif font-bold tracking-wide text-cazador-cream drop-shadow-md">
          El Cazador
          <span className="block text-sm font-sans font-light text-cazador-amber/70 mt-1">BI + Inteligencia Artificial</span>
        </h2>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-4 py-6 md:block md:space-y-1.5 md:overflow-visible h-[calc(100vh-140px)] overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              className={`group whitespace-nowrap rounded-lg px-4 py-3 text-left text-sm font-medium transition-all duration-300 md:w-full relative overflow-hidden ${
                isActive
                  ? "text-cazador-dark font-bold shadow-lg shadow-cazador-amber/10"
                  : "text-cazador-cream/70 hover:text-cazador-amber hover:bg-cazador-amber/5"
              }`}
              key={item.id}
              onClick={() => onChange(item.id)}
              type="button"
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-cazador-amber to-cazador-gold z-0"></div>
              )}
              {isActive && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30 z-0"></div>
              )}
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
