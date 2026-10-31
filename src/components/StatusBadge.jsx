import { getStatus } from '../lib/constants'

export default function StatusBadge({ status, size = 'sm' }) {
  const meta = getStatus(status)
  const sizing = size === 'md' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full font-medium ring-1 ring-inset ${meta.badge} ${sizing}`}
    >
      <span className={`size-1.5 rounded-full ${meta.dot}`} aria-hidden="true" />
      {meta.label}
    </span>
  )
}
