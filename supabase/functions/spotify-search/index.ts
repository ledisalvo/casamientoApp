const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SpotifyTrack {
  id:          string
  name:        string
  artist:      string
  album:       string
  image:       string | null
  preview_url: string | null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()

    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: 'Invalid query' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const clientId     = Deno.env.get('SPOTIFY_CLIENT_ID')!
    const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET')!
    const credentials  = btoa(`${clientId}:${clientSecret}`)

    // Get access token via Client Credentials flow
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type':  'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })

    if (!tokenRes.ok) {
      return new Response(
        JSON.stringify({ error: 'Spotify auth failed' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { access_token } = await tokenRes.json()

    // Search tracks
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query.trim())}&type=track&limit=8&market=AR`,
      { headers: { 'Authorization': `Bearer ${access_token}` } }
    )

    if (!searchRes.ok) {
      return new Response(
        JSON.stringify({ error: 'Spotify search failed' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { tracks } = await searchRes.json()

    const results: SpotifyTrack[] = (tracks?.items ?? []).map((item: any) => ({
      id:          item.id,
      name:        item.name,
      artist:      item.artists.map((a: any) => a.name).join(', '),
      album:       item.album.name,
      image:       item.album.images?.[1]?.url ?? item.album.images?.[0]?.url ?? null,
      preview_url: item.preview_url ?? null,
    }))

    return new Response(
      JSON.stringify(results),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
