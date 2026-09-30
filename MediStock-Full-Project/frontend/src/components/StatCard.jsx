export default function StatCard({ label, value, tone = 'default' }) {
  const tones = {
    default: 'border-[#dce8e2] text-[#153d38]',
    danger: 'border-[#f0c2b5] text-[#b65239] bg-[#fff5f1]',
    warning: 'border-[#ead6a8] text-[#9a6b16] bg-[#fffaf0]',
    success: 'border-[#b7d8ca] text-[#23765d] bg-[#f1faf5]',
  }
  return (
    <div className={`panel border-l-4 p-4 ${tones[tone]}`}>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="mt-1 text-xs font-bold uppercase tracking-wide text-gray-500">{label}</div>
    </div>
  )
}
