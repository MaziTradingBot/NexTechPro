export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="wrap max-w-3xl py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-white">{title}</h1>
      {updated && <p className="mt-2 text-sm text-slate-500">Last updated: {updated}</p>}
      <div className="mt-8 space-y-3 text-sm leading-relaxed text-slate-300 [&_a]:text-brand-300 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white [&_li]:mt-1 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}
