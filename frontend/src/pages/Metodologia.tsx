import { PageHeader } from "../components/PageHeader";

const steps = [
  "Generacion de datos sinteticos con semillas fijas y reglas de demanda.",
  "Normalizacion de locales oficiales del informe.",
  "Construccion de tablas fact_ventas y dimensiones.",
  "Analitica descriptiva para KPIs, tendencias y distribuciones.",
  "K-Means para segmentacion de platos.",
  "Regresion lineal para ventas mensuales por local.",
  "Asistente conversacional basado en reglas y contexto del negocio.",
];

export function Metodologia() {
  return (
    <div>
      <PageHeader
        description="Ruta metodologica usada para cumplir la consigna de BI e IA de forma reproducible."
        eyebrow="Proceso"
        title="Metodología"
      />
      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <li className="premium-card p-6 flex flex-col relative overflow-hidden group" key={step}>
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-cazador-amber/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-md pointer-events-none"></div>
            <span className="text-xs font-bold font-sans tracking-widest uppercase text-cazador-amber mb-3 border-b border-cazador-border/50 pb-2">Paso {index + 1}</span>
            <p className="text-sm leading-relaxed text-cazador-cream/80 font-light">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
