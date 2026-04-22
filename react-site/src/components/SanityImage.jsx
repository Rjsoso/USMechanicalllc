import PropTypes from 'prop-types'
import { urlFor } from '../utils/sanity'

/**
 * SanityImage
 *
 * Renders a responsive <img> from a Sanity image source with:
 *   - WebP-first srcset at common breakpoint widths
 *   - Explicit width/height attributes to reserve layout (prevents CLS)
 *   - Optional loading="lazy" / decoding="async" (default) for off-screen images
 *   - Optional fetchPriority override for above-the-fold hero images
 *
 * Non-goals:
 *   - This component is NOT intended for CSS background images. For those,
 *     keep using urlFor(...).width(X).url() directly.
 *   - Callers are expected to handle alt text correctly (decorative vs content).
 *
 * Usage:
 *   <SanityImage
 *     image={project.images[0]}
 *     alt={project.title}
 *     width={800}
 *     height={600}
 *     sizes="(max-width: 768px) 100vw, 50vw"
 *   />
 */
const DEFAULT_WIDTHS = [400, 600, 800, 1200, 1600, 2000]

const SanityImage = ({
  image,
  alt,
  width,
  height,
  sizes = '100vw',
  widths = DEFAULT_WIDTHS,
  quality = 80,
  priority = false,
  className,
  style,
  fit = 'crop',
}) => {
  if (!image || !image.asset) return null

  const intrinsicWidth = width ?? 1200
  const intrinsicHeight = height ?? null

  const buildUrl = (w) => {
    try {
      let b = urlFor(image).width(w).quality(quality).auto('format').format('webp')
      if (intrinsicHeight) {
        const scaledHeight = Math.round((intrinsicHeight / intrinsicWidth) * w)
        b = b.height(scaledHeight).fit(fit)
      }
      return b.url()
    } catch {
      return null
    }
  }

  const primarySrc = buildUrl(intrinsicWidth)
  if (!primarySrc) return null

  const srcSet = widths
    .map((w) => {
      const url = buildUrl(w)
      return url ? `${url} ${w}w` : null
    })
    .filter(Boolean)
    .join(', ')

  return (
    <img
      src={primarySrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt ?? ''}
      width={intrinsicWidth}
      height={intrinsicHeight || undefined}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchpriority={priority ? 'high' : undefined}
      className={className}
      style={style}
    />
  )
}

SanityImage.propTypes = {
  image: PropTypes.object,
  alt: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sizes: PropTypes.string,
  widths: PropTypes.arrayOf(PropTypes.number),
  quality: PropTypes.number,
  priority: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  fit: PropTypes.string,
}

export default SanityImage
