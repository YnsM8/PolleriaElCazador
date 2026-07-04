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
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-cazador-brown">Dolores operativos</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-700">
            {points.map((point) => (
              <li className="rounded-md bg-stone-50 p-3" key={point}>{point}</li>
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
