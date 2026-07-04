import type { ReactNode } from "react";

type StoryInsightProps = {
  title: string;
  children: ReactNode;
};

export function StoryInsight({ title, children }: StoryInsightProps) {
  return (
    <aside className="rounded-lg border-l-4 border-cazador-gold bg-gradient-to-r from-cazador-gold/10 to-transparent p-6 text-sm leading-relaxed text-cazador-cream/80 shadow-sm backdrop-blur-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <svg className="w-16 h-16 text-cazador-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 3.8l7.2 14.4H4.8L12 5.8z"/></svg>
      </div>
      <strong className="block text-cazador-amber font-serif text-lg mb-2">{title}</strong>
      <div className="relative z-10">{children}</div>
    </aside>
  );
}
