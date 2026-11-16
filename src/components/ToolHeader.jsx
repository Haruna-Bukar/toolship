import { Link } from "react-router-dom";
import { Rocket, Bell, HelpCircle, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";

const DEFAULT_TABS = ["Generator", "History", "Templates", "Docs"];

// The page owns the active tab, so it can decide what content to show.
export default function ToolHeader({ toolName, activeTab, onTabChange, tabs = DEFAULT_TABS }) {
  const { user, signOut } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email || "";
  const initial = displayName.charAt(0).toUpperCase() || "U";

  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Rocket className="h-5 w-5 text-teal" />
          Toolship
          <span className="hidden text-white/40 sm:inline">/ {toolName}</span>
        </Link>

        <div className="flex items-center gap-4 text-white/60">
          <Bell className="h-5 w-5" />
          <HelpCircle className="h-5 w-5" />
          <div
            title={displayName}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-sm font-semibold text-bg"
          >
            {initial}
          </div>
          <button onClick={signOut} title="Sign out" aria-label="Sign out" className="hover:text-white">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      <nav className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 text-sm sm:px-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            className={`border-b-2 pb-3 ${
              activeTab === t ? "border-teal text-white" : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>
    </header>
  );
}