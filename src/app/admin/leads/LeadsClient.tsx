'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Download, Search, User } from 'lucide-react'
import type { Database } from '@/lib/supabase/types'

type Registration = Database['public']['Tables']['registrations']['Row'] & {
  webinars: { title: string; slug: string } | null
  sessions: { start_time: string } | null
}

const stageColors: Record<string, string> = {
  registered: 'bg-muted text-muted-foreground',
  entered: 'bg-blue-500/20 text-blue-300',
  watched_25: 'bg-purple-500/20 text-purple-300',
  watched_50: 'bg-yellow-500/20 text-yellow-300',
  watched_75: 'bg-orange-500/20 text-orange-300',
  completed: 'bg-primary/20 text-primary',
  cta_seen: 'bg-red-500/20 text-red-300',
  offer_clicked: 'bg-success/20 text-success',
}

const stageLabels: Record<string, string> = {
  registered: 'Cadastrou',
  entered: 'Entrou na sala',
  watched_25: 'Assistiu 25%',
  watched_50: 'Assistiu 50%',
  watched_75: 'Assistiu 75%',
  completed: 'Completou',
  cta_seen: 'Viu oferta',
  offer_clicked: 'Clicou oferta',
}

interface Props {
  leads: Registration[]
  total: number
  webinars: { id: string; title: string }[]
}

export function LeadsClient({ leads, total, webinars }: Props) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Registration | null>(null)

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    (l.phone || '').includes(search)
  )

  function exportCSV() {
    const headers = ['Nome', 'E-mail', 'Telefone', 'Webinário', 'Canal', 'Campanha', 'Dispositivo', 'Estágio', '% Assistido', 'Data']
    const rows = filtered.map(l => [
      l.name, l.email, l.phone || '', l.webinars?.title || '', l.utm_source || '',
      l.utm_campaign || '', l.device || '', stageLabels[l.watch_stage] || l.watch_stage,
      `${l.max_watched_pct}%`, new Date(l.created_at).toLocaleDateString('pt-BR'),
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `leads-idm-${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Leads CRM</h1>
          <p className="text-sm text-muted-foreground">{total.toLocaleString('pt-BR')} leads cadastrados</p>
        </div>
        <Button onClick={exportCSV} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" /> Exportar CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, e-mail ou telefone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <form className="flex gap-2">
          <Select name="stage">
            <SelectTrigger className="w-40 h-9"><SelectValue placeholder="Estágio" /></SelectTrigger>
            <SelectContent>
              {Object.entries(stageLabels).map(([v, l]) => (
                <SelectItem key={v} value={v}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select name="device">
            <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Dispositivo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="mobile">Mobile</SelectItem>
              <SelectItem value="desktop">Desktop</SelectItem>
            </SelectContent>
          </Select>
        </form>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead</TableHead>
              <TableHead>Webinário</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Dispositivo</TableHead>
              <TableHead>Estágio</TableHead>
              <TableHead>% Vídeo</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(lead => (
              <TableRow key={lead.id} className="cursor-pointer hover:bg-secondary/50" onClick={() => setSelected(lead)}>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.email}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{lead.webinars?.title || '—'}</TableCell>
                <TableCell>
                  {lead.utm_source ? <Badge variant="outline" className="text-xs">{lead.utm_source}</Badge> : <span className="text-muted-foreground text-xs">direto</span>}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{lead.device || '—'}</TableCell>
                <TableCell>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${stageColors[lead.watch_stage] || ''}`}>
                    {stageLabels[lead.watch_stage] || lead.watch_stage}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${lead.max_watched_pct}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{lead.max_watched_pct}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Lead detail panel */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="w-96 bg-card border-border">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {selected?.name}
            </SheetTitle>
          </SheetHeader>
          {selected && (
            <div className="mt-6 space-y-4 text-sm">
              {[
                ['E-mail', selected.email],
                ['Telefone', selected.phone || '—'],
                ['Webinário', selected.webinars?.title || '—'],
                ['Canal (UTM Source)', selected.utm_source || 'direto'],
                ['Campanha', selected.utm_campaign || '—'],
                ['Dispositivo', selected.device || '—'],
                ['Navegador', selected.browser || '—'],
                ['Sistema', selected.os || '—'],
                ['País', selected.country || '—'],
                ['Estágio atual', stageLabels[selected.watch_stage] || selected.watch_stage],
                ['% máximo assistido', `${selected.max_watched_pct}%`],
                ['Entrou na sala', selected.room_entered_at ? new Date(selected.room_entered_at).toLocaleString('pt-BR') : 'Não'],
                ['Viu o CTA', selected.cta_seen_at ? new Date(selected.cta_seen_at).toLocaleString('pt-BR') : 'Não'],
                ['Clicou na oferta', selected.offer_clicked_at ? new Date(selected.offer_clicked_at).toLocaleString('pt-BR') : 'Não'],
                ['E-mail enviado', selected.email_sent ? '✅' : '❌'],
                ['WPP enviado', selected.wpp_sent ? '✅' : '❌'],
                ['Lead repetido', selected.is_repeat ? `Sim (${selected.repeat_count}x)` : 'Não'],
                ['Cadastrou em', new Date(selected.created_at).toLocaleString('pt-BR')],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2 border-b border-border">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium text-right">{v}</span>
                </div>
              ))}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
