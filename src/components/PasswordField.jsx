import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordField({ value, onChange, autoComplete }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        id="password"
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required
        className="w-full rounded-lg border border-white/10 bg-bg px-3 py-2 pr-10 text-sm outline-none focus:border-teal"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}