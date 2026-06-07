import { createAdminClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DollarSign, TrendingUp, ShoppingCart, BarChart2 } from 'lucide-react'

export default async function VendasPage() {
  const supabase = await createAdminClient()

  const { data: sales } = await supabase
    .from('sales')
    .select('*')
    .order('paid_at', { ascending: false })
    .limit(100)

  const approved = sales?.filter(s => s.status === 'approved') || []
  const grossTotal = approved.reduce((sum, s) => sum + s.gross_amount, 0)
  const netTotal = approved.reduce((sum, s) => sum + s.net_amount, 0)
  const feesTotal = grossTotal - netTotal
  const avgTicket = approved.length ? netTotal / approved.length : 0

  const byPlatform = approved.reduce((acc, s) => {
    acc[s.platform] = (acc[s.platform] || 0) + s.net_amount
    return acc
  }, {} as Record<string, number>)

  const bySource = approved.reduce((acc, s) => {
    const k = s.utm_source || 'direto'
    acc[k] = (acc[k] || 0) + s.net_amount
    return acc
  }, {} as Record<string, number>)

  const fmt = (n: number) => `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

  const statusColors: Record<string, string> = {
    approved: 'bg-success/20 text-success',
    refunded: 'bg-destructive/20 text-destructive',
    pending: 'bg-yellow-500/20 text-yellow-400',
    cancelled: 'bg-muted text-muted-foreground',
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black">Vendas & Faturamento</h1>
        <p className="text-muted-foreground text-sm">Dados reais das plataformas de pagamento</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Faturamento Bruto', value: fmt(grossTotal), icon: DollarSign, note: 'Total cobrado' },
          { label: 'Taxas das Plataformas', value: fmt(feesTotal), icon: BarChart2, note: 'Custo gateway' },
          { label: 'Faturamento Líquido', value: fmt(netTotal), icon: TrendingUp, note: 'O que cai na conta' },
          { label: 'Ticket Médio Líquido', value: fmt(avgTicket), icon: ShoppingCart, note: `${approved.length} vendas` },
        ].map(({ label, value, icon: Icon, note }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs text-muted-foreground font-medium">{label}</CardTitle>
              <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-black text-success">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* By platform + by source */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Por Plataforma</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(byPlatform).map(([k, v]) => (
              <div key={k} className="flex justify-between items-center">
                <span className="text-sm capitalize">{k.replace('_', ' ')}</span>
                <span className="font-bold text-success">{fmt(v as number)}</span>
              </div>
            ))}
            {!Object.keys(byPlatform).length && <p className="text-muted-foreground text-sm">Nenhuma venda ainda</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Por Canal (UTM Source)</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(bySource).sort((a,b) => (b[1] as number)-(a[1] as number)).map(([k, v]) => (
              <div key={k} className="flex justify-between items-center">
                <span className="text-sm">{k}</span>
                <span className="font-bold text-success">{fmt(v as number)}</span>
              </div>
            ))}
            {!Object.keys(bySource).length && <p className="text-muted-foreground text-sm">Nenhuma venda ainda</p>}
          </CardContent>
        </Card>
      </div>

      {/* Sales table */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Últimas Vendas</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead>Bruto</TableHead>
                <TableHead>Líquido</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(sales || []).map(s => (
                <TableRow key={s.id}>
                  <TableCell className="text-sm">{s.customer_name || s.customer_email || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.product_name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs capitalize">{s.platform.replace('_', ' ')}</Badge></TableCell>
                  <TableCell className="text-sm">{fmt(s.gross_amount)}</TableCell>
                  <TableCell className="text-sm font-semibold text-success">{fmt(s.net_amount)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status] || ''}`}>{s.status}</span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {s.paid_at ? new Date(s.paid_at).toLocaleDateString('pt-BR') : '—'}
                  </TableCell>
                </TableRow>
              ))}
              {!sales?.length && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhuma venda registrada</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
