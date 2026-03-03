import { useState, useEffect, useRef } from 'react'
import { client, liveClient } from '../utils/sanity'

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
  const [data, setData] = useState(initialData ?? null)
  const [loading, setLoading] = useState(typeof initialData === 'undefined')
  const [error, setError] = useState(null)
  const subscriptionRef = useRef(null)

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

    // Initial load: use initialData if provided, otherwise fetch via CDN for speed
    if (typeof initialData !== 'undefined') {
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

    // Subscribe to mutations; on any matching change, re-fetch (bypasses CDN)
    const listenQuery = listenFilter ?? query
    const observable = liveClient.listen(listenQuery, params)
    if (observable && typeof observable.subscribe === 'function') {
      subscriptionRef.current = observable.subscribe(() => {
        if (!cancelled) fetchData()
      })
    }

    return () => {
      cancelled = true
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
