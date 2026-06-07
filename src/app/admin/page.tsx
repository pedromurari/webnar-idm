import { createAdminClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, TrendingUp, Eye, MousePointerClick, DollarSign, Tv } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createAdminClient()
  const today = new Date().toISOString().split('T')[0]

  const [
    { count: totalLeads },
    { count: todayLeads },
    { count: entered },
    { count: ctaSeen },
    { count: offerClicked },
    { data: revenueData },
    { count: activeWebinars },
  ] = await Promise.all([
    supabase.from('registrations').select('*', { count: 'exact', head: true }),
    supabase.from('registrations').select('*', { count: 'exact', head: true }).gte('created_at', `${today}T00:00:00`),
    supabase.from('registrations').select('*', { count: 'exact', head: true }).not('room_entered_at', 'is', null),
    supabase.from('registrations').select('*', { count: 'exact', head: true }).not('cta_seen_at', 'is', null),
    supabase.from('registrations').select('*', { count: 'exact', head: true }).not('offer_clicked_at', 'is', null),
    supabase.from('sales').select('net_amount').eq('status', 'approved'),
    supabase.from('webinars').select('*', { count: 'exact', head: true }).eq('active', true),
  ])

  const totalRevenue = revenueData?.reduce((sum, s) => sum + (s.net_amount || 0), 0) || 0
  const conversionRate = totalLeads ? ((offerClicked || 0) / totalLeads * 100).toFixed(1) : '0'

  const metrics = [
    { label: 'Total de Leads', value: totalLeads?.toLocaleString('pt-BR') || '0', icon: Users, color: 'text-blue-400' },
    { label: 'Leads Hoje', value: todayLeads?.toLocaleString('pt-BR') || '0', icon: Users, color: 'text-primary' },
    { label: 'Entraram na Sala', value: entered?.toLocaleString('pt-BR') || '0', icon: Eye, color: 'text-purple-400' },
    { label: 'Viram o CTA', value: ctaSeen?.toLocaleString('pt-BR') || '0', icon: Eye, color: 'text-yellow-400' },
    { label: 'Clicaram na Oferta', value: offerClicked?.toLocaleString('pt-BR') || '0', icon: MousePointerClick, color: 'text-orange-400' },
    { label: 'Faturamento Líquido', value: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-success' },
    { label: 'Taxa de Conversão', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-primary' },
    { label: 'Webinários Ativos', value: activeWebinars?.toString() || '0', icon: Tv, color: 'text-cyan-400' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Visão geral do sistema · {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs text-muted-foreground font-medium">{label}</CardTitle>
              <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-black">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Funil de Conversão</CardTitle>
        </CardHeader>
        <CardContent>
          {[
            { label: 'Cadastrados', count: totalLeads || 0, pct: 100 },
            { label: 'Entraram na Sala', count: entered || 0, pct: totalLeads ? Math.round((entered || 0) / totalLeads * 100) : 0 },
            { label: 'Viram o CTA', count: ctaSeen || 0, pct: totalLeads ? Math.round((ctaSeen || 0) / totalLeads * 100) : 0 },
            { label: 'Clicaram na Oferta', count: offerClicked || 0, pct: totalLeads ? Math.round((offerClicked || 0) / totalLeads * 100) : 0 },
          ].map(({ label, count, pct }) => (
            <div key={label} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>{label}</span>
                <span className="font-semibold">{count.toLocaleString('pt-BR')} <span className="text-muted-foreground font-normal">({pct}%)</span></span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
