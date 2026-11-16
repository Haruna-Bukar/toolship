import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Link to="/" className="mb-8 flex items-center gap-2 text-xl font-semibold">
        <Rocket className="h-6 w-6 text-teal" />
        Toolship
      </Link>

      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-card p-6 sm:p-8">
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-white/50">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>

      <p className="mt-6 text-sm text-white/50">{footer}</p>
    </div>
  );
}