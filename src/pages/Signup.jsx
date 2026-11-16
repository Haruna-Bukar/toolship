import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import PasswordField from "../components/PasswordField.jsx";
import { useAuth } from "../hooks/useAuth.js";

export default function Signup() {
  const { user, signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const { data, error } = await signUp(email.trim(), password, name.trim());
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    // If email confirmation is on, there is no session yet. Ask them to check their inbox.
    if (!data.session) setCheckEmail(true);
    // If there is a session, the auth listener signs them in and the redirect above runs.
  }

  if (checkEmail) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle={`We sent a confirmation link to ${email}.`}
        footer={<>Already confirmed? <Link to="/login" className="text-teal hover:underline">Sign in</Link></>}
      >
        <p className="text-sm text-white/60">
          Open the link in that email to activate your account. If you do not see it, check your spam folder.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Free for 30 days. No credit card required."
      footer={<>Already have an account? <Link to="/login" className="text-teal hover:underline">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium">Full name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            className="mt-2 w-full rounded-lg border border-white/10 bg-bg px-3 py-2 text-sm outline-none focus:border-teal"
          />
        </div>

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
            <PasswordField value={password} onChange={setPassword} autoComplete="new-password" />
          </div>
          <p className="mt-1 text-xs text-white/40">At least 8 characters.</p>
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-violet py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </AuthLayout>
  );
}