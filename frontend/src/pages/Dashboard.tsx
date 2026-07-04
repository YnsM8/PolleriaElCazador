import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "../components/ChartCard";
import { DataTable } from "../components/DataTable";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { formatCurrency, formatNumber, formatPercent } from "../components/format";
import type { CategorySales } from "../types/api";
import type { PageProps } from "./types";

export function Dashboard({ data }: PageProps) {
  return (
    <div>
      <PageHeader
        description="Vista ejecutiva de ventas, margen, categorias y locales para contar la historia del negocio."
        eyebrow="BI"
        title="Dashboard general"
      />
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Ventas" value={formatCurrency(data.summary.ventas_totales)} />
        <KpiCard label="Pedidos" value={formatNumber(data.summary.pedidos_totales)} />
        <KpiCard label="Ticket" value={formatCurrency(data.summary.ticket_promedio)} />
        <KpiCard label="Margen bruto" value={formatCurrency(data.summary.margen_bruto_total)} />
        <KpiCard label="Margen %" value={formatPercent(data.summary.margen_bruto_porcentaje)} />
        <KpiCard label="Descuento" value={formatPercent(data.summary.descuento_promedio)} />
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <ChartCard insight="Las ventas crecen con el tiempo y muestran impacto estacional." title="Ventas anuales">
          <ResponsiveContainer>
            <LineChart data={data.ventasAnuales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#332620" vertical={false} />
              <XAxis dataKey="anio" stroke="#E5A022" tick={{ fill: '#FAF4EC', opacity: 0.7 }} />
              <YAxis stroke="#E5A022" tick={{ fill: '#FAF4EC', opacity: 0.7 }} tickFormatter={(value) => `${Number(value) / 1000000}M`} />
              <Tooltip contentStyle={{ backgroundColor: '#15110E', borderColor: '#D4AF37', borderRadius: '8px', color: '#FAF4EC' }} formatter={(value) => formatCurrency(Number(value))} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Line dataKey="ventas_totales" name="Ventas" stroke="#D4AF37" strokeWidth={3} dot={{ fill: '#15110E', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, stroke: '#E5A022' }} />
              <Line dataKey="margen_bruto" name="Margen" stroke="#E25611" strokeWidth={2} dot={{ fill: '#15110E', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard insight="Parrillas y brasas sostienen el volumen económico principal." title="Ventas por categoría">
          <ResponsiveContainer>
            <BarChart data={data.ventasCategorias}>
              <CartesianGrid strokeDasharray="3 3" stroke="#332620" vertical={false} />
              <XAxis dataKey="categoria" stroke="#E5A022" tick={{ fontSize: 11, fill: '#FAF4EC', opacity: 0.7 }} />
              <YAxis stroke="#E5A022" tick={{ fill: '#FAF4EC', opacity: 0.7 }} tickFormatter={(value) => `${Number(value) / 1000000}M`} />
              <Tooltip contentStyle={{ backgroundColor: '#15110E', borderColor: '#D4AF37', borderRadius: '8px', color: '#FAF4EC' }} cursor={{ fill: '#332620', opacity: 0.4 }} formatter={(value) => formatCurrency(Number(value))} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="ventas_totales" fill="#E25611" radius={[4, 4, 0, 0]} name="Ventas" />
              <Bar dataKey="margen_bruto" fill="#D4AF37" radius={[4, 4, 0, 0]} name="Margen" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <div className="mt-6">
        <DataTable<CategorySales>
          columns={[
            { key: "categoria", label: "Categoría" },
            { key: "ventas_totales", label: "Ventas", render: (row) => formatCurrency(row.ventas_totales) },
            { key: "pedidos", label: "Pedidos", render: (row) => formatNumber(row.pedidos) },
            { key: "margen_porcentaje", label: "Margen", render: (row) => formatPercent(row.margen_porcentaje) },
          ]}
          rows={data.ventasCategorias}
        />
      </div>
    </div>
  );
}
