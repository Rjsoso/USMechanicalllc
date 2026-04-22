import { useState, useEffect, useRef } from 'react'
import { client, liveClient } from '../utils/sanity'

/**
 * Live mutations from Sanity Studio can fire many events in quick succession
 * (e.g. while an editor is typing). Coalesce them into a single refetch per
 * window so we don't hammer the API.
 */
const LIVE_REFETCH_DEBOUNCE_MS = 300

/**
 * Real-time Sanity data hook. Fetches once (or uses initialData), then subscribes
 * to document changes and re-fetches when mutations occur so the UI stays in sync
 * with Sanity Studio without page refresh.
 *
 * @param {string} query - GROQ query (full query used for fetch; listen uses filter only)
 * @param {object} params - Query params ($-prefixed)
 * @param {object} options - { initialData, listenFilter }
 *   - initialData: use as initial state and skip first CDN fetch
 *   - listenFilter: GROQ filter for listen (e.g. '*[_type == "heroSection"]'); if omitted, query is used
 * @returns {{ data: any, loading: boolean, error: Error | null }}
 */
export function useSanityLive(query, params = {}, options = {}) {
  const { initialData, listenFilter } = options
  const hasInitialData = initialData != null
  const [data, setData] = useState(initialData ?? null)
  const [loading, setLoading] = useState(!hasInitialData)
  const [error, setError] = useState(null)
  const subscriptionRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    const fetchData = () => {
      return liveClient
        .fetch(query, params)
        .then((result) => {
          if (!cancelled) {
            setData(result)
            setError(null)
          }
        })
        .catch((err) => {
          if (!cancelled) {
            setError(err)
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }

    const scheduleRefetch = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        if (!cancelled) fetchData()
      }, LIVE_REFETCH_DEBOUNCE_MS)
    }

    // Initial load: skip fetch only when we have usable initial data (not null/undefined)
    if (hasInitialData) {
      setData(initialData)
      setLoading(false)
    } else {
      setLoading(true)
      client
        .fetch(query, params)
        .then((result) => {
          if (!cancelled) {
            setData(result)
            setError(null)
          }
        })
        .catch((err) => {
          if (!cancelled) setError(err)
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }

    // Subscribe to mutations; on any matching change, re-fetch (bypasses CDN).
    // Debounce to coalesce bursts of events into a single request.
    const listenQuery = listenFilter ?? query
    const observable = liveClient.listen(listenQuery, params)
    if (observable && typeof observable.subscribe === 'function') {
      subscriptionRef.current = observable.subscribe(() => {
        if (!cancelled) scheduleRefetch()
      })
    }

    return () => {
      cancelled = true
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
        debounceRef.current = null
      }
      if (subscriptionRef.current) {
        if (typeof subscriptionRef.current.unsubscribe === 'function') {
          subscriptionRef.current.unsubscribe()
        }
        subscriptionRef.current = null
      }
    }
  }, [query, JSON.stringify(params), listenFilter])

  return { data, loading, error }
}
