import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WebinarRoom } from './WebinarRoom'

interface Props { params: Promise<{ sessionId: string }> }

export default async function SalaPage({ params }: Props) {
  const { sessionId } = await params
  const supabase = await createClient()

  const { data: session } = await supabase
    .from('sessions')
    .select('id, start_time, status, webinars(id, title, video_url, video_duration_seconds, offer_appears_at_seconds, offer_title, offer_cta_text, payment_config, wpp_group_url, slug, min_fake_viewers, max_fake_viewers)')
    .eq('id', sessionId)
    .single()

  if (!session) notFound()

  const webinar = session.webinars as unknown as {
    id: string; title: string; video_url: string; video_duration_seconds: number
    offer_appears_at_seconds: number | null; offer_title: string | null; offer_cta_text: string | null
    payment_config: unknown; wpp_group_url: string | null; slug: string
    min_fake_viewers: number; max_fake_viewers: number
  }

  // Load scripted comments
  const { data: scriptedComments } = await supabase
    .from('scripted_comments')
    .select('*')
    .eq('webinar_id', webinar.id)
    .order('appears_at_seconds', { ascending: true })

  const elapsed = Math.max(0, Math.floor((Date.now() - new Date(session.start_time).getTime()) / 1000))

  return (
    <WebinarRoom
      sessionId={session.id}
      startTime={session.start_time}
      status={session.status}
      webinarId={webinar.id}
      webinarTitle={webinar.title}
      videoUrl={webinar.video_url}
      videoDuration={webinar.video_duration_seconds}
      offerAppearsAt={webinar.offer_appears_at_seconds}
      offerTitle={webinar.offer_title}
      offerCtaText={webinar.offer_cta_text}
      paymentConfig={webinar.payment_config}
      wppGroupUrl={webinar.wpp_group_url}
      webinarSlug={webinar.slug}
      scriptedComments={scriptedComments || []}
      initialElapsed={elapsed}
      minFakeViewers={webinar.min_fake_viewers}
      maxFakeViewers={webinar.max_fake_viewers}
    />
  )
}
