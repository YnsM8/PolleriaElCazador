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
    <aside className="border-r border-stone-200 bg-cazador-brown text-white md:fixed md:inset-y-0 md:left-0 md:w-72">
      <div className="px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-200">Pollos y Parrillas</p>
        <h2 className="mt-1 text-xl font-bold">El Cazador BI + IA</h2>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-3 pb-4 md:block md:space-y-1 md:overflow-visible">
        {navigationItems.map((item) => (
          <button
            className={`whitespace-nowrap rounded-md px-3 py-2 text-left text-sm font-medium transition md:w-full ${
              activePage === item.id
                ? "bg-cazador-amber text-stone-950"
                : "text-stone-100 hover:bg-white/10"
            }`}
            key={item.id}
            onClick={() => onChange(item.id)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
