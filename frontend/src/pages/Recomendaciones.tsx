import { PageHeader } from "../components/PageHeader";
import { StoryInsight } from "../components/StoryInsight";
import { formatCurrency } from "../components/format";
import type { PageProps } from "./types";

export function Recomendaciones({ data }: PageProps) {
  const rmse = formatCurrency(data.modelMetrics.rmse);
  return (
    <div>
      <PageHeader
        description="Acciones estrategicas derivadas de KPIs, segmentacion y prediccion."
        eyebrow="Cierre ejecutivo"
        title="Recomendaciones"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <StoryInsight title="Inventario">
          Usar la prediccion mensual y considerar el RMSE como margen de seguridad. Para este modelo, el error de referencia es
          {` ${rmse}`}; temporada alta exige stock reforzado de pollo, papas y carbon.
        </StoryInsight>
        <StoryInsight title="Personal">
          Reforzar turnos tarde y noche en fines de semana y meses de julio/diciembre. Calle Real #232 debe servir como patron
          operativo para estabilizar sedes de crecimiento.
        </StoryInsight>
        <StoryInsight title="Marketing">
          Priorizar combos con platos de alto valor y promociones moderadas en temporada baja. El descuento debe crecer con control
          para no erosionar margen.
        </StoryInsight>
        <StoryInsight title="Escalabilidad">
          El sistema puede incorporar clima, campañas, inventario y compras reales como nuevas fuentes para mejorar la prediccion.
        </StoryInsight>
      </div>
    </div>
  );
}
