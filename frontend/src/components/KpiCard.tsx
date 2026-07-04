type KpiCardProps = {
  label: string;
  value: string;
  note?: string;
};

export function KpiCard({ label, value, note }: KpiCardProps) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-cazador-brown">{value}</p>
      {note ? <p className="mt-2 text-sm text-stone-600">{note}</p> : null}
    </article>
  );
}
