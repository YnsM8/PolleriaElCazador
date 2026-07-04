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
      <div className="grid gap-6 xl:grid-cols-2 mt-8">
        <ChartCard insight="La mayoría de tickets se concentra en rangos bajos y medios." title="Histograma de ventas">
          <ResponsiveContainer>
            <BarChart data={data.distribucionVentas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#332620" vertical={false} />
              <XAxis dataKey="rango" stroke="#E5A022" tick={{ fontSize: 10, fill: '#FAF4EC', opacity: 0.7 }} />
              <YAxis stroke="#E5A022" tick={{ fill: '#FAF4EC', opacity: 0.7 }} tickFormatter={(value) => formatNumber(Number(value))} />
              <Tooltip contentStyle={{ backgroundColor: '#15110E', borderColor: '#D4AF37', borderRadius: '8px', color: '#FAF4EC' }} cursor={{ fill: '#332620', opacity: 0.4 }} />
              <Bar dataKey="frecuencia" fill="#D4AF37" radius={[4, 4, 0, 0]} name="Frecuencia" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard insight="El margen se mantiene estable mientras los descuentos crecen desde 2025." title="Margen y descuento anual">
          <ResponsiveContainer>
            <LineChart data={marginDiscount}>
              <CartesianGrid strokeDasharray="3 3" stroke="#332620" vertical={false} />
              <XAxis dataKey="anio" stroke="#E5A022" tick={{ fill: '#FAF4EC', opacity: 0.7 }} />
              <YAxis stroke="#E5A022" tick={{ fill: '#FAF4EC', opacity: 0.7 }} />
              <Tooltip contentStyle={{ backgroundColor: '#15110E', borderColor: '#D4AF37', borderRadius: '8px', color: '#FAF4EC' }} />
              <Line dataKey="margen" name="Margen %" stroke="#D4AF37" strokeWidth={3} dot={{ fill: '#15110E', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#D4AF37' }} />
              <Line dataKey="descuento" name="Descuento %" stroke="#E25611" strokeWidth={2} dot={{ fill: '#15110E', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#E25611' }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard insight="Vista equivalente a dispersión para contrastar descuento y margen por año." title="Dispersión descuento vs margen">
          <ResponsiveContainer>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#332620" vertical={false} />
              <XAxis dataKey="descuento" name="Descuento %" type="number" stroke="#E5A022" tick={{ fill: '#FAF4EC', opacity: 0.7 }} />
              <YAxis dataKey="margen" name="Margen %" type="number" stroke="#E5A022" tick={{ fill: '#FAF4EC', opacity: 0.7 }} />
              <Tooltip cursor={{ strokeDasharray: "3 3", stroke: "#332620" }} contentStyle={{ backgroundColor: '#15110E', borderColor: '#D4AF37', borderRadius: '8px', color: '#FAF4EC' }} />
              <Scatter data={marginDiscount} fill="#E25611" name="Año" />
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
