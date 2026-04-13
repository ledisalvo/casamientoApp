import { useState, useEffect, useCallback } from 'react'
import { listGuestsWithRSVP, getMetrics } from '@/lib/queries'
import type { GuestWithRSVP, Metrics } from '@/types'

interface UseGuestsResult {
  guests:  GuestWithRSVP[]
  metrics: Metrics | null
  loading: boolean
  error:   string | null
  refetch: () => void
}

export function useGuests(): UseGuestsResult {
  const [guests,  setGuests]  = useState<GuestWithRSVP[]>([])
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const [tick,    setTick]    = useState(0)

  const refetch = useCallback(() => setTick((n) => n + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([listGuestsWithRSVP(), getMetrics()])
      .then(([guestData, metricsData]) => {
        if (!cancelled) {
          setGuests(guestData as GuestWithRSVP[])
          setMetrics(metricsData)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Error al cargar los invitados.')
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [tick])

  return { guests, metrics, loading, error, refetch }
}
