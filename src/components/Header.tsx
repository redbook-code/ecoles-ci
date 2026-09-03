import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="bg-white text-blue-900 rounded px-2 py-1 text-sm font-bold">
            CI
          </span>
          ECOLES CI
        </Link>
        <nav className="hidden sm:flex gap-6 text-sm">
          <Link href="/recherche" className="hover:text-blue-200 transition">
            Rechercher
          </Link>
          <Link href="/carte" className="hover:text-blue-200 transition">
            Carte
          </Link>
          <Link href="/admin" className="hover:text-blue-200 transition">
            Administration
          </Link>
        </nav>
      </div>
    </header>
  );
}