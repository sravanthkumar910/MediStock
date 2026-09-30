const styles = {
  IN_STOCK: 'bg-green-100 text-green-700',
  LOW_STOCK: 'bg-amber-100 text-amber-700',
  OUT_OF_STOCK: 'bg-red-100 text-red-700',
  OK: 'bg-green-100 text-green-700',
  NEAR_EXPIRY: 'bg-amber-100 text-amber-700',
  EXPIRED: 'bg-red-100 text-red-700',
}

export default function Badge({ status }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status?.replaceAll('_', ' ')}
    </span>
  )
}
