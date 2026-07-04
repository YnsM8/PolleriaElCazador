import { PageHeader } from "../components/PageHeader";

const agenda = [
  { time: "0:00 - 1:00", topic: "Empresa y problema de negocio" },
  { time: "1:00 - 2:00", topic: "Arquitectura de datos: lake, ETL y warehouse" },
  { time: "2:00 - 4:00", topic: "Dashboard BI y hallazgos descriptivos" },
  { time: "4:00 - 6:00", topic: "K-Means para segmentacion de platos" },
  { time: "6:00 - 8:00", topic: "Regresion lineal y simulador predictivo" },
  { time: "8:00 - 9:00", topic: "Asistente IA conversacional" },
  { time: "9:00 - 10:00", topic: "Recomendaciones y cierre" },
];

export function Presentacion() {
  return (
    <div>
      <PageHeader
        description="Estructura sugerida para una exposicion oral profesional de 10 minutos."
        eyebrow="Exposición"
        title="Presentación de 10 minutos"
      />
      <div className="space-y-3">
        {agenda.map((item) => (
          <article className="grid gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-[140px_1fr]" key={item.time}>
            <p className="font-semibold text-cazador-orange">{item.time}</p>
            <p className="text-stone-700">{item.topic}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
