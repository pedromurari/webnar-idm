import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { sessionId, userName, message } = await req.json()
  if (!sessionId || !userName || !message) {
    return NextResponse.json({ error: 'sessionId, userName e message são obrigatórios' }, { status: 400 })
  }

  if (message.trim().length > 300) {
    return NextResponse.json({ error: 'Mensagem muito longa' }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('live_messages')
    .insert({ session_id: sessionId, user_name: userName.trim(), message: message.trim() })
    .select('id, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, id: data.id })
}
