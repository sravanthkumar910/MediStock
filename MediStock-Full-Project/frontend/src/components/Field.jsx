export function Field({ label, id, hint, error, className = '', ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-muted">
        {label}
      </label>
      <input
        id={id}
        className="min-h-10 w-full border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition placeholder:text-gray-400 focus:border-mint-dark focus:ring-2 focus:ring-mint-soft"
        aria-invalid={Boolean(error)}
        aria-describedby={hint || error ? `${id}-message` : undefined}
        {...props}
      />
      {(hint || error) && <p id={`${id}-message`} className={`mt-1 text-xs ${error ? 'text-coral' : 'text-gray-500'}`}>{error || hint}</p>}
    </div>
  )
}

export function SelectField({ label, id, children, className = '', ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-muted">
        {label}
      </label>
      <select
        id={id}
        className="min-h-10 w-full border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-mint-dark focus:ring-2 focus:ring-mint-soft"
        {...props}
      >
        {children}
      </select>
    </div>
  )
}
