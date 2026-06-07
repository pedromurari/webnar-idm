import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { registrationId } = await req.json()
  if (!registrationId) return NextResponse.json({ error: 'registrationId required' }, { status: 400 })

  const supabase = await createAdminClient()
  await supabase
    .from('registrations')
    .update({ watch_stage: 'entered', room_entered_at: new Date().toISOString() })
    .eq('id', registrationId)
    .eq('watch_stage', 'registered') // only update if not already entered

  return NextResponse.json({ ok: true })
}
