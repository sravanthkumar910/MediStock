export default function StatCard({ label, value, sub, icon: Icon, tone = "primary" }) {
  const tones = {
    primary: "bg-primary-light text-primary",
    amber: "bg-amber-light text-amber",
    crit: "bg-crit-light text-crit",
    ok: "bg-ok-light text-ok",
  };
  return (
    <div className="rounded-lg border border-line bg-surface p-4 shadow-card">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        {Icon && (
          <span className={`grid h-8 w-8 place-items-center rounded ${tones[tone]}`}>
            <Icon size={16} strokeWidth={2} />
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-2xl font-semibold text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}
