import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from './AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div style={{ minHeight: '100vh', background: '#070a14', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        height: '56px', flexShrink: 0,
        background: '#0d0d1a',
        borderBottom: '1px solid rgba(255,255,255,.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* IDM badge */}
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            border: '1px solid rgba(255,191,26,.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.65rem', fontWeight: 900, color: '#ffbf1a',
          }}>IDM</div>
          <div>
            <p style={{ fontWeight: 800, fontSize: '0.9rem', color: '#f4ecd8', lineHeight: 1 }}>IDM Webinários</p>
            <p style={{ fontSize: '0.65rem', color: 'rgba(244,236,216,.3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '2px' }}>Painel Administrativo</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#00b837', boxShadow: '0 0 8px rgba(0,184,55,.6)',
          }} />
          <span style={{ fontSize: '0.72rem', color: 'rgba(244,236,216,.4)' }}>{user.email}</span>
        </div>
      </header>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AdminSidebar />
        <main style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
