type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  description: string;
};

export function PageHeader({ title, eyebrow, description }: PageHeaderProps) {
  return (
    <header className="mb-10 relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-cazador-amber/20 to-cazador-gold/10 blur-2xl -z-10 opacity-60"></div>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-widest text-cazador-amber mb-2">{eyebrow}</p>
      ) : null}
      <h1 className="text-4xl font-serif font-bold text-cazador-cream md:text-5xl drop-shadow-sm">{title}</h1>
      <div className="w-16 h-1 bg-gradient-to-r from-cazador-amber to-cazador-orange mt-4 rounded-full"></div>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-cazador-cream/80 font-light">{description}</p>
    </header>
  );
}
