import { FormEvent, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import { predictSales } from "../api/client";
import { ChartCard } from "../components/ChartCard";
import { DataTable } from "../components/DataTable";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { formatCurrency } from "../components/format";
import type { FeatureImportance, PredictionRequest, PredictionResponse } from "../types/api";
import type { PageProps } from "./types";

export function Prediccion({ data }: PageProps) {
  const [form, setForm] = useState<PredictionRequest>({
    año: 2026,
    mes: 7,
    id_local: 1,
    descuento_promedio: 15,
    temporada: "Alta",
  });
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      setResult(await predictSales(form));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        description="Regresión lineal para estimar ventas mensuales y convertir el resultado en acciones de negocio."
        eyebrow="Modelo supervisado"
        title="Predicción de ventas"
      />
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard label="MAE" value={formatCurrency(data.modelMetrics.mae)} />
        <KpiCard label="RMSE" value={formatCurrency(data.modelMetrics.rmse)} />
        <KpiCard label="R²" value={`${data.modelMetrics.r2_porcentaje.toFixed(2)}%`} />
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <ChartCard insight="Mientras más cerca de la diagonal implícita, mejor aproximación." title="Predicción vs real">
          <ResponsiveContainer>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="real" name="Real" type="number" tickFormatter={(value) => `${Number(value) / 1000}K`} />
              <YAxis dataKey="predicho" name="Predicho" type="number" tickFormatter={(value) => `${Number(value) / 1000}K`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Scatter data={data.predicciones} fill="#D99A2B" name="Predicciones" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard insight="Los coeficientes muestran dirección e intensidad del impacto." title="Importancia de variables">
          <ResponsiveContainer>
            <BarChart data={data.importancia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="variable" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="coeficiente" fill="#3B2416" name="Coeficiente" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <section className="mt-6 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-cazador-brown">Simulador predictivo</h2>
        <form className="mt-4 grid gap-3 md:grid-cols-5" onSubmit={handleSubmit}>
          <input className="rounded-md border border-stone-300 px-3 py-2" onChange={(e) => setForm({ ...form, año: Number(e.target.value) })} type="number" value={form.año} />
          <input className="rounded-md border border-stone-300 px-3 py-2" max={12} min={1} onChange={(e) => setForm({ ...form, mes: Number(e.target.value) })} type="number" value={form.mes} />
          <select className="rounded-md border border-stone-300 px-3 py-2" onChange={(e) => setForm({ ...form, id_local: Number(e.target.value) })} value={form.id_local}>
            <option value={1}>Calle Real #232</option>
            <option value={2}>Av. Huancavelica #587</option>
            <option value={3}>Calle Real #976</option>
          </select>
          <input className="rounded-md border border-stone-300 px-3 py-2" onChange={(e) => setForm({ ...form, descuento_promedio: Number(e.target.value) })} type="number" value={form.descuento_promedio} />
          <select className="rounded-md border border-stone-300 px-3 py-2" onChange={(e) => setForm({ ...form, temporada: e.target.value })} value={form.temporada}>
            <option>Alta</option>
            <option>Media</option>
            <option>Baja</option>
          </select>
          <button className="rounded-md bg-cazador-brown px-4 py-2 font-semibold text-white md:col-span-5" disabled={loading} type="submit">
            {loading ? "Calculando..." : "Simular ventas"}
          </button>
        </form>
        {result ? (
          <div className="mt-4 rounded-md bg-amber-50 p-4 text-sm leading-6 text-stone-700">
            <strong className="text-cazador-brown">{formatCurrency(result.venta_estimada)}</strong>
            <p>{result.interpretacion}</p>
            <p>{result.recomendacion_inventario}</p>
            <p>{result.recomendacion_personal}</p>
            <p>{result.recomendacion_marketing}</p>
          </div>
        ) : null}
      </section>
      <div className="mt-6">
        <DataTable<FeatureImportance>
          columns={[
            { key: "variable", label: "Variable" },
            { key: "coeficiente", label: "Coeficiente" },
            { key: "impacto", label: "Impacto" },
          ]}
          rows={data.importancia}
        />
      </div>
    </div>
  );
}
