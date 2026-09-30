export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line py-14 text-center">
      {Icon && (
        <span className="mb-1 grid h-11 w-11 place-items-center rounded-full bg-primary-light text-primary">
          <Icon size={20} />
        </span>
      )}
      <p className="font-display text-sm font-semibold text-ink">{title}</p>
      {message && <p className="max-w-xs text-sm text-muted">{message}</p>}
      {action}
    </div>
  );
}
