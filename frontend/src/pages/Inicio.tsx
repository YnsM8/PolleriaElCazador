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
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
        <section className="premium-card p-6">
          <h2 className="mb-6 pb-4 border-b border-cazador-border/60 text-xl font-serif font-bold text-cazador-cream">Ventas por local</h2>
          <div className="h-80 relative z-10">
            <ResponsiveContainer>
              <BarChart data={data.ventasLocales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#332620" vertical={false} />
                <XAxis dataKey="local" stroke="#E5A022" tick={{ fontSize: 11, fill: '#FAF4EC', opacity: 0.7 }} />
                <YAxis stroke="#E5A022" tick={{ fill: '#FAF4EC', opacity: 0.7 }} tickFormatter={(value) => `${Number(value) / 1000000}M`} />
                <Tooltip contentStyle={{ backgroundColor: '#15110E', borderColor: '#D4AF37', borderRadius: '8px', color: '#FAF4EC' }} cursor={{ fill: '#332620', opacity: 0.4 }} formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="ventas_totales" fill="#D4AF37" radius={[4, 4, 0, 0]} name="Ventas" />
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
