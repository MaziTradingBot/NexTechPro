import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-7xl font-black text-gradient">404</p>
      <h1 className="mt-4 text-2xl font-bold text-white">Page not found</h1>
      <p className="mt-2 text-slate-400">The page you’re looking for doesn’t exist or was moved.</p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Back to home
      </Link>
    </div>
  );
}
