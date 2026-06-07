import { createAdminClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { LeadsClient } from './LeadsClient'

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams
  const supabase = await createAdminClient()

  let query = supabase
    .from('registrations')
    .select('*, webinars(title, slug), sessions(start_time)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(100)

  if (sp.webinar) query = query.eq('webinar_id', sp.webinar)
  if (sp.stage) query = query.eq('watch_stage', sp.stage)
  if (sp.source) query = query.eq('utm_source', sp.source)
  if (sp.device) query = query.eq('device', sp.device)

  const { data: leads, count } = await query
  const { data: webinars } = await supabase.from('webinars').select('id, title').eq('active', true)

  return <LeadsClient leads={leads || []} total={count || 0} webinars={webinars || []} />
}
