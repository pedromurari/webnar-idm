import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getNextSessionTime } from '@/lib/sessions'

export async function GET(req: NextRequest) {
  const webinarId = req.nextUrl.searchParams.get('webinarId')
  if (!webinarId) return NextResponse.json({ error: 'webinarId required' }, { status: 400 })

  const supabase = await createAdminClient()
  const nextTime = getNextSessionTime()

  // Find or create the next session
  const { data: existing } = await supabase
    .from('sessions')
    .select('*')
    .eq('webinar_id', webinarId)
    .eq('start_time', nextTime.toISOString())
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ session: existing })
  }

  const { data: created, error } = await supabase
    .from('sessions')
    .insert({ webinar_id: webinarId, start_time: nextTime.toISOString(), status: 'scheduled' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ session: created })
}
