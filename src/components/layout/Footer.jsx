export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
        <p>© {new Date().getFullYear()} Caribbean Skyways. Todos los derechos reservados.</p>
        <p className="text-slate-400">
          San Juan • Miami • Quito • Guayaquil • Cuenca • New York
        </p>
      </div>
    </footer>
  );
}
