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
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <ChartCard insight="Las ventas crecen con el tiempo y muestran impacto estacional." title="Ventas anuales">
          <ResponsiveContainer>
            <LineChart data={data.ventasAnuales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="anio" />
              <YAxis tickFormatter={(value) => `${Number(value) / 1000000}M`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line dataKey="ventas_totales" name="Ventas" stroke="#D99A2B" strokeWidth={3} />
              <Line dataKey="margen_bruto" name="Margen" stroke="#2E7D32" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard insight="Parrillas y brasas sostienen el volumen económico principal." title="Ventas por categoría">
          <ResponsiveContainer>
            <BarChart data={data.ventasCategorias}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(value) => `${Number(value) / 1000000}M`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="ventas_totales" fill="#3B2416" name="Ventas" />
              <Bar dataKey="margen_bruto" fill="#D99A2B" name="Margen" />
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
