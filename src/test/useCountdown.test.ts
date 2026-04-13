import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCountdown } from '@/hooks/useCountdown'

describe('useCountdown', () => {
  afterEach(() => vi.useRealTimers())

  it('returns zeroes when target is in the past', () => {
    // Set current time to after the wedding
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-12-01T00:00:00Z'))

    const { result } = renderHook(() => useCountdown())
    expect(result.current).toEqual({ days: '00', hours: '00', minutes: '00', seconds: '00' })
  })

  it('returns non-zero values when target is in the future', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'))

    const { result } = renderHook(() => useCountdown())
    expect(parseInt(result.current.days)).toBeGreaterThan(0)
  })

  it('clears the interval on unmount', () => {
    vi.useFakeTimers()
    const clearSpy = vi.spyOn(globalThis, 'clearInterval')

    const { unmount } = renderHook(() => useCountdown())
    unmount()

    expect(clearSpy).toHaveBeenCalled()
    clearSpy.mockRestore()
  })

  it('updates every second', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'))

    const { result } = renderHook(() => useCountdown())
    const initial = result.current.seconds

    act(() => { vi.advanceTimersByTime(1000) })

    // Seconds should have changed (decremented)
    const after = result.current.seconds
    expect(after).not.toBe(initial)
  })
})
