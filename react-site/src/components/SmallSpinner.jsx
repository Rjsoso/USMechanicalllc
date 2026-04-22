/**
 * Minimal inline loading indicator (no full-page takeover).
 */
export default function SmallSpinner({ label, variant = 'dark' }) {
  const isDark = variant === 'dark'
  const ring = isDark ? 'border-white/25 border-t-white' : 'border-black/15 border-t-black'
  const text = isDark ? 'text-white/70' : 'text-gray-600'

  return (
    <div className="flex flex-col items-center justify-center gap-2" aria-live="polite" aria-busy="true">
      <div
        className={`h-6 w-6 animate-spin rounded-full border-2 ${ring}`}
        role="status"
        aria-label={label || 'Loading'}
      />
      {label ? <p className={`text-sm ${text}`}>{label}</p> : null}
    </div>
  )
}
