import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, ExternalLink, Settings } from 'lucide-react'

export default async function WebinarsPage() {
  const supabase = await createAdminClient()
  const { data: webinars } = await supabase.from('webinars').select('*').order('created_at', { ascending: false })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Webinários</h1>
          <p className="text-muted-foreground text-sm">Gerenciar webinários e configurações</p>
        </div>
        <Link href="/admin/webinars/new">
          <Button className="bg-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" /> Criar Webinário
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {(webinars || []).map(w => (
          <Card key={w.id} className="card-hover">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base leading-snug">{w.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">/{w.slug}</p>
                </div>
                <Badge variant={w.active ? 'default' : 'secondary'} className={w.active ? 'bg-success/20 text-success border-success/20' : ''}>
                  {w.active ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span>Turmas: a cada {w.session_interval_minutes}min</span>
                <span>Viewers fake: {w.min_fake_viewers}–{w.max_fake_viewers}</span>
                <span>Duração: {Math.floor(w.video_duration_seconds / 60)}min</span>
                <span>CTA no: {w.offer_appears_at_seconds ? `${Math.floor(w.offer_appears_at_seconds / 60)}min` : '—'}</span>
              </div>
              <div className="flex gap-2">
                <Link href={`/${w.slug}`} target="_blank">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" /> Ver captura
                  </Button>
                </Link>
                <Link href={`/admin/comments/${w.id}`}>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <Settings className="h-3.5 w-3.5 mr-1" /> Comentários
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        {!webinars?.length && (
          <div className="col-span-2 text-center py-16 text-muted-foreground">
            <p>Nenhum webinário criado ainda.</p>
            <Link href="/admin/webinars/new" className="text-primary underline text-sm">Criar o primeiro</Link>
          </div>
        )}
      </div>
    </div>
  )
}
