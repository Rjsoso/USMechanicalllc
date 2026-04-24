import { memo } from 'react'
import { EYEBROW_BY_ICON, ICON_MAP } from './whyUsConstants'

function WhyUsValueCard({ item }) {
  const icon = ICON_MAP[item.icon] || ICON_MAP.tool
  const eyebrow = item.icon ? EYEBROW_BY_ICON[item.icon] : null
  return (
    <article className="why-us-value-card flex h-full min-h-0 w-full min-w-0 flex-col rounded-xl border border-white/10 bg-white/[0.04] p-4 shadow-none transition-[border-color,background-color] duration-200 sm:p-5">
      <div className="mb-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/30 text-red-500 [&>img]:h-8 [&>img]:w-8">
        {icon}
      </div>
      {eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
          {eyebrow}
        </p>
      ) : null}
      <h3 className="mt-1.5 text-base font-bold leading-snug tracking-tight text-white sm:text-[17px]">
        {item.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-white/70 line-clamp-4 sm:line-clamp-5">
        {item.description}
      </p>
    </article>
  )
}

export default memo(WhyUsValueCard)
