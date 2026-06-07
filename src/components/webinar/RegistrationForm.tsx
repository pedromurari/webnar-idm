'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Lock, Users } from 'lucide-react'

interface RegistrationFormProps {
  webinarId: string
  webinarSlug: string
  isRepeatUser?: boolean
  repeatName?: string
}

function getUTM() {
  if (typeof window === 'undefined') return {}
  const p = new URLSearchParams(window.location.search)
  return {
    source: p.get('utm_source') || '',
    medium: p.get('utm_medium') || '',
    campaign: p.get('utm_campaign') || '',
    content: p.get('utm_content') || '',
    term: p.get('utm_term') || '',
  }
}

export function RegistrationForm({ webinarId, webinarSlug, isRepeatUser, repeatName }: RegistrationFormProps) {
  const router = useRouter()
  const [name, setName] = useState(repeatName || '')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email) { setError('Preencha nome e e-mail'); return }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, webinarId, utm: getUTM() }),
      })

      const data = await res.json()

      if (!res.ok) { setError(data.error || 'Erro ao cadastrar'); setLoading(false); return }

      if (data.repeat && data.watched) {
        // Already watched — redirect to offer page
        router.push(`/oferta/${webinarSlug}?name=${encodeURIComponent(name)}`)
        return
      }

      // Save to sessionStorage for use in the room
      sessionStorage.setItem('reg_id', data.registrationId)
      sessionStorage.setItem('reg_name', name)
      sessionStorage.setItem('session_id', data.sessionId)

      router.push(`/obrigado/${webinarSlug}?sessionId=${data.sessionId}&name=${encodeURIComponent(name)}&repeat=${data.repeat ? '1' : '0'}`)
    } catch {
      setError('Erro de conexão. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isRepeatUser && (
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary">
          😊 Que alegria ver você novamente! Preencha para entrar na próxima turma.
        </div>
      )}

      <div>
        <Label htmlFor="reg-name" className="text-sm text-muted-foreground mb-1.5 block">Seu nome completo</Label>
        <Input
          id="reg-name"
          placeholder="Ex.: Maria Silva"
          value={name}
          onChange={e => setName(e.target.value)}
          className="bg-card/60 border-border/60 h-12 text-base focus-visible:border-primary"
          required
        />
      </div>

      <div>
        <Label htmlFor="reg-email" className="text-sm text-muted-foreground mb-1.5 block">Seu melhor e-mail</Label>
        <Input
          id="reg-email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="bg-card/60 border-border/60 h-12 text-base focus-visible:border-primary"
          required
        />
      </div>

      <div>
        <Label htmlFor="reg-phone" className="text-sm text-muted-foreground mb-1.5 block">WhatsApp (opcional)</Label>
        <Input
          id="reg-phone"
          type="tel"
          placeholder="(11) 99999-9999"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="bg-card/60 border-border/60 h-12 text-base focus-visible:border-primary"
        />
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-14 text-base font-black bg-primary text-primary-foreground hover:brightness-110 pulse-primary"
      >
        {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : null}
        {loading ? 'GARANTINDO SUA VAGA...' : 'QUERO PARTICIPAR AGORA →'}
      </Button>

      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> 100% seguro</span>
        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Vagas limitadas</span>
      </div>
    </form>
  )
}
