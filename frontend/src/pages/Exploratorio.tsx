import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "../components/ChartCard";
import { DataTable } from "../components/DataTable";
import { PageHeader } from "../components/PageHeader";
import { formatCurrency, formatNumber } from "../components/format";
import type { DescriptiveStat } from "../types/api";
import type { PageProps } from "./types";

export function Exploratorio({ data }: PageProps) {
  const marginDiscount = data.margenAnual.map((item) => ({
    anio: item.anio,
    margen: item.margen_porcentaje,
    descuento: item.descuento_porcentaje,
  }));

  return (
    <div>
      <PageHeader
        description="Análisis descriptivo para comprender distribución de ventas, margen y descuentos."
        eyebrow="EDA"
        title="Análisis exploratorio"
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard insight="La mayoría de tickets se concentra en rangos bajos y medios." title="Histograma de ventas">
          <ResponsiveContainer>
            <BarChart data={data.distribucionVentas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rango" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={(value) => formatNumber(Number(value))} />
              <Tooltip />
              <Bar dataKey="frecuencia" fill="#D99A2B" name="Frecuencia" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard insight="El margen se mantiene estable mientras los descuentos crecen desde 2025." title="Margen y descuento anual">
          <ResponsiveContainer>
            <LineChart data={marginDiscount}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="anio" />
              <YAxis />
              <Tooltip />
              <Line dataKey="margen" name="Margen %" stroke="#2E7D32" strokeWidth={3} />
              <Line dataKey="descuento" name="Descuento %" stroke="#C75B12" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard insight="Vista equivalente a dispersión para contrastar descuento y margen por año." title="Dispersión descuento vs margen">
          <ResponsiveContainer>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="descuento" name="Descuento %" type="number" />
              <YAxis dataKey="margen" name="Margen %" type="number" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={marginDiscount} fill="#3B2416" name="Año" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
        <section>
          <DataTable<DescriptiveStat>
            columns={[
              { key: "variable", label: "Variable" },
              { key: "mean", label: "Media", render: (row) => formatCurrency(row.mean) },
              { key: "std", label: "Desv.", render: (row) => formatCurrency(row.std) },
              { key: "p50", label: "Mediana", render: (row) => formatCurrency(row.p50) },
              { key: "max", label: "Máximo", render: (row) => formatCurrency(row.max) },
            ]}
            rows={data.estadisticas}
          />
        </section>
      </div>
    </div>
  );
}
