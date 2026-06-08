'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, MessageCircle, TrendingUp, Megaphone, Settings, LogOut, Tv, ChevronRight, ChevronLeft } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads CRM', icon: Users },
  { href: '/admin/vendas', label: 'Vendas', icon: TrendingUp },
  { href: '/admin/meta', label: 'Meta Ads', icon: Megaphone },
  { href: '/admin/whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { href: '/admin/webinars', label: 'Webinários', icon: Tv },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: collapsed ? '64px' : '240px',
        flexShrink: 0,
        background: '#0d0d1a',
        borderRight: '1px solid rgba(255,255,255,.07)',
        minHeight: 'calc(100vh - 56px)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'width 0.25s ease',
        overflow: 'hidden',
      }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'absolute',
          right: '-12px',
          top: '20px',
          zIndex: 10,
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: '#1a1a2e',
          border: '1px solid rgba(255,255,255,.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'rgba(244,236,216,.5)',
          transition: 'all .2s',
        }}
        aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: isActive ? 700 : 400,
                color: isActive ? '#ffbf1a' : 'rgba(244,236,216,.5)',
                background: isActive ? 'rgba(255,191,26,.08)' : 'transparent',
                transition: 'all .15s',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <Icon size={16} style={{ flexShrink: 0, color: isActive ? '#ffbf1a' : 'rgba(244,236,216,.4)' }} />
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,.05)' }}>
        <Link
          href="/admin/settings"
          title={collapsed ? 'Configurações' : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '8px', textDecoration: 'none',
            fontSize: '0.85rem', color: 'rgba(244,236,216,.4)',
            whiteSpace: 'nowrap', overflow: 'hidden',
            transition: 'all .15s',
          }}
        >
          <Settings size={16} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Configurações</span>}
        </Link>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            title={collapsed ? 'Sair' : undefined}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px', width: '100%', border: 'none',
              background: 'transparent', cursor: 'pointer',
              fontSize: '0.85rem', color: 'rgba(244,236,216,.4)',
              whiteSpace: 'nowrap', overflow: 'hidden',
              transition: 'all .15s',
            }}
          >
            <LogOut size={16} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Sair</span>}
          </button>
        </form>
      </div>
    </aside>
  )
}
