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
      <div className="grid gap-4 lg:grid-cols-5">
        {layers.map((layer, index) => (
          <section className="relative rounded-lg border border-stone-200 bg-white p-4 shadow-sm" key={layer.title}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cazador-amber font-bold text-stone-950">
              {index + 1}
            </div>
            <h2 className="mt-4 text-lg font-semibold text-cazador-brown">{layer.title}</h2>
            <ul className="mt-3 space-y-2 text-sm text-stone-700">
              {layer.items.map((item) => (
                <li className="rounded bg-amber-50 px-3 py-2" key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
