const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

const DIVISIONS = [
  { amount: 60, unit: 'seconds' },
  { amount: 60, unit: 'minutes' },
  { amount: 24, unit: 'hours' },
  { amount: 7, unit: 'days' },
  { amount: 4.34524, unit: 'weeks' },
  { amount: 12, unit: 'months' },
  { amount: Number.POSITIVE_INFINITY, unit: 'years' },
]

/** Turns a millisecond timestamp into "3 hours ago" style text. */
export function timeAgo(timestamp) {
  if (!timestamp) return 'just now'

  let duration = (Number(timestamp) - Date.now()) / 1000

  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit)
    }
    duration /= division.amount
  }

  return 'just now'
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
