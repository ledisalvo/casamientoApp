import { describe, it, expect } from 'vitest'
import { getStatus, buildCSVString } from '@/lib/csv'
import type { GuestWithRSVP } from '@/types'

function makeGuest(overrides: Partial<GuestWithRSVP> = {}): GuestWithRSVP {
  return {
    id:         'uuid-1',
    code:       'TEST-001',
    name:       'Familia Test',
    email:      null,
    max_seats:  4,
    created_at: '2025-01-01T00:00:00Z',
    rsvp:       null,
    ...overrides,
  }
}

describe('getStatus', () => {
  it('returns pending when no rsvp', () => {
    expect(getStatus(makeGuest())).toBe('pending')
  })

  it('returns confirmed when attending = true', () => {
    const g = makeGuest({
      rsvp: { id: 'r1', guest_id: 'uuid-1', attending: true, seat_count: 2, dietary: 'ninguna', responded_at: '2025-09-01T10:00:00Z' },
    })
    expect(getStatus(g)).toBe('confirmed')
  })

  it('returns declined when attending = false', () => {
    const g = makeGuest({
      rsvp: { id: 'r1', guest_id: 'uuid-1', attending: false, seat_count: null, dietary: 'ninguna', responded_at: '2025-09-01T10:00:00Z' },
    })
    expect(getStatus(g)).toBe('declined')
  })
})

describe('buildCSVString', () => {
  it('starts with UTF-8 BOM', () => {
    const csv = buildCSVString([makeGuest()])
    expect(csv.startsWith('\uFEFF')).toBe(true)
  })

  it('includes Pendiente for guests with no rsvp', () => {
    const csv = buildCSVString([makeGuest()])
    expect(csv).toContain('Pendiente')
  })

  it('pending rows have empty date column', () => {
    const csv = buildCSVString([makeGuest()])
    // Last column (date) should be empty — row ends with two commas (dietary empty + date empty)
    const dataLine = csv.split('\n')[1]
    expect(dataLine.endsWith(',')).toBe(true)
  })

  it('escapes names containing commas', () => {
    const csv = buildCSVString([makeGuest({ name: 'García, Juan' })])
    expect(csv).toContain('"García, Juan"')
  })

  it('includes confirmed people count and dietary', () => {
    const g = makeGuest({
      rsvp: { id: 'r1', guest_id: 'uuid-1', attending: true, seat_count: 3, dietary: 'vegano', responded_at: '2025-09-01T10:00:00Z' },
    })
    const csv = buildCSVString([g])
    expect(csv).toContain('Confirmado')
    expect(csv).toContain('3')
    expect(csv).toContain('Vegano')
  })
})
