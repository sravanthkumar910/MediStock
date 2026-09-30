import { AlertCircle, ChevronRight, Cross } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/app");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Brand / rail side */}
      <div className="relative hidden flex-col justify-between bg-primary-dark p-10 text-white md:flex">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded bg-white/15">
            <Cross size={18} />
          </span>
          <span className="font-display text-lg font-semibold">MediStock</span>
        </div>

        <div>
          <p className="font-display text-3xl font-semibold leading-tight">
            Every batch tracked.
            <br />
            Every expiry watched.
          </p>
          <p className="mt-4 max-w-sm text-sm text-white/70">
            A single inventory record for pharmacies, hospitals, and clinics —
            stock levels, supplier history, and expiry windows in one place.
          </p>
        </div>

        <p className="border-t border-white/15 pt-6 text-xs text-white/60">
          Secure access for your pharmacy team.
        </p>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 md:hidden">
            <span className="grid h-9 w-9 place-items-center rounded bg-primary text-white">
              <Cross size={18} />
            </span>
          </div>

          <p className="font-mono text-xs uppercase tracking-wider text-muted">Sign in</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">Access your inventory dashboard.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@medistock.app"
                className="focus-ring w-full rounded border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="focus-ring w-full rounded border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted"
              />
            </div>

            {error && (
              <p className="flex items-center gap-1.5 rounded bg-crit-light px-3 py-2 text-xs text-crit">
                <AlertCircle size={13} /> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="focus-ring flex w-full items-center justify-center gap-1.5 rounded bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ChevronRight size={15} />}
            </button>

            <button
              type="button"
              className="focus-ring w-full rounded border border-line py-2.5 text-sm font-medium text-ink hover:bg-bg"
            >
              Continue with Google (OAuth2)
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            New to MediStock?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
