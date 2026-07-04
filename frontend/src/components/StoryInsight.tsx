import type { ReactNode } from "react";

type StoryInsightProps = {
  title: string;
  children: ReactNode;
};

export function StoryInsight({ title, children }: StoryInsightProps) {
  return (
    <aside className="rounded-lg border-l-4 border-cazador-amber bg-white p-4 text-sm leading-6 text-stone-700 shadow-sm">
      <strong className="block text-cazador-brown">{title}</strong>
      {children}
    </aside>
  );
}
