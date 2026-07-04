import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { StoryInsight } from "../components/StoryInsight";
import { formatCurrency, formatNumber, formatPercent } from "../components/format";
import type { PageProps } from "./types";

export function Inicio({ data }: PageProps) {
  return (
    <div>
      <PageHeader
        description="Herramienta académica de Inteligencia de Negocios e Inteligencia Artificial para transformar ventas sintéticas realistas en decisiones de inventario, personal y marketing."
        eyebrow="Resumen ejecutivo"
        title="Pollos y Parrillas El Cazador"
      />
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Ventas totales" note={data.summary.periodo} value={formatCurrency(data.summary.ventas_totales)} />
        <KpiCard label="Pedidos" value={formatNumber(data.summary.pedidos_totales)} />
        <KpiCard label="Ticket promedio" value={formatCurrency(data.summary.ticket_promedio)} />
        <KpiCard label="Margen bruto" value={formatPercent(data.summary.margen_bruto_porcentaje)} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-cazador-brown">Ventas por local</h2>
          <div className="h-80">
            <ResponsiveContainer>
              <BarChart data={data.ventasLocales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="local" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(value) => `${Number(value) / 1000000}M`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="ventas_totales" fill="#D99A2B" name="Ventas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <StoryInsight title="Lectura gerencial">
          El local matriz lidera las ventas y funciona como referencia operativa. El local reciente requiere seguimiento
          predictivo para estabilizar inventario y personal durante picos de demanda.
        </StoryInsight>
      </div>
    </div>
  );
}
