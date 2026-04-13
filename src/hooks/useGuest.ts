import { useState, useEffect } from 'react'
import { getGuestByCode } from '@/lib/queries'
import type { GuestLookupResult } from '@/types'

type GuestError = 'not_found' | 'network'

interface UseGuestResult {
  data:    GuestLookupResult | null
  loading: boolean
  error:   GuestError | null
}

export function useGuest(code: string): UseGuestResult {
  const [data,    setData]    = useState<GuestLookupResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<GuestError | null>(null)

  useEffect(() => {
    if (!code) {
      setError('not_found')
      setLoading(false)
      return
    }

    let cancelled = false

    getGuestByCode(code)
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const is404 =
            err instanceof Error && err.message.toLowerCase().includes('not found')
          setError(is404 ? 'not_found' : 'network')
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [code])

  return { data, loading, error }
}
