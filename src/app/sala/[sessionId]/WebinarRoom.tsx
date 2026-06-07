'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Send, Radio, ExternalLink } from 'lucide-react'
import type { PaymentOption } from '@/lib/supabase/types'

interface ScriptedComment { id: string; author_name: string; author_initials: string | null; message: string; appears_at_seconds: number }
interface ChatMessage { id: string; user_name: string; message: string; created_at: string; scripted?: boolean }

interface Props {
  sessionId: string; startTime: string; status: string
  webinarId: string; webinarTitle: string; videoUrl: string
  videoDuration: number; offerAppearsAt: number | null
  offerTitle: string | null; offerCtaText: string | null
  paymentConfig: unknown; wppGroupUrl: string | null; webinarSlug: string
  scriptedComments: ScriptedComment[]; initialElapsed: number
  minFakeViewers: number; maxFakeViewers: number
}

export function WebinarRoom({
  sessionId, startTime, webinarTitle, videoUrl, videoDuration,
  offerAppearsAt, offerTitle, offerCtaText, paymentConfig,
  wppGroupUrl, webinarSlug, scriptedComments, initialElapsed,
  minFakeViewers, maxFakeViewers,
}: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [currentSecond, setCurrentSecond] = useState(initialElapsed)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [viewerCount, setViewerCount] = useState(minFakeViewers + Math.floor(Math.random() * 20))
  const [chatInput, setChatInput] = useState('')
  const [showOffer, setShowOffer] = useState(false)
  const [userName, setUserName] = useState('')
  const [regId, setRegId] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const trackedRef = useRef({ entered: false, offer: false })
  const payments = (paymentConfig as PaymentOption[] | null) || []

  // Load reg info from sessionStorage
  useEffect(() => {
    const id = sessionStorage.getItem('reg_id')
    const name = sessionStorage.getItem('reg_name')
    if (id) setRegId(id)
    if (name) setUserName(name)
  }, [])

  // Track enter
  useEffect(() => {
    if (regId && !trackedRef.current.entered) {
      trackedRef.current.entered = true
      fetch('/api/track/enter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ registrationId: regId }) })
    }
  }, [regId])

  // Video timer — sync to real elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - new Date(startTime).getTime()) / 1000)
      setCurrentSecond(Math.min(elapsed, videoDuration))

      // Heartbeat every 60 ticks
      if (elapsed % 60 === 0 && regId) {
        fetch('/api/track/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ registrationId: regId, currentSecond: elapsed, totalSeconds: videoDuration }),
        })
      }

      // Check offer CTA
      if (offerAppearsAt && elapsed >= offerAppearsAt && !showOffer) {
        setShowOffer(true)
        if (regId && !trackedRef.current.offer) {
          trackedRef.current.offer = true
          fetch('/api/track/cta', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ registrationId: regId }) })
        }
      }

      // End of video
      if (elapsed >= videoDuration) {
        clearInterval(interval)
        setTimeout(() => router.push(`/oferta/${webinarSlug}`), 3000)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime, videoDuration, offerAppearsAt, showOffer, regId, webinarSlug, router])

  // Fake viewer count fluctuation
  useEffect(() => {
    const mid = Math.floor((minFakeViewers + maxFakeViewers) / 2)
    setViewerCount(mid + Math.floor(Math.random() * (maxFakeViewers - mid)))
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const delta = Math.floor(Math.random() * 7) - 3
        return Math.max(minFakeViewers, Math.min(maxFakeViewers, prev + delta))
      })
    }, 30000)
    return () => clearInterval(interval)
  }, [minFakeViewers, maxFakeViewers])

  // Scripted comments injection
  useEffect(() => {
    const fired = new Set<string>()
    const interval = setInterval(() => {
      for (const sc of scriptedComments) {
        if (!fired.has(sc.id) && currentSecond >= sc.appears_at_seconds) {
          fired.add(sc.id)
          const msg: ChatMessage = {
            id: sc.id,
            user_name: sc.author_name,
            message: sc.message,
            created_at: new Date().toISOString(),
            scripted: true,
          }
          setMessages(prev => [...prev.slice(-80), msg])
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [currentSecond, scriptedComments])

  // Real-time chat via Supabase Realtime
  useEffect(() => {
    const channel = supabase
      .channel(`room:${sessionId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'live_messages', filter: `session_id=eq.${sessionId}` }, (payload) => {
        const row = payload.new as ChatMessage
        setMessages(prev => [...prev.slice(-80), row])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [sessionId, supabase])

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    const msg = chatInput.trim()
    if (!msg || !userName) return
    setChatInput('')
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, userName, message: msg }),
    })
  }

  function handleOfferClick(url: string) {
    if (regId) fetch('/api/track/offer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ registrationId: regId }) })
    window.open(url, '_blank')
  }

  const progress = Math.min((currentSecond / videoDuration) * 100, 100)
  const timeLeft = videoDuration - currentSecond
  const tlMin = Math.floor(timeLeft / 60), tlSec = timeLeft % 60

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-xs font-semibold text-destructive uppercase tracking-wider">Ao Vivo</span>
          <span className="text-muted-foreground text-xs ml-2 hidden sm:inline">{webinarTitle}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span className="font-semibold text-foreground">{viewerCount.toLocaleString('pt-BR')}</span>
          <span className="hidden sm:inline">assistindo</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">

        {/* Video area */}
        <div className="flex-1 flex flex-col">
          {/* Video player */}
          <div className="relative bg-black" style={{ paddingBottom: '56.25%' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              {videoUrl ? (
                <iframe
                  src={`${videoUrl}#t=${initialElapsed}`}
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  style={{ pointerEvents: 'none' }} // blocks interaction = no controls
                  allowFullScreen={false}
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Radio className="h-12 w-12 animate-pulse" />
                  <p className="text-sm">Transmissão ao vivo</p>
                </div>
              )}
              {/* Invisible overlay to block controls */}
              <div className="absolute inset-0" style={{ zIndex: 10 }} />
            </div>
          </div>

          {/* Progress bar (fake live scrubber) */}
          <div className="px-4 py-2 bg-black/40 flex items-center gap-3">
            <span className="text-xs text-red-500 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> AO VIVO
            </span>
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs text-white/50">{tlMin}:{String(tlSec).padStart(2,'0')} restantes</span>
          </div>

          {/* Offer CTA overlay */}
          {showOffer && (
            <div className="mx-4 my-3 p-5 rounded-2xl border-2 border-primary bg-primary/10 animate-in slide-in-from-bottom-4">
              <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">⚡ Oferta exclusiva — apenas durante a aula</p>
              <p className="font-bold text-lg mb-3">{offerTitle || 'Garanta sua vaga com desconto especial!'}</p>
              <div className="flex flex-wrap gap-2">
                {payments.map((p, i) => (
                  <Button key={i} onClick={() => handleOfferClick(p.url)} className={`${i === 0 ? 'bg-primary text-primary-foreground pulse-primary' : 'bg-card border border-border text-foreground'} font-bold`}>
                    {offerCtaText || p.label} <ExternalLink className="h-3.5 w-3.5 ml-1" />
                  </Button>
                ))}
                {wppGroupUrl && (
                  <Button variant="outline" onClick={() => window.open(wppGroupUrl, '_blank')} className="border-success text-success hover:bg-success/10">
                    Grupo VIP WhatsApp
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Chat sidebar */}
        <div className="lg:w-80 flex flex-col border-t lg:border-t-0 lg:border-l border-border" style={{ height: 'calc(100vh - 60px)' }}>
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <span className="font-semibold text-sm">Chat ao vivo</span>
            <div className="flex items-center gap-1.5 text-xs text-success">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              {messages.length} mensagens
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className="text-sm">
                <span className="font-semibold text-primary mr-1.5">{msg.user_name}</span>
                <span className="text-muted-foreground">{msg.message}</span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border flex gap-2">
            <Input
              placeholder="Digite uma mensagem..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              className="flex-1 h-9 text-sm bg-card/60"
            />
            <Button size="icon" onClick={sendMessage} className="h-9 w-9 bg-primary text-primary-foreground shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
