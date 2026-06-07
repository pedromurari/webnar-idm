import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getNextSessionTime } from '@/lib/sessions'
import { parseDevice } from '@/lib/device'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, phone, webinarId, utm } = body

  if (!name || !email || !webinarId) {
    return NextResponse.json({ error: 'name, email e webinarId são obrigatórios' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  // Check for repeat lead
  const { data: existing } = await supabase
    .from('registrations')
    .select('id, watch_stage, max_watched_pct, session_id')
    .eq('email', email.toLowerCase())
    .eq('webinar_id', webinarId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const hasWatched = existing && (
    ['cta_seen', 'offer_clicked'].includes(existing.watch_stage) ||
    existing.max_watched_pct >= 50
  )

  // If already watched → return repeat=watched (redirect to sales bot)
  if (hasWatched) {
    return NextResponse.json({ repeat: true, watched: true, webinarId })
  }

  // Get or create next session
  const nextTime = getNextSessionTime()
  const { data: sessionRow } = await supabase
    .from('sessions')
    .select('id')
    .eq('webinar_id', webinarId)
    .eq('start_time', nextTime.toISOString())
    .maybeSingle()

  let sessionId = sessionRow?.id

  if (!sessionId) {
    const { data: newSession } = await supabase
      .from('sessions')
      .insert({ webinar_id: webinarId, start_time: nextTime.toISOString(), status: 'scheduled' })
      .select('id')
      .single()
    sessionId = newSession?.id
  }

  if (!sessionId) return NextResponse.json({ error: 'Erro ao criar sessão' }, { status: 500 })

  // Parse device info
  const ua = req.headers.get('user-agent') || ''
  const { device, browser, os } = parseDevice(ua)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || null

  const isRepeat = !!existing
  const repeatCount = isRepeat ? (existing.max_watched_pct || 0) : 0

  // Insert registration
  const { data: registration, error } = await supabase
    .from('registrations')
    .insert({
      session_id: sessionId,
      webinar_id: webinarId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || null,
      utm_source: utm?.source || null,
      utm_medium: utm?.medium || null,
      utm_campaign: utm?.campaign || null,
      utm_content: utm?.content || null,
      utm_term: utm?.term || null,
      device,
      browser,
      os,
      ip,
      watch_stage: 'registered',
      max_watched_pct: 0,
      is_repeat: isRepeat,
      repeat_count: repeatCount,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    success: true,
    sessionId,
    registrationId: registration.id,
    sessionTime: nextTime.toISOString(),
    repeat: isRepeat,
    watched: false,
  })
}
