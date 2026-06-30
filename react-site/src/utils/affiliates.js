const SNYDER_MECHANICAL_URL = 'https://www.snydermechanical.com/'

/** Split tagline / addresses: use `|` in Sanity or separate lines */
export function affiliateDescriptionSegments(description) {
  if (!description?.trim()) return []
  const raw = description.trim()
  const byPipe = raw.split('|').map((s) => s.trim()).filter(Boolean)
  if (byPipe.length > 1) return byPipe
  return raw.split(/\n+/).map((s) => s.trim()).filter(Boolean)
}

export function resolveAffiliateUrl(affiliate) {
  const url = affiliate?.url?.trim()
  if (url) return url
  if (affiliate?.name?.trim().toLowerCase() === 'snyder mechanical') {
    return SNYDER_MECHANICAL_URL
  }
  return null
}
