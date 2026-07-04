import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../components/ChartCard";
import { DataTable } from "../components/DataTable";
import { PageHeader } from "../components/PageHeader";
import { StoryInsight } from "../components/StoryInsight";
import { formatCurrency, formatNumber, formatPercent } from "../components/format";
import type { LocalMetric } from "../types/api";
import type { PageProps } from "./types";

export function Locales({ data }: PageProps) {
  return (
    <div>
      <PageHeader
        description="Comparativo de desempeño por local para priorizar seguimiento operativo y comercial."
        eyebrow="Locales"
        title="Rendimiento de sedes"
      />
      <div className="grid gap-4 xl:grid-cols-[1.5fr_0.8fr]">
        <ChartCard insight="Calle Real #232 funciona como local matriz y referencia de estabilidad." title="Ventas y margen por local">
          <ResponsiveContainer>
            <BarChart data={data.locales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="local" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(value) => `${Number(value) / 1000000}M`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="ventas_totales" fill="#D99A2B" name="Ventas" />
              <Bar dataKey="margen_bruto" fill="#2E7D32" name="Margen" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <StoryInsight title="Foco operativo">
          Calle Real #976 debe monitorearse con mayor cuidado por ser local reciente. El dashboard ayuda a comparar ventas,
          pedidos y margen para asignar personal e inventario.
        </StoryInsight>
      </div>
      <div className="mt-6">
        <DataTable<LocalMetric>
          columns={[
            { key: "local", label: "Local" },
            { key: "perfil", label: "Perfil" },
            { key: "ventas_totales", label: "Ventas", render: (row) => formatCurrency(row.ventas_totales) },
            { key: "pedidos", label: "Pedidos", render: (row) => formatNumber(row.pedidos) },
            { key: "ticket_promedio", label: "Ticket", render: (row) => formatCurrency(row.ticket_promedio) },
            { key: "margen_porcentaje", label: "Margen", render: (row) => formatPercent(row.margen_porcentaje) },
          ]}
          rows={data.locales}
        />
      </div>
    </div>
  );
}
