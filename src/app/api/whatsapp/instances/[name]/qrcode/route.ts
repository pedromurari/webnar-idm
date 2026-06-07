import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const supabase = await createAdminClient()

  const { data: inst } = await supabase
    .from('whatsapp_instances')
    .select('evolution_url, api_key')
    .eq('instance_name', name)
    .single()

  if (!inst) return NextResponse.json({ error: 'Instância não encontrada' }, { status: 404 })

  try {
    const res = await fetch(`${inst.evolution_url}/instance/connect/${name}`, {
      headers: { apikey: inst.api_key },
    })
    const data = await res.json()
    return NextResponse.json({ qr: data?.qrcode?.base64 || data?.base64 || null })
  } catch {
    return NextResponse.json({ error: 'Falha ao buscar QR code' }, { status: 500 })
  }
}
