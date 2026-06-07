import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getDaySessionSlots } from '@/lib/sessions'
import { sendFollowUpEmail, sendNoShowEmail } from '@/lib/email'
import { sendRoundRobin, buildFollowUpMessage, buildNoShowMessage } from '@/lib/whatsapp'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createAdminClient()
  const now = new Date()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''

  // 1. Create sessions for today if not yet created
  const { data: webinars } = await supabase.from('webinars').select('id, session_interval_minutes').eq('active', true)

  if (webinars) {
    const slots = getDaySessionSlots(now)
    for (const webinar of webinars) {
      const values = slots.map((slot) => ({
        webinar_id: webinar.id,
        start_time: slot.toISOString(),
        status: 'scheduled' as const,
      }))
      // Insert, ignore conflicts (on duplicate start_time + webinar_id)
      await supabase.from('sessions').upsert(values, { onConflict: 'webinar_id,start_time', ignoreDuplicates: true })
    }
  }

  // 2. Transition sessions: scheduled → live, live → ended
  const { data: sessions } = await supabase
    .from('sessions')
    .select('*, webinars(title, slug, video_duration_seconds, wpp_group_url, evolution_api_url, evolution_api_key)')
    .in('status', ['scheduled', 'live'])

  if (sessions) {
    for (const session of sessions) {
      const start = new Date(session.start_time)
      const webinar = session.webinars as { title: string; slug: string; video_duration_seconds: number; wpp_group_url: string | null; evolution_api_url: string | null; evolution_api_key: string | null }
      const endTime = new Date(start.getTime() + (webinar?.video_duration_seconds || 3600) * 1000)

      if (session.status === 'scheduled' && now >= start) {
        await supabase.from('sessions').update({ status: 'live' }).eq('id', session.id)
      }

      if (session.status === 'live' && now >= endTime) {
        await supabase.from('sessions').update({ status: 'ended' }).eq('id', session.id)

        // 3. Fire follow-up for this session's leads
        const { data: leads } = await supabase
          .from('registrations')
          .select('id, name, email, phone, watch_stage, max_watched_pct, room_entered_at')
          .eq('session_id', session.id)
          .eq('email_sent', false)

        if (leads && webinar) {
          const offerUrl = `${appUrl}/oferta/${webinar.slug}`
          const captureUrl = `${appUrl}/${webinar.slug}`

          for (const lead of leads) {
            const didWatch = lead.room_entered_at && lead.max_watched_pct >= 25
            const markSent = { email_sent: true, wpp_sent: false }

            if (didWatch) {
              await sendFollowUpEmail({
                to: lead.email,
                name: lead.name,
                webinarTitle: webinar.title,
                offerUrl,
                wppGroupUrl: webinar.wpp_group_url || undefined,
              })
              if (lead.phone) {
                const msg = buildFollowUpMessage(lead.name, webinar.title, offerUrl, webinar.wpp_group_url || undefined)
                const { sent } = await sendRoundRobin(lead.phone, msg)
                if (sent) markSent.wpp_sent = true
              }
            } else {
              await sendNoShowEmail({ to: lead.email, name: lead.name, webinarTitle: webinar.title, captureUrl })
              if (lead.phone) {
                const msg = buildNoShowMessage(lead.name, webinar.title, `Temos turmas a cada 30 minutos. Acesse: ${captureUrl}`)
                await sendRoundRobin(lead.phone, msg)
              }
            }

            await supabase.from('registrations').update(markSent).eq('id', lead.id)
          }
        }
      }
    }
  }

  return NextResponse.json({ ok: true, ts: now.toISOString() })
}
