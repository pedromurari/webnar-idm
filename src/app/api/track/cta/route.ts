import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { registrationId } = await req.json()
  if (!registrationId) return NextResponse.json({ error: 'registrationId required' }, { status: 400 })

  const supabase = await createAdminClient()
  await supabase
    .from('registrations')
    .update({ watch_stage: 'cta_seen', cta_seen_at: new Date().toISOString() })
    .eq('id', registrationId)

  return NextResponse.json({ ok: true })
}
