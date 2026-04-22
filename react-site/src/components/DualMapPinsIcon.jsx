import { memo } from 'react'
import { MdLocationOn } from 'react-icons/md'
import './DualMapPinsIcon.css'

/**
 * Two stacked map pins (filled teardrop), similar to Google / Apple Maps markers.
 */
function DualMapPinsIcon({ className = '' }) {
  return (
    <span className={`dual-map-pins ${className}`.trim()} aria-hidden>
      <MdLocationOn className="dual-map-pins__svg dual-map-pins__svg--rear" />
      <MdLocationOn className="dual-map-pins__svg dual-map-pins__svg--front" />
    </span>
  )
}

export default memo(DualMapPinsIcon)
