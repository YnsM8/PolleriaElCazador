import { PageHeader } from "../components/PageHeader";
import { StoryInsight } from "../components/StoryInsight";

const points = [
  "Ventas variables por local, dia de semana y temporada.",
  "Riesgo de merma o desabastecimiento de pollo, papas y carbon.",
  "Necesidad de planificar personal para turnos de mayor demanda.",
  "Promociones y descuentos deben equilibrar demanda y margen.",
];

export function Problema() {
  return (
    <div>
      <PageHeader
        description="La empresa opera tres locales en Chilca, Huancayo, y necesita pasar de una gestion empirica a decisiones apoyadas por datos."
        eyebrow="Contexto de negocio"
        title="Problema de negocio"
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="premium-card p-8">
          <h2 className="text-xl font-serif font-bold text-cazador-cream mb-6 pb-4 border-b border-cazador-border/60">Dolores operativos</h2>
          <ul className="mt-4 space-y-4 text-sm leading-relaxed text-cazador-cream/80 font-light">
            {points.map((point) => (
              <li className="rounded-xl bg-cazador-dark/50 border border-cazador-border/50 p-4 shadow-inner" key={point}>{point}</li>
            ))}
          </ul>
        </section>
        <StoryInsight title="Por que BI + IA">
          BI permite centralizar y explicar los patrones de venta. IA aporta prediccion mensual, segmentacion de platos y un
          asistente conversacional para consultas gerenciales rapidas.
        </StoryInsight>
      </div>
    </div>
  );
}
