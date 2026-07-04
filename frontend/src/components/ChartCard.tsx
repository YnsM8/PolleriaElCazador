import type { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  insight?: string;
  children: ReactNode;
};

export function ChartCard({ title, insight, children }: ChartCardProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-cazador-brown">{title}</h2>
        {insight ? <p className="mt-1 text-sm leading-6 text-stone-600">{insight}</p> : null}
      </div>
      <div className="h-80 min-h-80">{children}</div>
    </section>
  );
}
