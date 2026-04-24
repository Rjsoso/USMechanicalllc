import { memo } from 'react'
import { EYEBROW_BY_ICON, ICON_MAP } from './whyUsConstants'

function WhyUsValueCard({ item }) {
  const icon = ICON_MAP[item.icon] || ICON_MAP.tool
  const eyebrow = item.icon ? EYEBROW_BY_ICON[item.icon] : null
  return (
    <article className="why-us-value-card flex h-full min-h-0 w-full min-w-0 flex-col py-1">
      <div className="mb-3 flex h-11 w-11 shrink-0 items-center justify-center text-red-500 drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)] sm:h-12 sm:w-12 [&>img]:h-9 [&>img]:w-9 sm:[&>img]:h-10 sm:[&>img]:w-10">
        {icon}
      </div>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65 sm:text-sm">
          {eyebrow}
        </p>
      ) : null}
      <h3 className="mt-2 text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl sm:leading-tight">
        {item.title}
      </h3>
      <p className="mt-2.5 text-base leading-relaxed text-white/88 line-clamp-4 sm:mt-3 sm:text-lg sm:leading-relaxed sm:line-clamp-5">
        {item.description}
      </p>
    </article>
  )
}

export default memo(WhyUsValueCard)
