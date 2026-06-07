import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { CheckCircle, ExternalLink, MessageCircle } from 'lucide-react'
import type { PaymentOption } from '@/lib/supabase/types'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ name?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('webinars').select('offer_title, title').eq('slug', slug).single()
  return { title: data?.offer_title || data?.title || 'Oferta Especial | IDM' }
}

export default async function OfertaPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { name } = await searchParams
  const supabase = await createClient()

  const { data: webinar } = await supabase
    .from('webinars')
    .select('id, title, offer_title, offer_cta_text, payment_config, wpp_group_url, presenter_name')
    .eq('slug', slug)
    .single()

  if (!webinar) notFound()

  const payments = (webinar.payment_config as PaymentOption[] | null) || []

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8 text-center">

        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold mb-4">
            ⏰ OFERTA POR TEMPO LIMITADO
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
            {name ? <><span className="text-primary">{name}</span>, a</> : 'A'} sua oportunidade chegou!
          </h1>
          <p className="text-xl text-muted-foreground">
            {webinar.offer_title || `Garanta sua vaga na formação completa de ${webinar.title}`}
          </p>
        </div>

        {/* Benefits */}
        <div className="rounded-2xl border border-border bg-card p-6 text-left space-y-3">
          <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">O que você leva:</p>
          {[
            'Acesso completo ao conteúdo do curso',
            'Material de apoio exclusivo',
            'Certificado de conclusão',
            'Acesso ao grupo VIP de alunos',
            'Suporte direto com a equipe IDM',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-success shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Payment buttons */}
        <div className="space-y-3">
          {payments.map((p, i) => (
            <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="block">
              <Button
                className={`w-full h-16 text-base font-black ${i === 0 ? 'bg-primary text-primary-foreground pulse-primary hover:brightness-110' : 'bg-card border-2 border-border text-foreground hover:bg-card/80'}`}
              >
                {i === 0 && <span className="mr-2">🎯</span>}
                {webinar.offer_cta_text || p.label}
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </a>
          ))}
        </div>

        {/* WhatsApp group */}
        {webinar.wpp_group_url && (
          <div className="rounded-2xl border border-success/20 bg-success/5 p-5">
            <p className="font-semibold mb-2">📲 Prefere tirar dúvidas antes?</p>
            <a href={webinar.wpp_group_url} target="_blank" rel="noopener noreferrer">
              <Button className="bg-success text-success-foreground hover:brightness-110 pulse-success w-full h-12">
                <MessageCircle className="h-4 w-4 mr-2" />
                FALAR COM CONSULTOR NO WHATSAPP
              </Button>
            </a>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Instituto Despertamente · Todos os direitos reservados
        </p>
      </div>
    </div>
  )
}
