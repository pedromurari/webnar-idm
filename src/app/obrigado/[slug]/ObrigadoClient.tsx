'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CountdownTimer } from '@/components/webinar/CountdownTimer'

interface Props {
  sessionId: string
  startTime: string
  webinarTitle: string
  webinarSlug: string
  wppGroupUrl: string | null
  userName: string
  isRepeat: boolean
}

export function ObrigadoClient({ sessionId, startTime, webinarTitle, webinarSlug, wppGroupUrl, userName, isRepeat }: Props) {
  const router = useRouter()
  const [canEnter, setCanEnter] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const start = new Date(startTime).getTime()
    const now = Date.now()
    const earlyMs = 2 * 60 * 1000
    if (now >= start - earlyMs) {
      setCanEnter(true)
      if (now >= start) setStarted(true)
    } else {
      const delay = start - earlyMs - now
      const t = setTimeout(() => setCanEnter(true), delay)
      return () => clearTimeout(t)
    }
  }, [startTime])

  const sessionTime = new Date(startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })

  return (
    <div className="min-h-screen" style={{ background: '#070a14' }}>
      {/* Fixed gradient bg */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,184,55,.05) 0%, transparent 60%)' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* Success header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          {/* Green circle */}
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(0,184,55,.1)', border: '2px solid rgba(0,184,55,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '2rem' }}>
            🎉
          </div>

          <h1 style={{ fontSize: 'clamp(1.7rem, 5vw, 2.4rem)', fontWeight: 900, lineHeight: 1.15, color: '#f4ecd8', marginBottom: '12px' }}>
            {isRepeat ? (
              <>Que alegria te ver aqui novamente, <span style={{ color: '#ffbf1a' }}>{userName}</span>!</>
            ) : (
              <><span style={{ color: '#ffbf1a' }}>{userName}</span>, sua vaga está garantida! 🎉</>
            )}
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(244,236,216,.55)', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto' }}>
            {isRepeat
              ? 'Ficamos muito felizes com seu retorno. Desta vez esperamos que você aproveite tudo que preparamos.'
              : <>Você está inscrito na aula: <strong style={{ color: '#f4ecd8' }}>{webinarTitle}</strong></>
            }
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '8px' }}>
            <span style={{ color: 'rgba(244,236,216,.4)', letterSpacing: '0.06em' }}>Vagas preenchidas</span>
            <span style={{ color: '#ffbf1a', fontWeight: 700 }}>80% das vagas confirmadas</span>
          </div>
          <div style={{ height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,.06)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '80%', borderRadius: '999px', background: 'linear-gradient(90deg, #ffbf1a, #ffe066)' }} />
          </div>
        </div>

        {/* Main card */}
        <div style={{ background: 'linear-gradient(160deg, rgba(13,13,26,.98), rgba(8,8,18,1))', border: '1px solid rgba(255,191,26,.12)', borderTop: '1px solid rgba(255,191,26,.22)', borderRadius: '12px', padding: '32px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '50%', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(255,191,26,.5), transparent)' }} />

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', color: '#00b837', marginBottom: '6px' }}>
              ✅ Seu cadastro foi realizado com sucesso!
            </p>
            <p style={{ fontSize: '0.95rem', color: 'rgba(244,236,216,.6)', lineHeight: 1.7 }}>
              Para concluir e garantir <strong style={{ color: '#f4ecd8' }}>acesso às aulas e conteúdos exclusivos</strong>, entre no grupo do WhatsApp abaixo.
            </p>
          </div>

          {/* WhatsApp CTA — main */}
          {wppGroupUrl ? (
            <a href={wppGroupUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', padding: '18px 24px', background: '#00b837', borderRadius: '10px', textAlign: 'center', color: '#fff', fontWeight: 900, fontSize: '1rem', textDecoration: 'none', letterSpacing: '0.04em', boxShadow: '0 8px 32px rgba(0,184,55,.4)', animation: 'pulseGreen 2s ease-in-out infinite' }}>
              📲 ENTRAR NO GRUPO VIP DO WHATSAPP
            </a>
          ) : (
            <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,.04)', borderRadius: '10px' }}>
              <p style={{ color: 'rgba(244,236,216,.4)', fontSize: '0.85rem' }}>Link do grupo será enviado por email</p>
            </div>
          )}
        </div>

        {/* Session time card */}
        <div style={{ background: 'rgba(255,191,26,.04)', border: '1px solid rgba(255,191,26,.12)', borderRadius: '12px', padding: '24px 32px', marginBottom: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(244,236,216,.4)', marginBottom: '8px' }}>Sua aula começa às</p>
          <p style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffbf1a', textShadow: '0 0 30px rgba(255,191,26,.3)', lineHeight: 1 }}>{sessionTime}</p>
          <p style={{ fontSize: '0.72rem', color: 'rgba(244,236,216,.3)', marginTop: '6px' }}>horário de Brasília</p>

          {!started && (
            <div style={{ marginTop: '20px' }}>
              <p style={{ fontSize: '0.75rem', color: 'rgba(244,236,216,.35)', marginBottom: '12px', letterSpacing: '0.06em' }}>A sala abre em:</p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CountdownTimer targetTime={startTime} size="lg" onExpire={() => { setStarted(true); setCanEnter(true) }} />
              </div>
            </div>
          )}
        </div>

        {/* Enter button */}
        <button
          onClick={() => router.push(`/sala/${sessionId}`)}
          disabled={!canEnter}
          style={{
            width: '100%', padding: '18px 24px', borderRadius: '10px', border: 'none', cursor: canEnter ? 'pointer' : 'not-allowed',
            background: canEnter ? 'linear-gradient(135deg, #ffbf1a, #ffe066)' : 'rgba(255,255,255,.06)',
            color: canEnter ? '#070a14' : 'rgba(244,236,216,.25)',
            fontWeight: 900, fontSize: '1rem', letterSpacing: '0.04em',
            boxShadow: canEnter ? '0 8px 32px rgba(255,191,26,.35)' : 'none',
            transition: 'all .3s', marginBottom: '8px',
          }}
        >
          {started
            ? `▶ ENTRAR NA AULA AGORA${isRepeat ? ' (desta vez!)' : ''}`
            : `⏳ A SALA ABRE ÀS ${sessionTime}`
          }
        </button>

        {!canEnter && (
          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'rgba(244,236,216,.25)', marginBottom: '28px' }}>
            O botão será liberado 2 minutos antes do início
          </p>
        )}

        {/* Info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
          <div style={{ background: 'rgba(0,184,55,.05)', border: '1px solid rgba(0,184,55,.15)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>✅</div>
            <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f4ecd8', marginBottom: '6px' }}>Entre no Grupo do Curso</p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(244,236,216,.45)', lineHeight: 1.6 }}>Acesse materiais exclusivos e receba lembretes da aula.</p>
          </div>
          <div style={{ background: 'rgba(255,191,26,.04)', border: '1px solid rgba(255,191,26,.12)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📚</div>
            <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f4ecd8', marginBottom: '6px' }}>Material Enviado</p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(244,236,216,.45)', lineHeight: 1.6 }}>Conteúdo gratuito enviado para seu WhatsApp.</p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,.05)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.72rem', color: 'rgba(244,236,216,.2)', lineHeight: 1.7 }}>
            Este site não é afiliado ao Facebook ou a qualquer entidade do Facebook.<br />
            © {new Date().getFullYear()} Instituto Despertamente. Todos os direitos reservados.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulseGreen {
          0%, 100% { box-shadow: 0 8px 32px rgba(0,184,55,.4); }
          50% { box-shadow: 0 8px 48px rgba(0,184,55,.65); }
        }
      `}</style>
    </div>
  )
}
