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
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <ChartCard insight="Mientras más cerca de la diagonal implícita, mejor aproximación." title="Predicción vs real">
          <ResponsiveContainer>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#332620" vertical={false} />
              <XAxis dataKey="real" name="Real" type="number" stroke="#E5A022" tick={{ fill: '#FAF4EC', opacity: 0.7 }} tickFormatter={(value) => `${Number(value) / 1000}K`} />
              <YAxis dataKey="predicho" name="Predicho" type="number" stroke="#E5A022" tick={{ fill: '#FAF4EC', opacity: 0.7 }} tickFormatter={(value) => `${Number(value) / 1000}K`} />
              <Tooltip cursor={{ strokeDasharray: "3 3", stroke: "#332620" }} contentStyle={{ backgroundColor: '#15110E', borderColor: '#D4AF37', borderRadius: '8px', color: '#FAF4EC' }} formatter={(value) => formatCurrency(Number(value))} />
              <Scatter data={data.predicciones} fill="#D4AF37" name="Predicciones" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard insight="Los coeficientes muestran dirección e intensidad del impacto." title="Importancia de variables">
          <ResponsiveContainer>
            <BarChart data={data.importancia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#332620" vertical={false} />
              <XAxis dataKey="variable" stroke="#E5A022" tick={{ fontSize: 10, fill: '#FAF4EC', opacity: 0.7 }} />
              <YAxis stroke="#E5A022" tick={{ fill: '#FAF4EC', opacity: 0.7 }} />
              <Tooltip contentStyle={{ backgroundColor: '#15110E', borderColor: '#D4AF37', borderRadius: '8px', color: '#FAF4EC' }} cursor={{ fill: '#332620', opacity: 0.4 }} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="coeficiente" fill="#E25611" radius={[4, 4, 0, 0]} name="Coeficiente" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <section className="mt-8 premium-card p-6">
        <h2 className="mb-6 pb-4 border-b border-cazador-border/60 text-xl font-serif font-bold text-cazador-cream">Simulador predictivo</h2>
        <form className="mt-4 grid gap-4 md:grid-cols-5" onSubmit={handleSubmit}>
          <label className="text-sm font-medium text-cazador-amber/80 font-sans tracking-wide uppercase text-xs">
            Año
            <input className="mt-2 w-full rounded-lg bg-cazador-dark border border-cazador-border/60 px-4 py-2.5 text-cazador-cream focus:border-cazador-amber focus:ring-1 focus:ring-cazador-amber transition-colors outline-none" name="anio" onChange={(e) => setForm({ ...form, año: Number(e.target.value) })} type="number" value={form.año} />
          </label>
          <label className="text-sm font-medium text-cazador-amber/80 font-sans tracking-wide uppercase text-xs">
            Mes
            <input className="mt-2 w-full rounded-lg bg-cazador-dark border border-cazador-border/60 px-4 py-2.5 text-cazador-cream focus:border-cazador-amber focus:ring-1 focus:ring-cazador-amber transition-colors outline-none" max={12} min={1} name="mes" onChange={(e) => setForm({ ...form, mes: Number(e.target.value) })} type="number" value={form.mes} />
          </label>
          <label className="text-sm font-medium text-cazador-amber/80 font-sans tracking-wide uppercase text-xs">
            Local
            <select className="mt-2 w-full rounded-lg bg-cazador-dark border border-cazador-border/60 px-4 py-2.5 text-cazador-cream focus:border-cazador-amber focus:ring-1 focus:ring-cazador-amber transition-colors outline-none appearance-none" name="id_local" onChange={(e) => setForm({ ...form, id_local: Number(e.target.value) })} value={form.id_local}>
              <option value={1}>Calle Real #232</option>
              <option value={2}>Av. Huancavelica #587</option>
              <option value={3}>Calle Real #976</option>
            </select>
          </label>
          <label className="text-sm font-medium text-cazador-amber/80 font-sans tracking-wide uppercase text-xs">
            Descuento %
            <input className="mt-2 w-full rounded-lg bg-cazador-dark border border-cazador-border/60 px-4 py-2.5 text-cazador-cream focus:border-cazador-amber focus:ring-1 focus:ring-cazador-amber transition-colors outline-none" name="descuento_promedio" onChange={(e) => setForm({ ...form, descuento_promedio: Number(e.target.value) })} type="number" value={form.descuento_promedio} />
          </label>
          <label className="text-sm font-medium text-cazador-amber/80 font-sans tracking-wide uppercase text-xs">
            Temporada
            <select className="mt-2 w-full rounded-lg bg-cazador-dark border border-cazador-border/60 px-4 py-2.5 text-cazador-cream focus:border-cazador-amber focus:ring-1 focus:ring-cazador-amber transition-colors outline-none appearance-none" name="temporada" onChange={(e) => setForm({ ...form, temporada: e.target.value })} value={form.temporada}>
              <option>Alta</option>
              <option>Media</option>
              <option>Baja</option>
            </select>
          </label>
          <button className="rounded-xl bg-gradient-to-r from-cazador-amber to-cazador-orange px-6 py-3 font-semibold text-cazador-dark md:col-span-5 hover:shadow-[0_0_15px_rgba(229,160,34,0.4)] transition-all disabled:opacity-50 mt-4" disabled={loading} type="submit">
            {loading ? "Calculando..." : "Simular ventas"}
          </button>
        </form>
        {result ? (
          <div className="mt-8 rounded-xl bg-cazador-amber/10 border border-cazador-amber/30 p-6 text-sm leading-relaxed text-cazador-cream/80 animate-in fade-in slide-in-from-bottom-2">
            <strong className="text-2xl font-serif text-cazador-amber block mb-4">{formatCurrency(result.venta_estimada)}</strong>
            <p className="mb-2"><span className="text-cazador-cream">Interpretación:</span> {result.interpretacion}</p>
            <p className="mb-2"><span className="text-cazador-cream">Inventario:</span> {result.recomendacion_inventario}</p>
            <p className="mb-2"><span className="text-cazador-cream">Personal:</span> {result.recomendacion_personal}</p>
            <p><span className="text-cazador-cream">Marketing:</span> {result.recomendacion_marketing}</p>
          </div>
        ) : null}
      </section>
      <div className="mt-8">
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
