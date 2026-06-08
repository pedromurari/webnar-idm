'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

export function RegistrationFormLP({ webinarId, webinarSlug }: { webinarId: string; webinarSlug: string }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email) { setError('Preencha nome e e-mail'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, webinarId, utm: getUTM() }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erro ao cadastrar'); setLoading(false); return }
      if (data.repeat && data.watched) {
        router.push(`/oferta/${webinarSlug}?name=${encodeURIComponent(name)}`); return
      }
      sessionStorage.setItem('reg_id', data.registrationId)
      sessionStorage.setItem('reg_name', name)
      sessionStorage.setItem('session_id', data.sessionId)
      router.push(`/obrigado/${webinarSlug}?sessionId=${data.sessionId}&name=${encodeURIComponent(name)}&repeat=${data.repeat ? '1' : '0'}`)
    } catch {
      setError('Erro de conexão. Tente novamente.'); setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="v2-field">
        <label className="v2-field-label" htmlFor="lp-name">Seu nome completo</label>
        <input
          className="v2-field-input"
          id="lp-name" type="text"
          placeholder="Como você é conhecido"
          value={name} onChange={e => setName(e.target.value)} required
        />
      </div>
      <div className="v2-field">
        <label className="v2-field-label" htmlFor="lp-email">Seu melhor e-mail</label>
        <input
          className="v2-field-input"
          id="lp-email" type="email"
          placeholder="email@exemplo.com"
          value={email} onChange={e => setEmail(e.target.value)} required
        />
      </div>
      <div className="v2-field">
        <label className="v2-field-label" htmlFor="lp-phone">WhatsApp (opcional)</label>
        <input
          className="v2-field-input"
          id="lp-phone" type="tel"
          placeholder="(11) 99999-9999"
          value={phone} onChange={e => setPhone(e.target.value)}
        />
      </div>
      {error && <div className="v2-err">{error}</div>}
      <button type="submit" disabled={loading} className="v2-submit-btn">
        {loading ? 'GARANTINDO SUA VAGA...' : 'GARANTIR MINHA VAGA AGORA →'}
      </button>
      <p className="v2-form-footer">🔒 Seus dados não são compartilhados.</p>
    </form>
  )
}
