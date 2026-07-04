type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  description: string;
};

export function PageHeader({ title, eyebrow, description }: PageHeaderProps) {
  return (
    <header className="mb-6">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wide text-cazador-orange">{eyebrow}</p>
      ) : null}
      <h1 className="mt-2 text-3xl font-bold text-cazador-brown md:text-4xl">{title}</h1>
      <p className="mt-3 max-w-4xl text-base leading-7 text-stone-700">{description}</p>
    </header>
  );
}
