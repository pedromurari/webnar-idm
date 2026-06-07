import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Zap, Play, Pause, TrendingUp } from 'lucide-react'

export default function MetaAdsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Meta Ads</h1>
          <p className="text-muted-foreground text-sm">Gestão de campanhas e automação de regras</p>
        </div>
        <div className="flex gap-2">
          <a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" /> Abrir Meta Business
            </Button>
          </a>
        </div>
      </div>

      {/* Config notice */}
      {!process.env.META_ACCESS_TOKEN && (
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
          <p className="text-sm font-semibold text-primary mb-1">⚙️ Configuração necessária</p>
          <p className="text-sm text-muted-foreground">
            Adicione as variáveis <code className="bg-card px-1 rounded text-xs">META_ACCESS_TOKEN</code>, <code className="bg-card px-1 rounded text-xs">META_AD_ACCOUNT_ID</code> e <code className="bg-card px-1 rounded text-xs">META_PIXEL_ID</code> no seu projeto Vercel para ativar a integração.
          </p>
        </div>
      )}

      {/* Metrics overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Gasto Hoje', value: 'R$ —', icon: TrendingUp },
          { label: 'Leads (Meta)', value: '—', icon: Zap },
          { label: 'CPL Médio', value: 'R$ —', icon: TrendingUp },
          { label: 'ROAS', value: '—x', icon: TrendingUp },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-black text-muted-foreground">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaigns table placeholder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Campanhas</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">Campanha</Badge>
              <Badge variant="outline" className="text-xs">Conjunto</Badge>
              <Badge variant="outline" className="text-xs">Anúncio</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Configure o <code className="bg-card px-1 rounded">META_ACCESS_TOKEN</code> para ver campanhas em tempo real</p>
          </div>
        </CardContent>
      </Card>

      {/* Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Regras de Automação</CardTitle>
            <Button size="sm" className="bg-primary text-primary-foreground h-8">
              + Nova Regra
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Pausar se CPL > R$15 por 2 dias', level: 'Conjunto', action: 'Pausar', status: 'ativa' },
              { name: 'Aumentar orçamento se ROAS > 4', level: 'Campanha', action: '+20% budget', status: 'ativa' },
              { name: 'Notificar se gasto > R$500 sem venda', level: 'Campanha', action: 'Notificar WPP', status: 'ativa' },
            ].map((rule, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card/50">
                <div>
                  <p className="text-sm font-medium">{rule.name}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{rule.level}</Badge>
                    <Badge variant="outline" className="text-xs text-primary">{rule.action}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-success">● {rule.status}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Pause className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CAPI status */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Conversions API (CAPI) — Eventos Server-side</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { event: 'Lead', trigger: 'Cadastro na página de captura', endpoint: '/api/register' },
              { event: 'ViewContent', trigger: 'Entrou na sala do webinário', endpoint: '/api/track/enter' },
              { event: 'InitiateCheckout', trigger: 'CTA de oferta apareceu', endpoint: '/api/track/cta' },
              { event: 'Purchase', trigger: 'Webhook de venda aprovada', endpoint: '/api/webhooks/*' },
            ].map(({ event, trigger, endpoint }) => (
              <div key={event} className="p-3 rounded-lg border border-border bg-card/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-sm text-primary">{event}</span>
                  <span className="text-xs text-success">● ativo</span>
                </div>
                <p className="text-xs text-muted-foreground">{trigger}</p>
                <p className="text-xs font-mono text-muted-foreground/60 mt-1">{endpoint}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
