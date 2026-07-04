type KpiCardProps = {
  label: string;
  value: string;
  note?: string;
};

export function KpiCard({ label, value, note }: KpiCardProps) {
  return (
    <article className="premium-card p-6 relative overflow-hidden group">
      <div className="absolute -inset-1 bg-gradient-to-br from-cazador-amber/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      <p className="text-xs font-semibold uppercase tracking-widest text-cazador-amber/70 font-sans">{label}</p>
      <p className="mt-3 text-3xl font-bold text-cazador-cream font-serif drop-shadow-sm">{value}</p>
      {note ? <p className="mt-3 text-sm text-cazador-cream/50 font-light border-t border-cazador-border/50 pt-2">{note}</p> : null}
    </article>
  );
}
