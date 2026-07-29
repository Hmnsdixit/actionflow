const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

/**
 * Deterministic date formatter that renders identically on server and client,
 * avoiding hydration mismatches caused by toLocaleDateString()'s locale/timezone dependence.
 * Always uses UTC so server and browser agree regardless of their local timezone.
 */
export function formatDate(isoString: string): string {
  const d = new Date(isoString)
  const month = MONTHS[d.getUTCMonth()]
  const day = d.getUTCDate()
  const year = d.getUTCFullYear()
  return `${month} ${day}, ${year}`
}