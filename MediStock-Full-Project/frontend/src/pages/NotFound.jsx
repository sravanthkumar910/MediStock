import { Link } from "react-router-dom";
import { Cross } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-4 text-center">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-light text-primary">
        <Cross size={20} />
      </span>
      <h1 className="font-display text-2xl font-semibold text-ink">Page not found</h1>
      <p className="max-w-xs text-sm text-muted">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="focus-ring mt-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
        Back to MediStock
      </Link>
    </div>
  );
}
