import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createAdminClient()
  const { data: instances } = await supabase.from('whatsapp_instances').select('*').order('created_at', { ascending: false })
  return NextResponse.json({ instances: instances || [] })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { instance_name, evolution_url, api_key } = body
  if (!instance_name || !evolution_url || !api_key) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
  }

  // Create instance on Evolution API
  try {
    await fetch(`${evolution_url}/instance/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: api_key },
      body: JSON.stringify({ instanceName: instance_name, qrcode: true }),
    })
  } catch {}

  const supabase = await createAdminClient()
  const { error } = await supabase.from('whatsapp_instances').insert({
    instance_name, evolution_url, api_key, status: 'disconnected', active: true,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
