import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

const STAGE_THRESHOLDS = [
  { pct: 25, stage: 'watched_25' },
  { pct: 50, stage: 'watched_50' },
  { pct: 75, stage: 'watched_75' },
  { pct: 100, stage: 'completed' },
] as const

export async function POST(req: NextRequest) {
  const { registrationId, currentSecond, totalSeconds } = await req.json()
  if (!registrationId || currentSecond === undefined || !totalSeconds) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 })
  }

  const pct = Math.round((currentSecond / totalSeconds) * 100)

  const supabase = await createAdminClient()
  const { data: reg } = await supabase
    .from('registrations')
    .select('max_watched_pct, watch_stage')
    .eq('id', registrationId)
    .single()

  if (!reg) return NextResponse.json({ ok: true })

  // Determine new stage (only advance, never go back)
  const stageOrder = ['registered', 'entered', 'watched_25', 'watched_50', 'watched_75', 'completed', 'cta_seen', 'offer_clicked']
  const currentIdx = stageOrder.indexOf(reg.watch_stage)

  let newStage = reg.watch_stage
  for (const t of STAGE_THRESHOLDS) {
    const threshIdx = stageOrder.indexOf(t.stage)
    if (pct >= t.pct && threshIdx > currentIdx) {
      newStage = t.stage
    }
  }

  const updates: Record<string, unknown> = { max_watched_pct: Math.max(reg.max_watched_pct, pct) }
  if (newStage !== reg.watch_stage) updates.watch_stage = newStage

  await supabase.from('registrations').update(updates).eq('id', registrationId)

  return NextResponse.json({ ok: true, pct, stage: newStage })
}
