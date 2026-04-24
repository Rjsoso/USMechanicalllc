import { memo } from 'react'
import { EYEBROW_BY_ICON, ICON_MAP } from './whyUsConstants'

/**
 * Readability: pure text on the full-bleed photo is harsh; a light frosted panel
 * (not the old heavy “glass block”) keeps contrast stable without looking boxed-in.
 */
function WhyUsValueCard({ item }) {
  const icon = ICON_MAP[item.icon] || ICON_MAP.tool
  const eyebrow = item.icon ? EYEBROW_BY_ICON[item.icon] : null
  return (
    <article className="why-us-value-card flex h-full min-h-0 w-full min-w-0 flex-col rounded-xl border border-white/10 bg-black/45 p-4 shadow-none backdrop-blur-sm transition-[background-color,box-shadow] duration-200 sm:p-5">
      <div className="mb-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-black/40 sm:h-11 sm:w-11 [&>img]:h-8 [&>img]:w-8 sm:[&>img]:h-9 sm:[&>img]:w-9">
        {icon}
      </div>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 sm:text-sm">
          {eyebrow}
        </p>
      ) : null}
      <h3 className="mt-1.5 text-lg font-bold leading-snug tracking-tight text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.5)] sm:text-xl">
        {item.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-white/90 line-clamp-4 [text-shadow:0_1px_3px_rgba(0,0,0,0.55)] sm:mt-2.5 sm:text-base sm:leading-relaxed sm:line-clamp-5">
        {item.description}
      </p>
    </article>
  )
}

export default memo(WhyUsValueCard)
