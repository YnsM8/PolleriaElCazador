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
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard insight="Los clusters cruzan margen y frecuencia para separar valor, volumen y riesgo." title="Margen vs frecuencia mensual">
          <ResponsiveContainer>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#332620" vertical={false} />
              <XAxis dataKey="frecuencia_mensual" name="Frecuencia mensual" type="number" stroke="#E5A022" tick={{ fill: '#FAF4EC', opacity: 0.7 }} />
              <YAxis dataKey="margen_porcentaje" name="Margen %" type="number" stroke="#E5A022" tick={{ fill: '#FAF4EC', opacity: 0.7 }} />
              <Tooltip cursor={{ strokeDasharray: "3 3", stroke: "#332620" }} contentStyle={{ backgroundColor: '#15110E', borderColor: '#D4AF37', borderRadius: '8px', color: '#FAF4EC' }} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              {data.clusters.resumen.map((cluster) => (
                <Scatter
                  data={data.clusters.platos.filter((dish) => dish.cluster === cluster.cluster)}
                  fill={cluster.cluster === "ALTO VALOR" ? "#D4AF37" : cluster.cluster === "ALTO VOLUMEN" ? "#E25611" : cluster.cluster === "NICHO RENTABLE" ? "#2E7D32" : "#9ca3af"}
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
              <CartesianGrid strokeDasharray="3 3" stroke="#332620" vertical={false} />
              <XAxis dataKey="cluster" stroke="#E5A022" tick={{ fontSize: 10, fill: '#FAF4EC', opacity: 0.7 }} />
              <YAxis stroke="#E5A022" tick={{ fill: '#FAF4EC', opacity: 0.7 }} tickFormatter={(value) => `${Number(value) / 1000000}M`} />
              <Tooltip contentStyle={{ backgroundColor: '#15110E', borderColor: '#D4AF37', borderRadius: '8px', color: '#FAF4EC' }} cursor={{ fill: '#332620', opacity: 0.4 }} formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="ventas_totales" fill="#D4AF37" radius={[4, 4, 0, 0]} name="Ventas" />
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
