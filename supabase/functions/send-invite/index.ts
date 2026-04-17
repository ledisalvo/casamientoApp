import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { guestId } = await req.json()

    if (!guestId) {
      return new Response(
        JSON.stringify({ error: 'Missing guestId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl    = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const resendApiKey   = Deno.env.get('RESEND_API_KEY')!
    const siteUrl        = Deno.env.get('SITE_URL') ?? 'https://casamiento.com'

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // Fetch guest
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('id, name, code')
      .eq('id', guestId)
      .single()

    if (guestError || !guest) {
      return new Response(
        JSON.stringify({ error: 'Guest not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch members with email
    const { data: members } = await supabase
      .from('guest_members')
      .select('name, email')
      .eq('guest_id', guestId)
      .not('email', 'is', null)

    const recipients = (members ?? []).filter((m) => m.email)

    if (recipients.length === 0) {
      return new Response(
        JSON.stringify({ sent: 0, message: 'No recipients with email' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const inviteUrl = `${siteUrl}/invite/${guest.code}`
    let sent = 0

    for (const member of recipients) {
      const html = buildEmailHtml({ memberName: member.name, familyName: guest.name, inviteUrl })

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from:    'Lucas & Ceci <onboarding@resend.dev>',
          to:      [member.email],
          subject: '¡Estás invitado a nuestra boda! 💍',
          html,
        }),
      })

      if (res.ok) sent++
    }

    return new Response(
      JSON.stringify({ sent, total: recipients.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function buildEmailHtml(params: {
  memberName: string
  familyName: string
  inviteUrl:  string
}): string {
  const { memberName, inviteUrl } = params

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:wght@300;400&family=Montserrat:wght@400;500&display=swap" rel="stylesheet" />
  <title>¡Estás invitado!</title>
</head>
<body style="margin:0;padding:0;background:#ede8e0;font-family:'Montserrat',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#ffffff;">

  <!-- Hero -->
  <div style="background:#2c2520;padding:64px 40px 56px;text-align:center;">
    <p style="font-family:'Great Vibes',cursive;font-size:56px;color:#ffffff;margin:0;line-height:1.15;">Lucas &amp; Ceci</p>
    <p style="font-family:'Montserrat',Arial,sans-serif;font-size:11px;letter-spacing:5px;color:#c8b89a;margin:14px 0 0;text-transform:uppercase;">¡Nos casamos!</p>
    <p style="font-size:12px;color:#7a6a5a;margin:8px 0 0;letter-spacing:3px;">05 · Febrero · 2027</p>
  </div>

  <!-- Date -->
  <div style="background:#ffffff;padding:52px 40px 44px;text-align:center;border-bottom:1px solid #f0ebe3;">
    <p style="font-family:'Montserrat',Arial,sans-serif;font-size:12px;color:#a09080;letter-spacing:3px;margin:0 0 6px;">♥&nbsp;&nbsp;viernes&nbsp;&nbsp;♥</p>
    <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:68px;font-weight:300;color:#2c2520;margin:0;line-height:1;">05.02.2027</p>
  </div>

  <!-- Gold banner -->
  <div style="background:#a08858;padding:20px 40px;text-align:center;">
    <p style="font-family:'Montserrat',Arial,sans-serif;font-size:10px;letter-spacing:6px;color:#ffffff;text-transform:uppercase;margin:0;">Cuenta regresiva</p>
  </div>

  <!-- Invitation text -->
  <div style="background:#faf7f2;padding:60px 48px;text-align:center;">
    <p style="font-family:'Montserrat',Arial,sans-serif;font-size:9px;letter-spacing:5px;color:#b0a090;text-transform:uppercase;margin:0 0 14px;">Te invitamos a celebrar</p>
    <p style="font-family:'Great Vibes',cursive;font-size:48px;color:#2c2520;margin:0 0 28px;line-height:1.2;">nuestra boda</p>
    <p style="font-size:14px;color:#6a5a50;line-height:2;margin:0;">Hola <strong>${memberName}</strong>,<br>queremos que seas parte de este día tan especial para nosotros.</p>
  </div>

  <!-- Venue -->
  <div style="background:#ffffff;padding:52px 48px;text-align:center;">
    <p style="font-family:'Montserrat',Arial,sans-serif;font-size:9px;letter-spacing:5px;color:#b0a090;text-transform:uppercase;margin:0 0 20px;">En</p>
    <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;font-weight:400;color:#2c2520;margin:0 0 8px;letter-spacing:2px;text-transform:uppercase;">Nombre del Salón</p>
    <p style="font-size:13px;color:#6a5a50;margin:0 0 4px;line-height:1.8;">Dirección del lugar, Ciudad</p>
    <p style="font-family:'Montserrat',Arial,sans-serif;font-size:10px;color:#a09080;letter-spacing:3px;text-transform:uppercase;margin:16px 0 0;">Recepción · 21:00 hs</p>
  </div>

  <!-- Divider -->
  <div style="height:1px;background:#f0ebe3;"></div>

  <!-- Dress code -->
  <div style="background:#ffffff;padding:52px 48px;text-align:center;">
    <p style="font-family:'Great Vibes',cursive;font-size:46px;color:#2c2520;margin:0 0 10px;">Dress code</p>
    <p style="font-family:'Montserrat',Arial,sans-serif;font-size:9px;letter-spacing:5px;color:#b0a090;text-transform:uppercase;margin:0 0 16px;">Elegante</p>
    <p style="font-size:13px;color:#6a5a50;line-height:1.9;max-width:400px;margin:0 auto;">Por favor, evitar el color blanco y los colores muy llamativos.<br>Queremos que todos brillen por su elegancia.</p>
  </div>

  <!-- RSVP -->
  <div style="background:#faf7f2;padding:56px 48px;text-align:center;border-top:1px solid #e8e0d8;">
    <p style="font-family:'Montserrat',Arial,sans-serif;font-size:9px;letter-spacing:5px;color:#b0a090;text-transform:uppercase;margin:0 0 18px;">Confirmación de asistencia</p>
    <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:300;color:#2c2520;margin:0 0 6px;line-height:1.6;">Queremos que formes parte de nuestro casamiento,</p>
    <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:300;color:#2c2520;margin:0 0 32px;line-height:1.6;">¡te pedimos que nos confirmes tu presencia!</p>
    <a href="${inviteUrl}" style="display:inline-block;padding:15px 44px;border:1px solid #2c2520;color:#2c2520;font-family:'Montserrat',Arial,sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;text-decoration:none;">CONFIRMAR</a>
  </div>

  <!-- Footer -->
  <div style="background:#2c2520;padding:56px 40px;text-align:center;">
    <p style="font-family:'Montserrat',Arial,sans-serif;font-size:9px;letter-spacing:5px;color:#c8b89a;text-transform:uppercase;margin:0 0 14px;">¡Te esperamos!</p>
    <p style="font-family:'Great Vibes',cursive;font-size:48px;color:#ffffff;margin:0;line-height:1.2;">Lucas &amp; Ceci</p>
  </div>

</div>
</body>
</html>`
}
