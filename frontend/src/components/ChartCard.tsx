import type { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  insight?: string;
  children: ReactNode;
};

export function ChartCard({ title, insight, children }: ChartCardProps) {
  return (
    <section className="premium-card p-6 flex flex-col">
      <div className="mb-6 pb-4 border-b border-cazador-border/60">
        <h2 className="text-xl font-serif font-bold text-cazador-cream">{title}</h2>
        {insight ? <p className="mt-2 text-sm leading-6 text-cazador-cream/60 font-light">{insight}</p> : null}
      </div>
      <div className="h-[350px] w-full mt-auto relative z-10">{children}</div>
    </section>
  );
}
