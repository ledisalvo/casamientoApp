// ============================================================
// Domain types — Wedding RSVP
// ============================================================

export type DietaryOption = 'ninguna' | 'vegetariano' | 'vegano' | 'celiaco' | 'otro'

export type RSVPStatus = 'confirmed' | 'declined' | 'pending'

export interface Guest {
  id: string
  code: string
  name: string
  email: string | null
  max_seats: number
  created_at: string
}

export interface RSVPResponse {
  id: string
  guest_id: string
  attending: boolean
  seat_count: number | null
  dietary: DietaryOption
  responded_at: string
}

export interface GuestWithRSVP extends Guest {
  rsvp: RSVPResponse | null
}

export interface AppConfig {
  key: string
  value: string
  updated_at: string
}

export interface Metrics {
  total_guests: number
  confirmed_people: number
  pending_count: number
  declined_count: number
}

// Returned by the get-guest-by-code Edge Function
export interface GuestLookupResult {
  guest: Pick<Guest, 'id' | 'code' | 'name' | 'max_seats'>
  rsvp: Pick<RSVPResponse, 'id' | 'attending' | 'seat_count' | 'dietary' | 'responded_at'> | null
}
