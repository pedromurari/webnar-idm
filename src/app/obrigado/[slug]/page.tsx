import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ObrigadoClient } from './ObrigadoClient'

interface Props { params: Promise<{ slug: string }>; searchParams: Promise<{ sessionId?: string; name?: string; repeat?: string }> }

export default async function ObrigadoPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { sessionId, name, repeat } = await searchParams

  if (!sessionId) notFound()

  const supabase = await createClient()
  const { data: session } = await supabase
    .from('sessions')
    .select('id, start_time, webinars(title, wpp_group_url, slug)')
    .eq('id', sessionId)
    .single()

  if (!session) notFound()

  const webinar = session.webinars as unknown as { title: string; wpp_group_url: string | null; slug: string }

  return (
    <ObrigadoClient
      sessionId={session.id}
      startTime={session.start_time}
      webinarTitle={webinar.title}
      webinarSlug={webinar.slug}
      wppGroupUrl={webinar.wpp_group_url}
      userName={name || 'você'}
      isRepeat={repeat === '1'}
    />
  )
}
