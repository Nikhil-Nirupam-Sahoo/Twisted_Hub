export const CATEGORIES = [
  { value: 'facilities', label: 'Facilities', emoji: '🏢' },
  { value: 'wifi', label: 'Wi-Fi & Network', emoji: '📶' },
  { value: 'hostel', label: 'Hostel', emoji: '🛏️' },
  { value: 'canteen', label: 'Canteen', emoji: '🍽️' },
  { value: 'academics', label: 'Academics', emoji: '📚' },
  { value: 'maintenance', label: 'Maintenance', emoji: '🔧' },
  { value: 'safety', label: 'Safety', emoji: '🛡️' },
  { value: 'transport', label: 'Transport', emoji: '🚌' },
  { value: 'other', label: 'Other', emoji: '📌' },
]

export const STATUSES = [
  {
    value: 'open',
    label: 'Open',
    badge: 'bg-amber-400/10 text-amber-300 ring-amber-400/30',
    dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]',
    select: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  },
  {
    value: 'in_progress',
    label: 'In Progress',
    badge: 'bg-cyan-400/10 text-cyan-300 ring-cyan-400/30',
    dot: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]',
    select: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200',
  },
  {
    value: 'resolved',
    label: 'Resolved',
    badge: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/30',
    dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]',
    select: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  },
]

export const getCategory = (value) =>
  CATEGORIES.find((category) => category.value === value) ?? {
    value: 'other',
    label: 'Other',
    emoji: '📌',
  }

export const getStatus = (value) =>
  STATUSES.find((status) => status.value === value) ?? STATUSES[0]
