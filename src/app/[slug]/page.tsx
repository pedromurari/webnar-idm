import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RegistrationForm } from '@/components/webinar/RegistrationForm'
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

  const benefits = [
    'Aula 100% gratuita e ao vivo — sem gravação disponível',
    'Conteúdo exclusivo que não está em nenhum lugar',
    'Certificado de participação para os presentes',
  ]

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: '#070a14' }}>
      {/* Background gradients */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 80% 60% at 20% -10%, rgba(255,191,26,.04) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 110%, rgba(255,191,26,.03) 0%, transparent 55%)'
      }} />

      {/* Main */}
      <main style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto', padding: '60px 20px 80px', textAlign: 'center' }}>

        {/* Sigil / Logo */}
        <div style={{ position: 'relative', width: '88px', height: '88px', margin: '0 auto 36px' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(255,191,26,.3)', animation: 'pulse 3s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', inset: '10px', borderRadius: '50%', border: '1px solid rgba(255,191,26,.15)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffbf1a', letterSpacing: '0.05em', textShadow: '0 0 30px rgba(255,191,26,.5)' }}>IDM</span>
          </div>
        </div>

        {/* Eyebrow */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', fontSize: '0.68rem', letterSpacing: '0.38em', textTransform: 'uppercase', color: '#ffbf1a', marginBottom: '20px', opacity: 0.85 }}>
          <span style={{ width: '28px', height: '1px', background: 'rgba(255,191,26,.4)', display: 'inline-block' }} />
          Instituto Despertamente · Aula Gratuita
          <span style={{ width: '28px', height: '1px', background: 'rgba(255,191,26,.4)', display: 'inline-block' }} />
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(1.9rem, 5.5vw, 3rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: '16px', color: '#f4ecd8' }}>
          {webinar.title}
        </h1>

        {/* Subtitle */}
        {webinar.description && (
          <p style={{ fontSize: '1.05rem', color: 'rgba(244,236,216,.55)', lineHeight: 1.75, marginBottom: '32px', fontWeight: 400 }}>
            {webinar.description}
          </p>
        )}

        {/* Benefits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '40px', textAlign: 'left' }}>
          {benefits.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ color: '#ffbf1a', marginTop: '1px', flexShrink: 0, fontSize: '0.85rem' }}>✓</span>
              <span style={{ fontSize: '0.9rem', color: 'rgba(244,236,216,.7)', lineHeight: 1.6 }}>{b}</span>
            </div>
          ))}
        </div>

        {/* Form card */}
        <div style={{
          background: 'linear-gradient(160deg, rgba(13,13,26,.98), rgba(8,8,18,1))',
          border: '1px solid rgba(255,191,26,.12)',
          borderTop: '1px solid rgba(255,191,26,.22)',
          borderRadius: '12px',
          padding: '36px 32px 32px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 60px 120px rgba(0,0,0,.8)',
          textAlign: 'left',
        }}>
          {/* Top gradient line */}
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '50%', height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(255,191,26,.6), transparent)',
          }} />

          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '999px',
              background: 'rgba(0,184,55,.08)', border: '1px solid rgba(0,184,55,.2)',
              fontSize: '0.75rem', fontWeight: 700, color: '#00b837',
              marginBottom: '12px', letterSpacing: '0.04em',
            }}>
              ✅ Entrada gratuita — Vagas limitadas
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f4ecd8', margin: 0 }}>
              Garanta sua vaga agora
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'rgba(244,236,216,.4)', marginTop: '6px' }}>
              Preencha abaixo para entrar na próxima turma disponível
            </p>
          </div>

          {/* Scarcity bar */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '8px' }}>
              <span style={{ color: 'rgba(244,236,216,.45)', letterSpacing: '0.08em' }}>Vagas disponíveis</span>
              <span style={{ color: '#e05c5c', fontWeight: 700 }}>Apenas {Math.floor(Math.random() * 12) + 4} restantes</span>
            </div>
            <div style={{ height: '6px', borderRadius: '999px', background: 'rgba(255,255,255,.06)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '81%', borderRadius: '999px', background: 'linear-gradient(90deg, #ffbf1a, #ffe066)' }} />
            </div>
          </div>

          <RegistrationForm webinarId={webinar.id} webinarSlug={webinar.slug} />

          <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.72rem', color: 'rgba(244,236,216,.25)', lineHeight: 1.6 }}>
            🔒 Seus dados estão protegidos. Não enviamos spam.
          </p>
        </div>

        {/* Presenter */}
        {webinar.presenter_name && (
          <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            {webinar.presenter_photo_url
              ? <img src={webinar.presenter_photo_url} alt={webinar.presenter_name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,191,26,.3)' }} />
              : <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,191,26,.15)', border: '2px solid rgba(255,191,26,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffbf1a', fontWeight: 900, fontSize: '1rem' }}>{webinar.presenter_name[0]}</div>
            }
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f4ecd8' }}>{webinar.presenter_name}</p>
              <p style={{ fontSize: '0.72rem', color: 'rgba(244,236,216,.35)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Apresentador</p>
            </div>
          </div>
        )}
      </main>

      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,.05)', padding: '24px 20px', textAlign: 'center', fontSize: '0.72rem', color: 'rgba(244,236,216,.2)' }}>
        <p>© {new Date().getFullYear()} Instituto Despertamente · Todos os direitos reservados</p>
        <p style={{ marginTop: '4px' }}>Este site não é afiliado ao Facebook ou Meta Platforms.</p>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255,191,26,.12); }
          50% { box-shadow: 0 0 40px rgba(255,191,26,.3); }
        }
      `}</style>
    </div>
  )
}
