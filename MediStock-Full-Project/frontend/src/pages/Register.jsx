import { AlertCircle, ChevronRight, Cross } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/app");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-6">
      <div className="w-full max-w-sm rounded-lg border border-line bg-surface p-7 shadow-card">
        <span className="grid h-9 w-9 place-items-center rounded bg-primary text-white">
          <Cross size={18} />
        </span>
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-muted">Set up access to the MediStock inventory platform.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink">Full name</label>
            <input
              required
              value={form.name}
              onChange={update("name")}
              placeholder="Jordan Vance"
              className="focus-ring w-full rounded border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={update("email")}
              placeholder="you@medistock.app"
              className="focus-ring w-full rounded border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={update("password")}
              placeholder="Minimum 8 characters"
              className="focus-ring w-full rounded border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink">Phone (optional)</label>
            <input
              type="tel"
              value={form.phone}
              onChange={update("phone")}
              placeholder="+91 98765 43210"
              className="focus-ring w-full rounded border border-line bg-surface px-3 py-2.5 text-sm text-ink"
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
            {loading ? "Creating account..." : "Create account"}
            {!loading && <ChevronRight size={15} />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
