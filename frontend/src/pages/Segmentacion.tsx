import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../components/ChartCard";
import { DataTable } from "../components/DataTable";
import { PageHeader } from "../components/PageHeader";
import { formatCurrency, formatNumber, formatPercent } from "../components/format";
import type { ClusterDish, ClusterSummary } from "../types/api";
import type { PageProps } from "./types";

export function Segmentacion({ data }: PageProps) {
  return (
    <div>
      <PageHeader
        description="K-Means agrupa platos para tomar decisiones de carta, inventario y promociones."
        eyebrow="Machine Learning"
        title="Segmentación K-Means"
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard insight="Los clusters cruzan margen y frecuencia para separar valor, volumen y riesgo." title="Margen vs frecuencia mensual">
          <ResponsiveContainer>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="frecuencia_mensual" name="Frecuencia mensual" type="number" />
              <YAxis dataKey="margen_porcentaje" name="Margen %" type="number" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Legend />
              {data.clusters.resumen.map((cluster) => (
                <Scatter
                  data={data.clusters.platos.filter((dish) => dish.cluster === cluster.cluster)}
                  fill={cluster.cluster === "ALTO VALOR" ? "#D99A2B" : cluster.cluster === "ALTO VOLUMEN" ? "#3B2416" : cluster.cluster === "NICHO RENTABLE" ? "#2E7D32" : "#C75B12"}
                  key={cluster.cluster}
                  name={cluster.cluster}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard insight="El resumen permite traducir clusters en acciones comerciales." title="Ventas por cluster">
          <ResponsiveContainer>
            <BarChart data={data.clusters.resumen}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cluster" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={(value) => `${Number(value) / 1000000}M`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="ventas_totales" fill="#D99A2B" name="Ventas" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <DataTable<ClusterSummary>
          columns={[
            { key: "cluster", label: "Cluster" },
            { key: "platos", label: "Platos", render: (row) => formatNumber(row.platos) },
            { key: "ventas_totales", label: "Ventas", render: (row) => formatCurrency(row.ventas_totales) },
            { key: "margen_porcentaje", label: "Margen", render: (row) => formatPercent(row.margen_porcentaje) },
          ]}
          rows={data.clusters.resumen}
        />
        <DataTable<ClusterDish>
          columns={[
            { key: "plato", label: "Plato" },
            { key: "cluster", label: "Cluster" },
            { key: "precio_unitario", label: "Precio", render: (row) => formatCurrency(row.precio_unitario) },
            { key: "margen_unitario", label: "Margen unit.", render: (row) => formatCurrency(row.margen_unitario) },
          ]}
          rows={data.clusters.platos.slice(0, 12)}
        />
      </div>
    </div>
  );
}
