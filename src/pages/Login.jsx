import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import PasswordField from "../components/PasswordField.jsx";
import { useAuth } from "../hooks/useAuth.js";

function friendlyError(message) {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "Wrong email or password.";
  if (m.includes("not confirmed")) return "Please confirm your email first. Check your inbox.";
  return message;
}

export default function Login() {
  const { user, signIn } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Go back to the page they were trying to open, or the homepage.
  const from = location.state?.from?.pathname || "/";
  if (user) return <Navigate to={from} replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    if (error) setError(friendlyError(error.message));
    setLoading(false);
    // On success, the auth listener updates "user" and the redirect above runs.
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Toolship account"
      footer={<>New to Toolship? <Link to="/signup" className="text-teal hover:underline">Create an account</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="mt-2 w-full rounded-lg border border-white/10 bg-bg px-3 py-2 text-sm outline-none focus:border-teal"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <div className="mt-2">
            <PasswordField value={password} onChange={setPassword} autoComplete="current-password" />
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-violet py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </AuthLayout>
  );
}