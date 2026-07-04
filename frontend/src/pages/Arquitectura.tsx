import { PageHeader } from "../components/PageHeader";

const layers = [
  { title: "Fuentes", items: ["Ventas POS", "Platos y costos", "Feriados", "Campañas futuras"] },
  { title: "Data Lake", items: ["raw", "processed", "warehouse"] },
  { title: "ETL/ELT", items: ["Limpieza", "Locales oficiales", "Dimensiones", "Agregados"] },
  { title: "Data Warehouse", items: ["fact_ventas", "dim_fecha", "dim_local", "dim_plato", "dim_turno"] },
  { title: "Consumo", items: ["API FastAPI", "Dashboard React", "Modelos ML", "Asistente IA"] },
];

export function Arquitectura() {
  return (
    <div>
      <PageHeader
        description="La arquitectura organiza datos desde fuentes operativas hasta dashboards, modelos y asistente IA."
        eyebrow="Datos"
        title="Arquitectura de datos"
      />
      <div className="grid gap-6 lg:grid-cols-5 relative">
        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cazador-amber/20 to-transparent -translate-y-1/2 -z-10"></div>
        {layers.map((layer, index) => (
          <section className="premium-card p-6 relative z-10 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300" key={layer.title}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cazador-amber to-cazador-orange font-bold text-cazador-dark shadow-lg shadow-cazador-amber/20 ring-4 ring-cazador-dark">
              {index + 1}
            </div>
            <h2 className="mt-6 mb-4 text-xl font-serif font-bold text-cazador-cream">{layer.title}</h2>
            <ul className="mt-auto w-full space-y-3 text-sm text-cazador-cream/70 font-light">
              {layer.items.map((item) => (
                <li className="rounded-xl bg-cazador-dark/50 border border-cazador-border/50 px-4 py-2.5 shadow-inner" key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
