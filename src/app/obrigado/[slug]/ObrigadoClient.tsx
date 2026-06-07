'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CountdownTimer } from '@/components/webinar/CountdownTimer'
import { Button } from '@/components/ui/button'
import { CheckCircle, MessageCircle, Play } from 'lucide-react'

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

    // Allow entry 2 minutes before start
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

  function enterRoom() {
    router.push(`/sala/${sessionId}`)
  }

  const sessionTime = new Date(startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl text-center space-y-8">

        {/* Check icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
        </div>

        {/* Heading */}
        <div>
          {isRepeat ? (
            <>
              <h1 className="text-3xl md:text-4xl font-black mb-3">
                Que alegria te ver aqui novamente, <span className="text-primary">{userName}</span>! 😊
              </h1>
              <p className="text-muted-foreground text-lg">
                Ficamos muito felizes com seu retorno. Desta vez esperamos que você consiga aproveitar tudo que preparamos.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-black mb-3">
                <span className="text-primary">{userName}</span>, sua vaga está garantida! 🎉
              </h1>
              <p className="text-muted-foreground text-lg">
                Você está inscrito na aula: <strong className="text-foreground">{webinarTitle}</strong>
              </p>
            </>
          )}
        </div>

        {/* Session time */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-muted-foreground text-sm mb-2">Sua turma começa às</p>
          <p className="text-4xl font-black text-primary">{sessionTime}</p>
          <p className="text-muted-foreground text-sm mt-1">(horário de Brasília)</p>
        </div>

        {/* Countdown */}
        {!started && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">A sala abre em:</p>
            <div className="flex justify-center">
              <CountdownTimer targetTime={startTime} size="lg" onExpire={() => { setStarted(true); setCanEnter(true) }} />
            </div>
          </div>
        )}

        {/* CTA Enter */}
        <div className="space-y-4">
          <Button
            onClick={enterRoom}
            disabled={!canEnter}
            size="lg"
            className={`w-full h-16 text-lg font-black ${canEnter ? 'bg-primary text-primary-foreground pulse-primary hover:brightness-110' : 'opacity-50 cursor-not-allowed'}`}
          >
            <Play className="h-5 w-5 mr-2" />
            {started ? `ENTRAR NA AULA AGORA ${isRepeat ? '(desta vez!)' : ''}` : `A SALA ABRE ÀS ${sessionTime}`}
          </Button>

          {!canEnter && (
            <p className="text-xs text-muted-foreground">O botão será liberado 2 minutos antes do início</p>
          )}
        </div>

        {/* WhatsApp VIP group */}
        {wppGroupUrl && (
          <div className="rounded-2xl border border-success/20 bg-success/5 p-6 space-y-3">
            <p className="font-semibold">📲 Enquanto espera, entre no grupo VIP</p>
            <p className="text-sm text-muted-foreground">Receba lembretes e conteúdos exclusivos antes da aula</p>
            <a href={wppGroupUrl} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-success text-success-foreground hover:brightness-110 pulse-success h-12">
                <MessageCircle className="h-4 w-4 mr-2" />
                ENTRAR NO GRUPO VIP DO WHATSAPP
              </Button>
            </a>
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Instituto Despertamente
        </p>
      </div>
    </div>
  )
}
