import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function Hero() {
  const { user } = useAuth();

  return (
    <section className="mx-auto max-w-4xl px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28">
      <span className="inline-block rounded-full border border-teal/30 bg-teal/10 px-4 py-1.5 text-xs font-medium text-teal">
        Free for 30 days • No credit card required
      </span>

      <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
        All AI Tools You Need In One Ship
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-base text-white/60 sm:text-lg">
        Supercharge your work with 10+ powerful AI tools inside Toolship. Built for creators,
        developers, and teams across Africa. Fast, reliable, and easy to use, all in one dashboard.
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href="#tools"
          className="w-full rounded-lg border border-white/15 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/5 sm:w-auto"
        >
          Explore Tools
        </a>
        {!user && (
          <Link
            to="/signup"
            className="w-full rounded-lg bg-violet px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 sm:w-auto"
          >
            Launch Toolship Free
          </Link>
        )}
      </div>
    </section>
  );
}