export default function Panel({ title, eyebrow, action, children, className = '' }) {
  return (
    <section className={`panel p-5 ${className}`}>
      {(title || eyebrow || action) && (
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
            {title && <h2 className="font-semibold text-ink">{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
