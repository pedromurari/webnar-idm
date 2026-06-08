import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RegistrationForm } from '@/components/webinar/RegistrationForm'
import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'

const dmSans = DM_Sans({ subsets: ['latin'], display: 'swap' })
const dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: ['400'], display: 'swap' })

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('webinars').select('title, description').eq('slug', slug).single()
  if (!data) return { title: 'IDM Webinários' }
  return { title: `${data.title} | IDM`, description: data.description || undefined }
}

const features = [
  { icon: '🧠', title: 'Fundamentos da Psicanálise', text: 'Entenda como a mente funciona e quais mecanismos moldam seus pensamentos, emoções e comportamentos.' },
  { icon: '🔄', title: 'Padrões Inconscientes', text: 'Identifique os padrões ocultos que sabotam seus relacionamentos, sua carreira e sua vida.' },
  { icon: '💬', title: 'Comunicação Profunda', text: 'Aprenda a se comunicar com mais autenticidade e a criar conexões genuínas e duradouras.' },
  { icon: '🎯', title: 'Propósito e Clareza', text: 'Descubra o que realmente move você e como alinhar suas escolhas ao seu propósito mais profundo.' },
  { icon: '❤️', title: 'Vínculos e Relações', text: 'Entenda como seus vínculos afetivos da infância ainda influenciam seus relacionamentos hoje.' },
  { icon: '🔑', title: 'Ferramentas de Transformação', text: 'Métodos práticos e aplicáveis para promover mudanças reais e duradouras na sua vida.' },
]

