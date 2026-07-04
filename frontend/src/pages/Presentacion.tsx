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
      <div className="space-y-4">
        {agenda.map((item, index) => (
          <article className="grid gap-4 premium-card p-6 md:grid-cols-[140px_1fr] relative overflow-hidden group" key={item.time}>
            <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-cazador-amber to-cazador-orange opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <p className="font-sans font-bold tracking-wider text-cazador-amber flex items-center gap-2">
              <span className="text-cazador-cream/30 font-serif text-sm">0{index + 1}</span> {item.time}
            </p>
            <p className="text-cazador-cream/90 font-light text-lg">{item.topic}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
