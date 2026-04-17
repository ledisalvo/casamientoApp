import { supabase } from '@/lib/supabase'
import type { DietaryOption, GuestLookupResult, GuestMember } from '@/types'

// ── Invite page ──────────────────────────────────────────────

export async function getGuestByCode(code: string): Promise<GuestLookupResult> {
  const { data, error } = await supabase.functions.invoke<GuestLookupResult>(
    'get-guest-by-code',
    { body: { code } }
  )
  if (error) throw error
  if (!data) throw new Error('Empty response from Edge Function')
  return data
}

export async function getRSVPDeadline(): Promise<Date | null> {
  const { data, error } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'rsvp_deadline')
    .single()

  if (error || !data?.value) return null
  const date = new Date(data.value)
  return isNaN(date.getTime()) ? null : date
}

export async function submitRSVP(params: {
  guestId:   string
  attending: boolean
  seatCount: number | null
  dietary:   DietaryOption
}): Promise<void> {
  const { error } = await supabase.from('rsvp_responses').insert({
    guest_id:   params.guestId,
    attending:  params.attending,
    seat_count: params.attending ? params.seatCount : null,
    dietary:    params.attending ? params.dietary : 'ninguna',
  })
  if (error) throw error
}

// ── Admin dashboard ──────────────────────────────────────────

export async function listGuestsWithRSVP() {
  const { data, error } = await supabase
    .from('guests')
    .select(`
      id, code, name, email, max_seats, created_at,
      rsvp_responses ( id, attending, seat_count, dietary, responded_at )
    `)
    .order('name')

  if (error) throw error
  return (data ?? []).map((g) => ({
    ...g,
    rsvp: Array.isArray(g.rsvp_responses) ? (g.rsvp_responses[0] ?? null) : null,
  }))
}

export async function getMetrics() {
  const guests = await listGuestsWithRSVP()
  return {
    total_guests:     guests.length,
    confirmed_people: guests
      .filter((g) => g.rsvp?.attending === true)
      .reduce((sum, g) => sum + (g.rsvp?.seat_count ?? 0), 0),
    pending_count:  guests.filter((g) => !g.rsvp).length,
    declined_count: guests.filter((g) => g.rsvp?.attending === false).length,
  }
}

export async function createGuest(params: {
  code:      string
  name:      string
  email:     string | null
  max_seats: number
}) {
  const { error } = await supabase.from('guests').insert(params)
  if (error) throw error
}

export async function updateGuest(
  id: string,
  params: { code?: string; name?: string; email?: string | null; max_seats?: number }
) {
  const { error } = await supabase.from('guests').update(params).eq('id', id)
  if (error) throw error
}

export async function deleteGuest(id: string) {
  const { error } = await supabase.from('guests').delete().eq('id', id)
  if (error) throw error
}

export async function createGuestWithMembers(params: {
  familyName: string
  members:    { name: string; email: string | null }[]
}) {
  const code = generateCode(params.familyName)

  const { data: guest, error: guestError } = await supabase
    .from('guests')
    .insert({ name: params.familyName, code, email: null, max_seats: params.members.length })
    .select('id')
    .single()

  if (guestError) throw guestError

  if (params.members.length > 0) {
    const rows = params.members.map((m) => ({
      guest_id: guest.id,
      name:     m.name,
      email:    m.email || null,
    }))
    const { error: membersError } = await supabase.from('guest_members').insert(rows)
    if (membersError) throw membersError
  }

  return guest.id
}

export async function listGuestMembers(guestId: string): Promise<GuestMember[]> {
  const { data, error } = await supabase
    .from('guest_members')
    .select('*')
    .eq('guest_id', guestId)
    .order('created_at')

  if (error) throw error
  return data ?? []
}

export async function updateGuestWithMembers(
  guestId: string,
  params: {
    familyName: string
    members:    { name: string; email: string | null }[]
  }
) {
  const { error: guestError } = await supabase
    .from('guests')
    .update({ name: params.familyName, max_seats: params.members.length })
    .eq('id', guestId)

  if (guestError) throw guestError

  // replace all members
  const { error: deleteError } = await supabase
    .from('guest_members')
    .delete()
    .eq('guest_id', guestId)

  if (deleteError) throw deleteError

  if (params.members.length > 0) {
    const rows = params.members.map((m) => ({
      guest_id: guestId,
      name:     m.name,
      email:    m.email || null,
    }))
    const { error: insertError } = await supabase.from('guest_members').insert(rows)
    if (insertError) throw insertError
  }
}

export async function sendInviteEmail(guestId: string): Promise<{ sent: number; total: number }> {
  const { data, error } = await supabase.functions.invoke<{ sent: number; total: number }>(
    'send-invite',
    { body: { guestId } }
  )
  if (error) {
    // Extract actual body from edge function error
    const body = await (error as any).context?.json?.().catch(() => null)
    console.error('[sendInviteEmail] edge function error body:', body)
    throw new Error(body?.error ?? error.message)
  }
  return data ?? { sent: 0, total: 0 }
}

function generateCode(familyName: string): string {
  const slug = familyName
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${slug}-${suffix}`
}

export async function updateDeadline(isoString: string) {
  const { error } = await supabase
    .from('app_config')
    .update({ value: isoString, updated_at: new Date().toISOString() })
    .eq('key', 'rsvp_deadline')
  if (error) throw error
}
