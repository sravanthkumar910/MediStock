export function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

// Single source of truth for the expiry traffic-light used across the app.
export function expiryStatus(dateStr) {
  const days = daysUntil(dateStr);
  if (days < 0) return { key: "expired", label: "Expired", days };
  if (days <= 15) return { key: "critical", label: `${days}d left`, days };
  if (days <= 45) return { key: "warning", label: `${days}d left`, days };
  return { key: "ok", label: `${days}d left`, days };
}

export function stockStatus(quantity, reorderLevel) {
  if (quantity <= 0) return { key: "critical", label: "Out of stock" };
  if (quantity <= reorderLevel) return { key: "warning", label: "Low stock" };
  return { key: "ok", label: "In stock" };
}

export function currency(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const STATUS_STYLES = {
  ok: { dot: "bg-ok", text: "text-ok", bg: "bg-ok-light", ring: "ring-ok/20" },
  warning: { dot: "bg-amber", text: "text-amber", bg: "bg-amber-light", ring: "ring-amber/20" },
  critical: { dot: "bg-crit", text: "text-crit", bg: "bg-crit-light", ring: "ring-crit/20" },
  expired: { dot: "bg-crit", text: "text-crit", bg: "bg-crit-light", ring: "ring-crit/20" },
  info: { dot: "bg-info", text: "text-info", bg: "bg-info-light", ring: "ring-info/20" },
};
