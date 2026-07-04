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
      <ol className="grid gap-3 md:grid-cols-2">
        {steps.map((step, index) => (
          <li className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm" key={step}>
            <span className="text-sm font-bold text-cazador-orange">Paso {index + 1}</span>
            <p className="mt-2 text-sm leading-6 text-stone-700">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
