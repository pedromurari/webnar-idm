import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RegistrationFormLP } from '@/components/webinar/RegistrationFormLP'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('webinars').select('title, description').eq('slug', slug).single()
  if (!data) return { title: 'IDM Webinários' }
  return { title: `${data.title} | Instituto Despertamente`, description: data.description || undefined }
}

const features = [
  { icon: '🧠', title: 'Fundamentos da Psicanálise', text: 'Entenda como a mente funciona e quais mecanismos moldam seus pensamentos, emoções e comportamentos.' },
  { icon: '🔄', title: 'Padrões Inconscientes', text: 'Identifique os padrões ocultos que sabotam seus relacionamentos, sua carreira e sua vida.' },
  { icon: '💬', title: 'Comunicação Profunda', text: 'Aprenda a se comunicar com mais autenticidade e a criar conexões genuínas e duradouras.' },
  { icon: '🎯', title: 'Propósito e Clareza', text: 'Descubra o que realmente move você e como alinhar suas escolhas ao seu propósito mais profundo.' },
  { icon: '❤️', title: 'Vínculos e Relações', text: 'Entenda como seus vínculos afetivos da infância ainda influenciam seus relacionamentos hoje.' },
  { icon: '🔑', title: 'Ferramentas de Transformação', text: 'Métodos práticos e aplicáveis para promover mudanças reais e duradouras na sua vida.' },
]

