import { STATUS_STYLES } from "../../utils/format";

export default function StatusPill({ status, label }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.info;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.bg} ${s.text} ring-1 ${s.ring}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {label}
    </span>
  );
}