const testimonials = [
  { stars: '★★★★★', text: '"Depois da aula, comecei a enxergar padrões que se repetiam há anos na minha vida. Foi uma virada completa de perspectiva."', name: 'CAMILA R.', city: 'São Paulo, SP' },
  { stars: '★★★★★', text: '"Nunca imaginei que entender a psicanálise pudesse ser tão acessível. O conteúdo é profundo e ao mesmo tempo prático."', name: 'MARCOS T.', city: 'Rio de Janeiro, RJ' },
  { stars: '★★★★★', text: '"A aula do Instituto Despertamente mudou a forma como eu me relaciono comigo mesmo e com as pessoas ao redor."', name: 'FERNANDA L.', city: 'Curitiba, PR' },
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
      <style>{`
        :root {
          --bg: #07070e;
          --s1: #0c0c1a;
          --s2: #121224;
          --border: rgba(255,255,255,.07);
          --border2: rgba(255,255,255,.12);
          --gold: #ffbf1a;
          --goldBg: rgba(255,191,26,.06);
          --goldLine: rgba(255,191,26,.18);
          --text: #f4ecd8;
          --text2: #a1a1a6;
          --text3: #6e6e73;
          --r: 12px;
        }
        * { box-sizing: border-box; margin: 0; padding: 0 }
        html { scroll-behavior: smooth }
        body {
          background: var(--bg) !important;
          color: var(--text) !important;
          font-family: ${dmSans.style.fontFamily}, system-ui, sans-serif !important;
          font-size: 16px; line-height: 1.6;
          min-height: 100vh; overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }
        .idm-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 0 32px; height: 56px;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(7,7,14,.88);
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
          border-bottom: 1px solid var(--border);
        }
        .idm-nav-logo {
          display: inline-flex; align-items: center; gap: 10px;
          text-decoration: none;
        }
        .idm-nav-badge {
          width: 36px; height: 36px; border-radius: 50%;
          border: 1px solid var(--goldLine);
          display: flex; align-items: center; justify-content: center;
          font-size: .6rem; font-weight: 900; color: var(--gold);
          letter-spacing: .04em;
        }
        .idm-nav-name { font-size: .82rem; font-weight: 700; color: var(--text); letter-spacing: .02em }
        .idm-nav-cta {
          font-size: .78rem; font-weight: 600; color: var(--gold);
          letter-spacing: .05em; cursor: pointer; padding: 6px 16px;
          border: 1px solid var(--goldLine); border-radius: 20px;
          transition: all .25s; background: var(--goldBg);
          text-decoration: none; display: inline-block;
        }
        .idm-nav-cta:hover { background: rgba(255,191,26,.15); border-color: rgba(255,191,26,.4) }

        .idm-ticker {
          background: rgba(255,191,26,.04);
          border-bottom: 1px solid rgba(255,191,26,.08);
          overflow: hidden; height: 36px;
          display: flex; align-items: center;
          margin-top: 56px;
        }
        .idm-ticker-inner {
          display: flex; gap: 0; white-space: nowrap;
          animation: ticker 28s linear infinite;
        }
        .idm-ticker-item {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 0 36px; font-size: .72rem; font-weight: 500;
          color: var(--text2); letter-spacing: .04em;
        }
        .idm-ticker-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--gold); flex-shrink: 0 }
        @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }

        .idm-hero {
          max-width: 840px; margin: 0 auto;
          padding: 72px 24px 80px; text-align: center;
        }
        .idm-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: .72rem; font-weight: 700; letter-spacing: .12em;
          text-transform: uppercase; color: var(--gold); margin-bottom: 28px;
        }
        .idm-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold) }
        .idm-h1 {
          font-family: ${dmSerif.style.fontFamily}, Georgia, serif;
          font-size: clamp(2.4rem, 7vw, 4.8rem); font-weight: 400;
          color: #fff; line-height: 1.08; letter-spacing: -.02em; margin-bottom: 20px;
          text-wrap: balance; max-width: 720px; margin-left: auto; margin-right: auto;
        }
        .idm-h1-accent { color: var(--gold) }
        .idm-hero-sub {
          font-size: clamp(1rem, 2.5vw, 1.15rem); color: var(--text2);
          line-height: 1.7; max-width: 540px; margin: 0 auto 40px; font-weight: 400;
        }
        .idm-cta-wrap { margin-bottom: 0 }
        .idm-cta {
          display: inline-flex; align-items: center; gap: 10px;
          background: #fff; color: #000;
          font-family: ${dmSans.style.fontFamily}, system-ui, sans-serif;
          font-size: 1rem; font-weight: 800; letter-spacing: .01em;
          padding: 17px 36px; border-radius: 50px; border: none; cursor: pointer;
          transition: all .25s; text-decoration: none;
        }
        .idm-cta:hover { background: #f5f5f5; transform: scale(1.03); box-shadow: 0 8px 32px rgba(255,255,255,.14) }
        .idm-cta-arrow { transition: transform .25s }
        .idm-cta:hover .idm-cta-arrow { transform: translateX(4px) }
        .idm-cta-sub { font-size: .72rem; color: var(--text3); margin-top: 14px; font-weight: 500 }

        .idm-hero-stats {
          display: flex; justify-content: center; gap: 40px; flex-wrap: wrap;
          margin-top: 72px; padding-top: 40px; border-top: 1px solid var(--border);
        }
        .idm-stat .val {
          font-family: ${dmSerif.style.fontFamily}, Georgia, serif;
          font-size: 2rem; font-weight: 400; color: #fff; display: block;
        }
        .idm-stat .lbl { font-size: .72rem; color: var(--text3); font-weight: 500; letter-spacing: .04em }

        .lp-section { width: 100%; padding: 56px 24px; border-top: 1px solid rgba(255,255,255,.06) }
        .lp-inner { max-width: 860px; margin: 0 auto }
        .lp-label {
          font-size: .68rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 18px;
          display: inline-flex; align-items: center; gap: 10px;
        }
        .lp-label::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: var(--gold); flex-shrink: 0 }
        .lp-h2 {
          font-family: ${dmSerif.style.fontFamily}, Georgia, serif;
          font-size: clamp(1.9rem, 4.5vw, 3rem); font-weight: 400;
          color: #fff; line-height: 1.1; letter-spacing: -.02em; margin-bottom: 20px; text-wrap: balance;
        }
        .lp-lead { font-size: clamp(.92rem, 2vw, 1.05rem); color: var(--text2); line-height: 1.78; max-width: 680px }

        .lp-what-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px; margin-top: 48px;
        }
        .lp-what-card {
          background: var(--s1); border: 1px solid var(--border);
          border-radius: var(--r); padding: 24px 20px; transition: border-color .25s;
        }
        .lp-what-card:hover { border-color: rgba(255,191,26,.28) }
        .lp-what-icon { font-size: 1.6rem; margin-bottom: 12px; display: block }
        .lp-what-title {
          font-family: ${dmSerif.style.fontFamily}, Georgia, serif;
          font-size: 1rem; color: #fff; margin-bottom: 8px;
        }
        .lp-what-text { font-size: .84rem; color: var(--text3); line-height: 1.6 }

        .lp-cta-mid {
          padding: 56px 24px; text-align: center;
          background: linear-gradient(180deg, transparent, rgba(255,191,26,.04), transparent);
          border-top: 1px solid rgba(255,255,255,.05);
          border-bottom: 1px solid rgba(255,255,255,.05);
        }
        .lp-cta-mid p { font-size: .82rem; color: var(--text3); margin-top: 14px }

        .lp-test-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px; margin-top: 40px;
        }
        .lp-test-card {
          background: var(--s1); border: 1px solid var(--border);
          border-radius: var(--r); padding: 24px;
        }
        .lp-test-stars { color: var(--gold); font-size: .75rem; margin-bottom: 10px; letter-spacing: 2px }
        .lp-test-text { font-size: .88rem; color: var(--text2); line-height: 1.65; margin-bottom: 14px; font-style: italic }
        .lp-test-name { font-size: .72rem; font-weight: 700; color: var(--text3); letter-spacing: .06em; text-transform: uppercase }
        .lp-test-city { font-size: .65rem; color: var(--text3); letter-spacing: .04em; margin-top: 2px }

        .lp-founder-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 48px; align-items: center; margin-top: 40px;
        }
        .lp-founder-photo {
          border-radius: 16px; overflow: hidden;
          background: var(--s1); border: 1px solid var(--border);
          aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center;
          color: var(--text3); font-size: .82rem; text-align: center; padding: 20px;
        }
        .lp-founder-photo img { width: 100%; height: 100%; object-fit: cover; display: block }
        .lp-founder-name {
          font-family: ${dmSerif.style.fontFamily}, Georgia, serif;
          font-size: 2rem; color: #fff; margin-bottom: 4px; line-height: 1;
        }
        .lp-founder-role {
          font-size: .68rem; font-weight: 700; letter-spacing: .16em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 24px;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .lp-founder-role::before { content: ''; width: 4px; height: 4px; border-radius: 50%; background: var(--gold) }
        .lp-founder-text { font-size: .95rem; color: var(--text2); line-height: 1.8; margin-bottom: 16px }

        .lp-form-section { padding: 64px 24px 80px; border-top: 1px solid rgba(255,255,255,.06) }
        .lp-form-inner { max-width: 520px; margin: 0 auto }
        .lp-form-label { font-size: .68rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); margin-bottom: 12px; display: block }
        .lp-form-h2 {
          font-family: ${dmSerif.style.fontFamily}, Georgia, serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 400;
          color: #fff; line-height: 1.1; letter-spacing: -.02em; margin-bottom: 10px;
        }
        .lp-form-sub { font-size: .95rem; color: var(--text2); line-height: 1.65; margin-bottom: 36px }
        .lp-form-card {
          background: linear-gradient(160deg, rgba(16,16,30,.98), rgba(10,10,22,1));
          border: 1px solid rgba(255,191,26,.12);
          border-top: 1px solid rgba(255,191,26,.22);
          border-radius: 14px; padding: 36px 32px;
          position: relative; overflow: hidden;
          box-shadow: 0 60px 120px rgba(0,0,0,.8);
        }
        .lp-form-card::before {
          content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 50%; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,191,26,.6), transparent);
        }
        .lp-form-footer { margin-top: 20px; font-size: .78rem; color: var(--text3); text-align: center; display: flex; align-items: center; justify-content: center; gap: 6px }

        .lp-footer {
          background: #03030b; border-top: 1px solid rgba(255,255,255,.07);
          padding: 52px 24px 28px;
        }
        .lp-footer-inner {
          max-width: 860px; margin: 0 auto;
          display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 40px;
        }
        .lp-footer-badge {
          width: 44px; height: 44px; border-radius: 50%;
          border: 1px solid rgba(255,191,26,.25);
          display: flex; align-items: center; justify-content: center;
          font-size: .6rem; font-weight: 900; color: var(--gold);
          margin-bottom: 14px;
        }
        .lp-footer-brand-name {
          font-family: ${dmSerif.style.fontFamily}, Georgia, serif;
          font-size: 1.1rem; color: #fff; margin-bottom: 6px;
        }
        .lp-footer-brand-sub { font-size: .8rem; color: var(--text3); line-height: 1.6 }
        .lp-footer-col-title { font-size: .65rem; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--gold); margin-bottom: 14px }
        .lp-footer-link { display: block; font-size: .85rem; color: var(--text3); text-decoration: none; margin-bottom: 10px; transition: color .2s }
        .lp-footer-link:hover { color: var(--gold) }
        .lp-footer-bottom {
          max-width: 860px; margin: 32px auto 0;
          padding-top: 20px; border-top: 1px solid rgba(255,255,255,.05);
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
        }
        .lp-footer-copy { font-size: .72rem; color: var(--text3) }

        @media (max-width: 768px) {
          .idm-nav { padding: 0 20px }
          .idm-hero { padding: 56px 20px 60px }
          .idm-hero-stats { gap: 24px; margin-top: 48px }
          .lp-founder-grid { grid-template-columns: 1fr }
          .lp-footer-inner { grid-template-columns: 1fr; gap: 32px }
          .idm-nav-name { display: none }
          .lp-form-card { padding: 28px 22px }
        }
        @media (max-width: 480px) {
          .lp-what-grid { grid-template-columns: 1fr }
          .idm-h1 { font-size: 2.2rem }
        }
      `}</style>

      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

        {/* ── NAVBAR ── */}
        <nav className="idm-nav">
          <a className="idm-nav-logo" href="#">
            <div className="idm-nav-badge">IDM</div>
            <span className="idm-nav-name">Instituto Despertamente</span>
          </a>
          <a href="#form-section" className="idm-nav-cta">Garantir Minha Vaga →</a>
        </nav>

        {/* ── TICKER ── */}
        <div className="idm-ticker" aria-hidden="true">
          <div className="idm-ticker-inner">
            {[
              '✦ Aula 100% gratuita',
              '✦ Vagas limitadas por turma',
              '✦ Conteúdo exclusivo e aprofundado',
              '✦ Instituto Despertamente',
              '✦ Aula 100% gratuita',
              '✦ Vagas limitadas por turma',
              '✦ Conteúdo exclusivo e aprofundado',
              '✦ Instituto Despertamente',
            ].map((item, i) => (
              <span key={i} className="idm-ticker-item">
                <span className="idm-ticker-dot" /> {item.replace('✦ ', '')}
              </span>
            ))}
          </div>
        </div>

        {/* ── HERO ── */}
        <div className="idm-hero">
          <div className="idm-eyebrow">
            <span className="idm-eyebrow-dot" />
            Instituto Despertamente · Aula Gratuita
            <span className="idm-eyebrow-dot" />
          </div>
          <h1 className="idm-h1">
            {webinar.title.split(',')[0]},
            <br />
            <span className="idm-h1-accent">
              {webinar.title.includes(',') ? webinar.title.split(',').slice(1).join(',').trim() : 'ao vivo e de graça'}
            </span>
          </h1>
          <p className="idm-hero-sub">
            {webinar.description || 'Uma aula gratuita e exclusiva com conteúdo que vai além do convencional. Sem enrolação.'}
          </p>
          <div className="idm-cta-wrap">
            <a href="#form-section" className="idm-cta">
              Garantir Minha Vaga Agora
              <svg className="idm-cta-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <p className="idm-cta-sub">Gratuito · Vagas limitadas · Sem enrolação</p>
          </div>

          <div className="idm-hero-stats">
            <div className="idm-stat"><span className="val">4.800+</span><span className="lbl">alunos formados</span></div>
            <div className="idm-stat"><span className="val">97%</span><span className="lbl">satisfação</span></div>
            <div className="idm-stat"><span className="val">8 anos</span><span className="lbl">de pesquisa</span></div>
            <div className="idm-stat"><span className="val">100%</span><span className="lbl">gratuita</span></div>
          </div>
        </div>

        {/* ── O QUE VOCÊ VAI APRENDER ── */}
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

        {/* ── MID CTA ── */}
        <section className="lp-cta-mid">
          <a href="#form-section" className="idm-cta">
            Quero minha vaga gratuita agora
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <p>Gratuito · Conteúdo exclusivo · Turmas a cada 30 minutos</p>
        </section>

        {/* ── DEPOIMENTOS ── */}
        <section className="lp-section">
          <div className="lp-inner">
            <div className="lp-label">Depoimentos</div>
            <h2 className="lp-h2">O que dizem os<br />alunos do IDM</h2>
            <p className="lp-lead">Experiências reais de pessoas que encontraram clareza, propósito e transformação através do conteúdo do Instituto Despertamente.</p>
            <div className="lp-test-grid">
              {testimonials.map((t, i) => (
                <div key={i} className="lp-test-card">
                  <div className="lp-test-stars">{t.stars}</div>
                  <p className="lp-test-text">{t.text}</p>
                  <div className="lp-test-name">{t.name}</div>
                  <div className="lp-test-city">{t.city}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── APRESENTADOR ── */}
        {webinar.presenter_name && (
          <section className="lp-section">
            <div className="lp-inner">
              <div className="lp-label">O Idealizador</div>
              <div className="lp-founder-grid">
                <div>
                  <h2 className="lp-founder-name">{webinar.presenter_name}</h2>
                  <div className="lp-founder-role">Fundador do Instituto Despertamente</div>
                  <p className="lp-founder-text">
                    Psicanalista, pesquisador e educador, {webinar.presenter_name} fundou o Instituto Despertamente com uma missão clara: tornar o autoconhecimento profundo acessível a todos.
                  </p>
                  <p className="lp-founder-text">
                    Seu método integra psicanálise, neurociência e inteligência sistêmica em uma abordagem única — que não apenas explica quem você é, mas mostra o caminho para quem você pode se tornar.
                  </p>
                  <a href="#form-section" className="idm-cta" style={{ marginTop: '8px', fontSize: '.92rem', padding: '14px 28px' }}>
                    Participar da aula gratuita →
                  </a>
                </div>
                <div className="lp-founder-photo">
                  {webinar.presenter_photo_url
                    ? <img src={webinar.presenter_photo_url} alt={webinar.presenter_name} />
                    : <span style={{ color: 'var(--text3)', fontSize: '.85rem' }}>Foto do apresentador<br />em breve</span>
                  }
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── FORMULÁRIO ── */}
        <section className="lp-form-section" id="form-section">
          <div className="lp-form-inner">
            <span className="lp-form-label">Sua inscrição gratuita</span>
            <h2 className="lp-form-h2">Garanta sua vaga agora</h2>
            <p className="lp-form-sub">
              Preencha abaixo para entrar na próxima turma disponível.
              Vagas limitadas — turmas a cada 30 minutos.
            </p>
            <div className="lp-form-card">
              <RegistrationForm webinarId={webinar.id} webinarSlug={webinar.slug} />
            </div>
            <p className="lp-form-footer">🔒 Seus dados estão protegidos. Não enviamos spam.</p>
          </div>
        </section>

        {/* ── FOOTER ── */}
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