export default async function CapturePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: webinar } = await supabase
    .from('webinars')
    .select('id, title, description, presenter_name, presenter_photo_url, slug')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (!webinar) notFound()

  return (
    <>
      {/* Google Fonts — same as SN-main reference */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />

      {/* CSS — copied verbatim from SN-main, amber replaced with IDM gold */}
      <style>{`
        /* ── RESET GLOBAL (sobrepõe globals.css do Next.js) ── */
        html, body {
          background: #000000 !important;
          background-image: none !important;
          color: #f5f5f7 !important;
          font-family: 'DM Sans', system-ui, -apple-system, sans-serif !important;
          font-size: 16px !important;
          line-height: 1.6 !important;
          min-height: 100vh !important;
          overflow-x: hidden !important;
          -webkit-font-smoothing: antialiased !important;
        }
        #lp-root * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        #lp-root a { text-decoration: none }

        /* ── DESIGN TOKENS (idêntico ao SN-main, amber = IDM gold) ── */
        #lp-root {
          --bg: #000000;
          --s1: #0a0a0a;
          --s2: #141414;
          --s3: #1c1c1e;
          --s4: #2c2c2e;
          --border: rgba(255,255,255,.07);
          --border2: rgba(255,255,255,.12);
          --border3: rgba(255,255,255,.2);
          --text: #f5f5f7;
          --text2: #a1a1a6;
          --text3: #6e6e73;
          --amber: #ffbf1a;
          --amber2: #ffe066;
          --amberBg: rgba(255,191,26,.08);
          --amberLine: rgba(255,191,26,.22);
          --green: #c8883a;
          --red: #a83818;
          --r: 18px; --r-sm: 12px; --r-xs: 8px;
          background: #000;
          color: #f5f5f7;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        /* ── ANIMAÇÕES (idêntico ao SN-main) ── */
        @keyframes fadeUp2 { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn2 { from{opacity:0} to{opacity:1} }
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes pulseAmber { 0%,100%{box-shadow:0 0 0 0 rgba(255,191,26,.35)} 70%{box-shadow:0 0 0 10px transparent} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes glow { 0%,100%{text-shadow:0 0 20px rgba(255,191,26,.3)} 50%{text-shadow:0 0 40px rgba(255,191,26,.7),0 0 80px rgba(255,191,26,.2)} }

        /* ── NAVBAR (idêntico ao SN-main v2) ── */
        .v2-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 0 32px; height: 56px;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(0,0,0,.8);
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
          border-bottom: 1px solid rgba(255,255,255,.07);
        }
        .v2-nav-logo {
          display: inline-flex; align-items: center; gap: 10px;
          text-decoration: none; cursor: pointer;
        }
        .v2-nav-logo-badge {
          width: 40px; height: 40px; border-radius: 50%;
          border: 1px solid rgba(255,191,26,.3);
          display: flex; align-items: center; justify-content: center;
          font-size: .58rem; font-weight: 900; color: #ffbf1a;
          letter-spacing: .04em; flex-shrink: 0;
        }
        .v2-nav-logo-name {
          font-family: 'DM Serif Display', serif;
          font-size: .95rem; font-weight: 400; color: #fff; letter-spacing: -.01em;
        }
        .v2-nav-cta {
          font-size: .78rem; font-weight: 600; color: var(--amber);
          letter-spacing: .05em; cursor: pointer; padding: 6px 14px;
          border: 1px solid var(--amberLine); border-radius: 20px;
          transition: all .25s; background: var(--amberBg); text-decoration: none;
          display: inline-block;
        }
        .v2-nav-cta:hover { background: rgba(255,191,26,.15); border-color: rgba(255,191,26,.4) }

        /* ── TICKER (idêntico ao SN-main) ── */
        .v2-ticker-wrap { overflow: hidden; margin-top: 56px }
        .v2-ticker {
          background: rgba(255,191,26,.04);
          border-bottom: 1px solid rgba(255,191,26,.08);
          overflow: hidden; height: 36px;
          display: flex; align-items: center;
        }
        .v2-ticker-inner {
          display: flex; gap: 0; white-space: nowrap;
          animation: ticker 30s linear infinite;
        }
        .v2-ticker-inner span {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 0 32px; font-size: .72rem; font-weight: 500;
          color: var(--text2); letter-spacing: .04em;
        }
        .v2-ticker-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--amber); flex-shrink: 0 }

        /* ── HERO BODY (idêntico ao SN-main) ── */
        .v2-hero-body {
          max-width: 840px; margin: 0 auto;
          padding: 72px 24px 80px; text-align: center;
        }
        .v2-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: .72rem; font-weight: 700; letter-spacing: .12em;
          text-transform: uppercase; color: var(--amber); margin-bottom: 28px;
          animation: fadeUp2 .6s ease both;
        }
        .v2-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--amber) }
        .v2-hero-h1 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2.6rem,7vw,5.2rem); font-weight: 400;
          color: #fff; line-height: 1.05; letter-spacing: -.02em;
          margin-bottom: 20px; text-wrap: balance;
          max-width: 700px; margin-left: auto; margin-right: auto;
          animation: fadeUp2 .6s ease .1s both;
        }
        .v2-hero-accent { color: var(--amber) }
        .v2-hero-sub {
          font-size: clamp(1rem,2.5vw,1.18rem); color: var(--text2);
          line-height: 1.7; max-width: 560px; margin: 0 auto 40px;
          animation: fadeUp2 .6s ease .2s both; font-weight: 400;
        }
        .v2-hero-cta-wrap { animation: fadeUp2 .6s ease .4s both }
        .v2-hero-cta {
          display: inline-flex; align-items: center; gap: 10px;
          background: #fff; color: #000; font-family: 'DM Sans', sans-serif;
          font-size: 1rem; font-weight: 800; letter-spacing: .01em;
          padding: 17px 36px; border-radius: 50px; border: none; cursor: pointer;
          transition: all .25s; text-decoration: none;
        }
        .v2-hero-cta:hover { background: #f5f5f5; transform: scale(1.03); box-shadow: 0 8px 32px rgba(255,255,255,.14) }
        .v2-hero-cta svg { transition: transform .25s }
        .v2-hero-cta:hover svg { transform: translateX(4px) }
        .v2-cta-sub { font-size: .72rem; color: var(--text3); margin-top: 12px; font-weight: 500 }

        /* ── STATS (idêntico ao SN-main) ── */
        .v2-hero-stats {
          display: flex; justify-content: center; gap: 40px; flex-wrap: wrap;
          margin-top: 80px; padding-top: 40px; border-top: 1px solid var(--border);
          animation: fadeUp2 .6s ease .5s both;
        }
        .v2-stat-num {
          font-family: 'DM Serif Display', serif;
          font-size: 2rem; font-weight: 400; color: #fff; display: block; line-height: 1.1;
        }
        .v2-stat-label { font-size: .72rem; color: var(--text3); font-weight: 500; letter-spacing: .04em; margin-top: 4px; display: block }

        /* ── LP SECTIONS (idêntico ao SN-main) ── */
        .lp-section { width: 100%; padding: 48px 24px; border-top: 1px solid rgba(255,255,255,.06) }
        .lp-inner { max-width: 860px; margin: 0 auto }
        .lp-label {
          font-size: .68rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase;
          color: var(--amber); margin-bottom: 18px;
          display: inline-flex; align-items: center; gap: 10px;
        }
        .lp-label::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: var(--amber); flex-shrink: 0 }
        .lp-h2 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.9rem,4.5vw,3rem); font-weight: 400;
          color: #fff; line-height: 1.1; letter-spacing: -.02em;
          margin-bottom: 20px; text-wrap: balance;
        }
        .lp-lead { font-size: clamp(.92rem,2vw,1.05rem); color: var(--text2); line-height: 1.78; max-width: 680px }

        /* ── FEATURE GRID (idêntico ao SN-main) ── */
        .lp-what-grid {
          display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
          gap: 16px; margin-top: 48px;
        }
        .lp-what-card {
          background: #0c0c1a; border: 1px solid rgba(255,255,255,.07);
          border-radius: 12px; padding: 24px 20px; transition: border-color .25s;
        }
        .lp-what-card:hover { border-color: rgba(255,191,26,.28) }
        .lp-what-icon { font-size: 1.6rem; margin-bottom: 12px; display: block }
        .lp-what-title { font-family: 'DM Serif Display', serif; font-size: 1rem; color: #fff; margin-bottom: 8px }
        .lp-what-text { font-size: .84rem; color: var(--text3); line-height: 1.6 }

        /* ── MID CTA (idêntico ao SN-main) ── */
        .lp-cta-mid {
          padding: 48px 24px; text-align: center;
          background: linear-gradient(180deg,transparent,rgba(255,191,26,.05),transparent);
          border-top: 1px solid rgba(255,255,255,.05);
          border-bottom: 1px solid rgba(255,255,255,.05);
        }
        .lp-cta-mid p { font-size: .82rem; color: var(--text3); margin-top: 14px }

        /* ── VIDEO GRID / DEPOIMENTOS (idêntico ao SN-main) ── */
        .lp-video-grid {
          display: grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr));
          gap: 20px; margin-top: 40px;
        }
        .lp-video-wrap {
          position: relative; border-radius: 12px; overflow: hidden;
          background: #0c0c1a; border: 1px solid rgba(255,255,255,.07);
          aspect-ratio: 16/9;
        }
        .lp-video-placeholder {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 10px;
          color: var(--text3); font-size: .82rem; text-align: center; padding: 20px;
          font-family: 'DM Sans', sans-serif;
        }
        .lp-video-placeholder svg { opacity: .35 }
        .lp-test-stars { color: var(--amber); font-size: .75rem; letter-spacing: 2px; margin-bottom: 8px }
        .lp-test-text { font-size: .88rem; color: var(--text2); line-height: 1.6; font-style: italic; margin-bottom: 10px }
        .lp-test-name { font-size: .7rem; font-weight: 700; color: var(--text3); letter-spacing: .06em; text-transform: uppercase }

        /* ── FOUNDER (idêntico ao SN-main) ── */
        .lp-founder-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 48px; align-items: center; margin-top: 40px;
        }
        .lp-founder-video {
          position: relative; border-radius: 16px; overflow: hidden;
          background: #0c0c1a; border: 1px solid rgba(255,255,255,.07);
          aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center;
        }
        .lp-founder-name {
          font-family: 'DM Serif Display', serif; font-size: 2rem;
          color: #fff; margin-bottom: 4px; line-height: 1;
        }
        .lp-founder-role {
          font-size: .68rem; font-weight: 700; letter-spacing: .16em; text-transform: uppercase;
          color: var(--amber); margin-bottom: 24px;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .lp-founder-role::before { content: ''; width: 4px; height: 4px; border-radius: 50%; background: var(--amber) }
        .lp-founder-text { font-size: .95rem; color: var(--text2); line-height: 1.8; margin-bottom: 16px }

        /* ── FORM SECTION (adaptado do SN-main v2Form) ── */
        .lp-form-section { border-top: 1px solid rgba(255,255,255,.06) }
        .v2-form-inner { max-width: 480px; margin: 0 auto; padding: 80px 24px 80px }
        .v2-form-eyebrow {
          font-size: .7rem; font-weight: 700; letter-spacing: .12em;
          text-transform: uppercase; color: var(--amber); margin-bottom: 12px; display: block;
        }
        .v2-form-h2 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.8rem,5vw,2.8rem); font-weight: 400;
          color: #fff; line-height: 1.1; letter-spacing: -.02em; margin-bottom: 10px;
        }
        .v2-form-sub { font-size: .95rem; color: var(--text2); line-height: 1.6; margin-bottom: 40px }
        .v2-form-card {
          background: var(--s1); border: 1px solid var(--border);
          border-radius: var(--r); padding: 32px;
        }
        .v2-field { margin-bottom: 20px }
        .v2-field-label {
          display: block; font-size: .72rem; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          color: var(--text3); margin-bottom: 8px;
        }
        .v2-field-input {
          width: 100%; padding: 15px 18px;
          background: var(--s2); border: 1.5px solid var(--border) !important;
          border-radius: var(--r-sm);
          color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 1rem; font-weight: 500; outline: none !important;
          transition: all .25s; box-shadow: none !important;
        }
        .v2-field-input:focus {
          border-color: var(--amber) !important;
          background: rgba(255,191,26,.04);
          box-shadow: 0 0 0 3px rgba(255,191,26,.12) !important;
          outline: none !important;
        }
        .v2-field-input::placeholder { color: var(--text3) }
        .v2-submit-btn {
          width: 100%; padding: 17px; margin-top: 8px;
          background: var(--amber); color: #000; border: none !important;
          border-radius: var(--r-sm); font-family: 'DM Sans', sans-serif;
          font-size: 1rem; font-weight: 800; cursor: pointer; transition: all .25s;
          letter-spacing: .01em;
        }
        .v2-submit-btn:hover { background: var(--amber2); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(255,191,26,.35) }
        .v2-submit-btn:disabled { opacity: .7; cursor: wait }
        .v2-err { color: #f09090; font-size: .82rem; font-weight: 600; min-height: 1.2em; margin-top: 8px; margin-bottom: 4px }
        .v2-form-footer { font-size: .75rem; color: var(--text3); font-weight: 500; margin-top: 24px; text-align: center }

        /* ── FOOTER (idêntico ao SN-main) ── */
        .lp-footer {
          background: #03030b; border-top: 1px solid rgba(255,255,255,.07);
          padding: 48px 24px 28px;
        }
        .lp-footer-inner {
          max-width: 860px; margin: 0 auto;
          display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 40px;
        }
        .lp-footer-badge {
          width: 44px; height: 44px; border-radius: 50%;
          border: 1px solid rgba(255,191,26,.25);
          display: flex; align-items: center; justify-content: center;
          font-size: .55rem; font-weight: 900; color: var(--amber);
          margin-bottom: 14px; letter-spacing: .04em;
        }
        .lp-footer-brand-name {
          font-family: 'DM Serif Display', serif; font-size: 1.1rem; color: #fff; margin-bottom: 6px;
        }
        .lp-footer-brand-sub { font-size: .8rem; color: var(--text3); line-height: 1.6 }
        .lp-footer-col-title {
          font-size: .65rem; font-weight: 700; letter-spacing: .16em;
          text-transform: uppercase; color: var(--amber); margin-bottom: 14px;
        }
        .lp-footer-link {
          display: block; font-size: .85rem; color: var(--text3);
          text-decoration: none; margin-bottom: 10px; transition: color .2s; cursor: pointer;
        }
        .lp-footer-link:hover { color: var(--amber) }
        .lp-footer-bottom {
          max-width: 860px; margin: 32px auto 0;
          padding-top: 20px; border-top: 1px solid rgba(255,255,255,.05);
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 10px;
        }
        .lp-footer-copy { font-size: .72rem; color: var(--text3) }

        /* ── RESPONSIVO (idêntico ao SN-main) ── */
        @media(max-width:768px) {
          .v2-nav { padding: 0 20px }
          .v2-hero-body { padding: 56px 20px 60px }
          .v2-hero-stats { gap: 24px; margin-top: 48px }
          .lp-founder-grid { grid-template-columns: 1fr }
          .lp-footer-inner { grid-template-columns: 1fr; gap: 32px }
          .v2-nav-logo-name { display: none }
        }
        @media(max-width:480px) {
          .lp-what-grid { grid-template-columns: 1fr }
          .v2-hero-h1 { font-size: 2.4rem }
          .v2-hero-stats { gap: 16px }
          .lp-video-grid { grid-template-columns: 1fr }
        }
      `}</style>

      <div id="lp-root">

        {/* ══ NAVBAR ══ */}
        <nav className="v2-nav">
          <a className="v2-nav-logo" href="#">
            <div className="v2-nav-logo-badge">IDM</div>
            <span className="v2-nav-logo-name">Instituto Despertamente</span>
          </a>
          <a href="#form-section" className="v2-nav-cta">Garantir Minha Vaga →</a>
        </nav>

        {/* ══ TICKER ══ */}
        <div className="v2-ticker-wrap" aria-hidden="true">
          <div className="v2-ticker">
            <div className="v2-ticker-inner">
              {[
                '✦ Aula 100% gratuita',
                '✦ Vagas limitadas por turma',
                '✦ Instituto Despertamente',
                '✦ Conteúdo exclusivo e aprofundado',
                '✦ Turmas a cada 30 minutos',
                '✦ Aula 100% gratuita',
                '✦ Vagas limitadas por turma',
                '✦ Instituto Despertamente',
                '✦ Conteúdo exclusivo e aprofundado',
                '✦ Turmas a cada 30 minutos',
              ].map((item, i) => (
                <span key={i}>
                  <span className="v2-ticker-dot" /> {item.replace('✦ ', '')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ══ HERO ══ */}
        <div className="v2-hero-body">
          <div className="v2-eyebrow">
            <span className="v2-eyebrow-dot" />
            Instituto Despertamente · Aula Gratuita
            <span className="v2-eyebrow-dot" />
          </div>
          <h1 className="v2-hero-h1">
            {webinar.title.split(',')[0]},<br />
            <span className="v2-hero-accent">
              {webinar.title.includes(',')
                ? webinar.title.split(',').slice(1).join(',').trim()
                : 'ao vivo e de graça'}
            </span>
          </h1>
          <p className="v2-hero-sub">
            {webinar.description || 'Uma aula gratuita e exclusiva com conteúdo que vai além do convencional. Sem enrolação.'}
          </p>
          <div className="v2-hero-cta-wrap">
            <a href="#form-section" className="v2-hero-cta">
              Garantir Minha Vaga Agora
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <p className="v2-cta-sub">Gratuito · Vagas limitadas · Turmas a cada 30 minutos</p>
          </div>

          <div className="v2-hero-stats">
            <div><span className="v2-stat-num">4.800+</span><span className="v2-stat-label">alunos formados</span></div>
            <div><span className="v2-stat-num">97%</span><span className="v2-stat-label">satisfação</span></div>
            <div><span className="v2-stat-num">8 anos</span><span className="v2-stat-label">de pesquisa</span></div>
            <div><span className="v2-stat-num">100%</span><span className="v2-stat-label">gratuita</span></div>
          </div>
        </div>

        {/* ══ O QUE VOCÊ VAI APRENDER ══ */}
        <section className="lp-section">
          <div className="lp-inner">
            <div className="lp-label">O Conteúdo</div>
            <h2 className="lp-h2">O que você vai<br />aprender nessa aula</h2>
            <p className="lp-lead">
              Uma aula densa, aprofundada e transformadora. Conteúdo que o Instituto Despertamente
              desenvolveu ao longo de anos de pesquisa e prática clínica.
            </p>
            <div className="lp-what-grid">
              {features.map((f, i) => (
                <div key={i} className="lp-what-card">
                  <span className="lp-what-icon">{f.icon}</span>
                  <div className="lp-what-title">{f.title}</div>
                  <p className="lp-what-text">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ MID CTA ══ */}
        <section className="lp-cta-mid">
          <a href="#form-section" className="v2-hero-cta">
            Quero minha vaga gratuita agora
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <p>Gratuito · Conteúdo exclusivo · Turmas a cada 30 minutos</p>
        </section>

        {/* ══ DEPOIMENTOS (mesma estrutura do SN-main — video placeholders) ══ */}
        <section className="lp-section">
          <div className="lp-inner">
            <div className="lp-label">Depoimentos</div>
            <h2 className="lp-h2">O que dizem os<br />alunos do IDM</h2>
            <p className="lp-lead">Experiências reais de pessoas que encontraram clareza, propósito e transformação através do conteúdo do Instituto Despertamente.</p>
            <div className="lp-video-grid">
              {[
                { stars: '★★★★★', text: '"Depois da aula, comecei a enxergar padrões que se repetiam há anos na minha vida. Foi uma virada completa."', name: 'Camila R. — São Paulo, SP' },
                { stars: '★★★★★', text: '"Nunca imaginei que entender a psicanálise pudesse ser tão acessível. O conteúdo é profundo e ao mesmo tempo prático."', name: 'Marcos T. — Rio de Janeiro, RJ' },
                { stars: '★★★★★', text: '"A aula mudou a forma como eu me relaciono comigo mesmo e com as pessoas ao redor. Recomendo para todos."', name: 'Fernanda L. — Curitiba, PR' },
              ].map((t, i) => (
                <div key={i} className="lp-video-wrap">
                  <div className="lp-video-placeholder">
                    <div className="lp-test-stars">{t.stars}</div>
                    <p className="lp-test-text">{t.text}</p>
                    <div className="lp-test-name">{t.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ APRESENTADOR (idêntico ao SN-main founder section) ══ */}
        {webinar.presenter_name && (
          <section className="lp-section">
            <div className="lp-inner">
              <div className="lp-label">O Idealizador</div>
              <div className="lp-founder-grid">
                <div>
                  <h2 className="lp-founder-name">{webinar.presenter_name}</h2>
                  <div className="lp-founder-role">Fundador do Instituto Despertamente</div>
                  <p className="lp-founder-text">
                    Psicanalista, pesquisador e educador, {webinar.presenter_name} fundou o Instituto Despertamente
                    com uma missão clara: tornar o autoconhecimento profundo acessível a todos.
                  </p>
                  <p className="lp-founder-text">
                    Seu método integra psicanálise, neurociência e inteligência sistêmica em uma abordagem única —
                    que não apenas explica quem você é, mas mostra o caminho para quem você pode se tornar.
                  </p>
                  <a href="#form-section" className="v2-hero-cta" style={{ fontSize: '.9rem', padding: '14px 28px', marginTop: '8px', display: 'inline-flex' }}>
                    Participar da aula gratuita →
                  </a>
                </div>
                <div className="lp-founder-video">
                  {webinar.presenter_photo_url
                    ? <img src={webinar.presenter_photo_url} alt={webinar.presenter_name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    : <div className="lp-video-placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.4"/><path d="M10 8l6 4-6 4V8z" fill="currentColor"/></svg>
                        Foto / vídeo do apresentador
                      </div>
                  }
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ══ FORMULÁRIO (adaptado do v2Form do SN-main) ══ */}
        <section className="lp-form-section" id="form-section">
          <div className="v2-form-inner">
            <span className="v2-form-eyebrow">Sua inscrição gratuita</span>
            <h2 className="v2-form-h2">Garanta sua vaga agora</h2>
            <p className="v2-form-sub">
              Preencha abaixo para entrar na próxima turma disponível.
              Vagas limitadas — turmas a cada 30 minutos.
            </p>
            <div className="v2-form-card">
              <RegistrationFormLP webinarId={webinar.id} webinarSlug={webinar.slug} />
            </div>
          </div>
        </section>

        {/* ══ FOOTER (idêntico ao SN-main) ══ */}
        <footer className="lp-footer">
          <div className="lp-footer-inner">
            <div>
              <div className="lp-footer-badge">IDM</div>
              <div className="lp-footer-brand-name">Instituto Despertamente</div>
              <p className="lp-footer-brand-sub">Psicanálise Integrativa<br />e Numerologia Sistêmica</p>
            </div>
            <div>
              <div className="lp-footer-col-title">Acesso rápido</div>
              <a href="#form-section" className="lp-footer-link">Garantir minha vaga</a>
              <a href="#" className="lp-footer-link">O método</a>
              <a href="#" className="lp-footer-link">Depoimentos</a>
            </div>
            <div>
              <div className="lp-footer-col-title">Legal</div>
              <a href="#" className="lp-footer-link">Política de privacidade</a>
              <a href="#" className="lp-footer-link">Termos de uso</a>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <span className="lp-footer-copy">© {new Date().getFullYear()} Instituto Despertamente · Todos os direitos reservados</span>
            <span className="lp-footer-copy">Este site não é afiliado ao Meta Platforms.</span>
          </div>
        </footer>

      </div>
    </>
  )
}
