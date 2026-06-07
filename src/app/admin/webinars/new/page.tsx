'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ChevronRight, ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const STEPS = ['Identidade', 'Vídeo', 'Sessões', 'Pagamento', 'Follow-up']

export default function NewWebinarPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    presenter_name: '',
    presenter_photo_url: '',
    thumbnail_url: '',
    video_url: '',
    video_duration_seconds: 5400,
    session_interval_minutes: 30,
    offer_appears_at_seconds: 4200,
    offer_title: '',
    offer_cta_text: 'QUERO GARANTIR MINHA VAGA',
    payment_config: [
      { type: 'vega', label: 'Garantir vaga — Pagamento seguro', url: '' },
      { type: 'mercado_pago', label: 'Pagar com Mercado Pago', url: '' },
      { type: 'wpp', label: 'Falar com consultor no WhatsApp', url: '' },
    ],
    wpp_group_url: '',
    evolution_api_url: '',
    evolution_api_key: '',
    min_fake_viewers: 60,
    max_fake_viewers: 220,
  })

  function set(k: string, v: unknown) { setForm(prev => ({ ...prev, [k]: v })) }
  function slugify(s: string) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }

  async function save() {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('webinars').insert({ ...form, active: true })
    if (!error) router.push('/admin/webinars')
    else { alert(error.message); setSaving(false) }
  }

  const f = (label: string, key: string, type = 'text', placeholder = '') => (
    <div>
      <Label className="text-xs text-muted-foreground mb-1.5 block">{label}</Label>
      <Input type={type} placeholder={placeholder} value={String((form as Record<string, unknown>)[key] || '')}
        onChange={e => { set(key, type === 'number' ? Number(e.target.value) : e.target.value); if (key === 'title') set('slug', slugify(e.target.value)) }}
        className="h-10" />
    </div>
  )

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black">Novo Webinário</h1>
        <div className="flex items-center gap-1 mt-3">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${i <= step ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>{i+1}</div>
              {i < STEPS.length - 1 && <div className={`h-0.5 w-8 ${i < step ? 'bg-primary' : 'bg-border'}`} />}
            </div>
          ))}
          <span className="ml-3 text-sm text-muted-foreground">{STEPS[step]}</span>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{STEPS[step]}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {step === 0 && <>
            {f('Título do webinário', 'title', 'text', 'Ex.: Conheça a Integratividade Aplicada à Psicanálise')}
            {f('Slug (URL)', 'slug', 'text', 'ex: psicanalise')}
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Descrição curta</Label>
              <Textarea placeholder="Descrição que aparece na página de captura..." value={form.description} onChange={e => set('description', e.target.value)} className="min-h-[80px]" />
            </div>
            {f('Nome do apresentador', 'presenter_name', 'text', 'Instituto Despertamente')}
            {f('Foto do apresentador (URL)', 'presenter_photo_url', 'url')}
            {f('Thumbnail do webinário (URL)', 'thumbnail_url', 'url')}
          </>}

          {step === 1 && <>
            {f('URL do vídeo (Bunny.net embed ou YouTube embed)', 'video_url', 'url', 'https://iframe.mediadelivery.net/embed/...')}
            {f('Duração em segundos', 'video_duration_seconds', 'number', '5400')}
            {f('Segundo em que o CTA aparece', 'offer_appears_at_seconds', 'number', '4200')}
            {f('Título da oferta', 'offer_title', 'text', 'Garanta sua vaga na Formação Completa')}
            {f('Texto do botão CTA', 'offer_cta_text', 'text', 'QUERO GARANTIR MINHA VAGA')}
          </>}

          {step === 2 && <>
            {f('Intervalo entre turmas (minutos)', 'session_interval_minutes', 'number', '30')}
            {f('Mínimo de espectadores fake', 'min_fake_viewers', 'number', '60')}
            {f('Máximo de espectadores fake', 'max_fake_viewers', 'number', '220')}
            <p className="text-xs text-muted-foreground">Turmas funcionam de 06h às 23h (horário de Brasília), nos minutos :00 e :30</p>
          </>}

          {step === 3 && <>
            <p className="text-sm text-muted-foreground">Configure até 3 opções de pagamento:</p>
            {form.payment_config.map((p, i) => (
              <div key={i} className="p-3 rounded-xl border border-border space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Opção {i+1} — {p.type.toUpperCase()}</p>
                <Input placeholder="Label do botão" value={p.label} onChange={e => {
                  const c = [...form.payment_config]; c[i] = { ...c[i], label: e.target.value }
                  set('payment_config', c)
                }} className="h-9 text-sm" />
                <Input placeholder="URL do checkout" value={p.url} onChange={e => {
                  const c = [...form.payment_config]; c[i] = { ...c[i], url: e.target.value }
                  set('payment_config', c)
                }} className="h-9 text-sm" type="url" />
              </div>
            ))}
          </>}

          {step === 4 && <>
            {f('Link do grupo VIP (WhatsApp)', 'wpp_group_url', 'url', 'https://chat.whatsapp.com/...')}
            {f('URL da Evolution API (opcional)', 'evolution_api_url', 'url', 'https://api.suaevolution.com')}
            {f('API Key da Evolution (opcional)', 'evolution_api_key', 'text')}
          </>}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={() => setStep(s => Math.max(0, s-1))} disabled={step === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(s => s+1)} className="bg-primary text-primary-foreground">
            Próximo <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={save} disabled={saving} className="bg-primary text-primary-foreground">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {saving ? 'Criando...' : 'Criar Webinário ✓'}
          </Button>
        )}
      </div>
    </div>
  )
}
