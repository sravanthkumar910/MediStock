export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  loading = false,
  className = '',
  ...props
}) {
  const variants = {
    primary: 'bg-ink text-white hover:bg-ink-soft',
    secondary: 'border border-line bg-white text-ink hover:bg-mint-soft',
    danger: 'border border-coral-line bg-white text-coral hover:bg-coral-soft',
    text: 'text-coral hover:text-coral-dark',
  }

  return (
    <button
      type={type}
      className={`inline-flex min-h-10 items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide transition focus:outline-none focus:ring-2 focus:ring-mint ${variants[variant]} disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />}
      {loading ? 'Working...' : children}
    </button>
  )
}
