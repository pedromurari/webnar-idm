import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RegistrationForm } from '@/components/webinar/RegistrationForm'
import { CheckCircle, Clock, Users, Star } from 'lucide-react'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('webinars').select('title, description').eq('slug', slug).single()
  if (!data) return { title: 'IDM Webinários' }
  return { title: `${data.title} | IDM`, description: data.description || undefined }
}

export default async function CapturePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: webinar } = await supabase
    .from('webinars')
    .select('id, title, description, presenter_name, presenter_photo_url, thumbnail_url, slug, min_fake_viewers, max_fake_viewers')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (!webinar) notFound()

  const viewerCount = webinar.min_fake_viewers + Math.floor(Math.random() * (webinar.max_fake_viewers - webinar.min_fake_viewers))

  return (
    <div className="min-h-screen">
      {/* Top bar urgency */}
      <div className="bg-primary text-primary-foreground text-center py-2.5 text-sm font-semibold">
        🔴 AO VIVO AGORA — Turmas a cada 30 minutos &nbsp;|&nbsp;{viewerCount} pessoas assistindo
      </div>

      <main className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* LEFT: Hero */}
          <div className="space-y-7">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-primary font-black text-sm">IDM</span>
              </div>
              <div>
                <p className="font-bold text-sm">Instituto Despertamente</p>
                <p className="text-muted-foreground text-xs">Aula gratuita ao vivo</p>
              </div>
            </div>

            {/* Headline */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold mb-4">
                🔴 AO VIVO · PRÓXIMA TURMA EM BREVE
              </div>
              <h1 className="text-3xl md:text-5xl font-black leading-[1.1] mb-4">
                <span className="text-gold-shimmer">{webinar.title}</span>
              </h1>
              {webinar.description && (
                <p className="text-muted-foreground text-lg leading-relaxed">{webinar.description}</p>
              )}
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
              <div className="flex -space-x-2">
                {['A','B','C','D','E'].map((l,i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-bold text-primary">{l}</div>
                ))}
              </div>
              <div>
                <p className="font-semibold text-sm">{viewerCount} pessoas já garantiram vaga</p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[...Array(5)].map((_,i) => <Star key={i} className="h-3 w-3 fill-primary text-primary" />)}
                  <span className="text-xs text-muted-foreground ml-1">4.9 de avaliação</span>
                </div>
              </div>
            </div>

            {/* What you'll learn */}
            <div className="space-y-3">
              <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">O que você vai aprender:</p>
              {[
                'Fundamentos práticos que nunca foram ensinados assim',
                'Como aplicar no seu dia a dia imediatamente',
                'O método exclusivo do IDM que transforma vidas',
                'Próximos passos para aprofundar seu conhecimento',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>

            {/* Session info */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span>Turmas a cada 30 minutos</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-primary" />
                <span>Vagas limitadas por turma</span>
              </div>
            </div>

            {/* Presenter */}
            {webinar.presenter_name && (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border">
                {webinar.presenter_photo_url
                  ? <img src={webinar.presenter_photo_url} alt={webinar.presenter_name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/30" />
                  : <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary font-black text-xl">{webinar.presenter_name[0]}</div>
                }
                <div>
                  <p className="font-bold">{webinar.presenter_name}</p>
                  <p className="text-xs text-muted-foreground">Apresentador</p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Form panel */}
          <div className="sticky top-8">
            <div className="rounded-3xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full bg-success/10 border border-success/20 text-success text-xs font-semibold">
                  ✅ Entrada gratuita — Próxima turma em breve
                </div>
                <h2 className="text-xl font-black">Garanta sua vaga agora</h2>
                <p className="text-muted-foreground text-sm mt-1">Preencha abaixo para entrar na próxima turma disponível</p>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Vagas disponíveis</span>
                  <span className="text-destructive font-semibold">Apenas {Math.floor(Math.random() * 15) + 3} restantes</span>
                </div>
                <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-yellow-300 progress-stripes" style={{ width: '78%' }} />
                </div>
              </div>

              <RegistrationForm webinarId={webinar.id} webinarSlug={webinar.slug} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Instituto Despertamente · Todos os direitos reservados</p>
        <p className="mt-1">Este site não é afiliado ao Facebook ou Meta Platforms.</p>
      </footer>
    </div>
  )
}
