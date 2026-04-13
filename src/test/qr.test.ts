import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { getInviteUrl } from '@/lib/qr'

describe('getInviteUrl', () => {
  const originalEnv = import.meta.env.VITE_PUBLIC_DOMAIN

  afterEach(() => {
    import.meta.env.VITE_PUBLIC_DOMAIN = originalEnv
  })

  it('returns absolute URL when VITE_PUBLIC_DOMAIN is set', () => {
    import.meta.env.VITE_PUBLIC_DOMAIN = 'https://casamiento.com'
    expect(getInviteUrl('GARCIA-2025')).toBe('https://casamiento.com/invite/GARCIA-2025')
  })

  it('returns relative URL when VITE_PUBLIC_DOMAIN is empty', () => {
    import.meta.env.VITE_PUBLIC_DOMAIN = ''
    expect(getInviteUrl('GARCIA-2025')).toBe('/invite/GARCIA-2025')
  })

  it('returns relative URL when VITE_PUBLIC_DOMAIN is undefined', () => {
    import.meta.env.VITE_PUBLIC_DOMAIN = undefined as unknown as string
    expect(getInviteUrl('GARCIA-2025')).toBe('/invite/GARCIA-2025')
  })
})
