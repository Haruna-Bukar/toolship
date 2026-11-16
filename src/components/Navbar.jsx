import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";

const links = ["Products", "Tools", "Pricing", "Company", "Docs", "Blog"];

export default function Navbar() {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-bg/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
          <Rocket className="h-5 w-5 text-teal" />
          Toolship
        </Link>

        <ul className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          {links.map((l) => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`} className="transition-colors hover:text-white">
                {l}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {!loading && !user && (
            <>
              <Link to="/login" className="text-sm text-white/70 transition-colors hover:text-white">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
              >
                Get Started
              </Link>
            </>
          )}
          {!loading && user && (
            <>
              <a
                href="#tools"
                className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
              >
                Open Tools
              </a>
              <button onClick={signOut} className="text-sm text-white/70 transition-colors hover:text-white">
                Sign Out
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}