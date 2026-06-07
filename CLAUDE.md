# IDM Webinarios — Contexto Completo

## O que e este sistema
Plataforma propria de webinarios evergreen para o Instituto Despertamente (IDM), vendendo Psicanalise e Numerologia. Substitui o Hotwebinar (R$397-997/mes).

## Stack
- Next.js 15 App Router (TypeScript) no Vercel
- Supabase (PostgreSQL + Realtime para chat e viewer count)
- Tailwind CSS v4 + shadcn/ui (dark navy + gold)
- Video: Bunny.net Stream (iframe signed) ou YouTube (fallback)
- Email: Resend
- WhatsApp: Evolution API (multi-instancia, round-robin)
- Pagamentos: webhooks Mercado Pago, Vega, Hotmart, Kiwify
- IA: Claude API para otimizacao autonoma semanal

## Design System (herdado de obrigado-31 e SN-main)
- Background: oklch(0.097 0.028 256) — azul-marinho escuro #070a14
- Primary: oklch(0.816 0.183 79) — dourado #ffbf1a
- Success: oklch(0.62 0.18 145) — verde WhatsApp
- Fonte: Inter (Google Fonts)

## Regras de negocio criticas

### Sessoes (grid 30 em 30 min)
- Grade: minutos :00 e :30 de cada hora
- HORARIO: 06:00 - 23:00 BRT (America/Sao_Paulo). FORA desse horario -> prox dia 06:00
- Vercel Cron "0 6 * * *" cria sessoes do dia

### Leads repetidos
- Assistiu >=50% OU stage cta_seen/offer_clicked -> NAO entra de novo -> bot WPP venda direta
- Cadastrou mas nao assistiu (<25%) -> PODE entrar -> mensagem de retorno personalizada

### Funil watch_stage (so avanca, nunca volta)
registered -> entered -> watched_25 -> watched_50 -> watched_75 -> completed -> cta_seen -> offer_clicked

### Tracking de comportamento (API routes)
- POST /api/track/enter       -> lead entrou na sala
- POST /api/track/heartbeat   -> heartbeat 60s com current_second e total_seconds
- POST /api/track/cta         -> overlay de oferta apareceu
- POST /api/track/offer       -> lead clicou em botao de pagamento

## Variaveis de ambiente necessarias
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
EVOLUTION_API_URL=
EVOLUTION_API_KEY=
META_ACCESS_TOKEN=
META_AD_ACCOUNT_ID=
META_PIXEL_ID=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_APP_URL=https://seudominio.com.br
CRON_SECRET=gere-uma-senha-aleatoria-aqui
TZ=America/Sao_Paulo

## Admin padrao (criar usuario no Supabase Auth)
Email: pdrmurario@gmail.com
Senha: idm2026

## Fluxo completo de um lead
1. Acessa /psicanalise (ou /numerologia)
2. Preenche form -> POST /api/register -> recebe sessionId + registrationId
3. sessionStorage salva: reg_id, reg_name, session_id
4. Redirect /obrigado/[slug]?sessionId=... com countdown
5. Botao liberado 2min antes da sessao
6. Entra /sala/[sessionId] -> POST /api/track/enter
7. Video comeca no segundo elapsed = now - session.start_time (sem controles de pause/seek)
8. Heartbeat 60s -> POST /api/track/heartbeat (atualiza watch_stage)
9. No segundo offer_appears_at_seconds -> overlay CTA -> POST /api/track/cta
10. Clica botao -> POST /api/track/offer -> URL externa (Vega / MP / WPP)
11. Video termina -> redirect /oferta/[slug]
12. Cron (sessao ended) -> email via Resend + WhatsApp via Evolution API

## Como criar novo webinario (sem mexer em codigo)
Admin /admin/webinars/new -> wizard 5 passos -> slug disponivel automaticamente em /[slug]

## Integracao futura onze-digital
Validar JWT do onze-digital em src/middleware.ts ou trocar o auth provider do Supabase Auth

## Webinarios iniciais (seed em 002_seed.sql)
- /psicanalise -> Conheca a Integratividade Aplicada a Psicanalise
- /numerologia -> Assinatura do Poder - Numerologia Revelada

## Arquivos chave
src/app/[slug]/page.tsx               -> pagina de captura
src/app/obrigado/[slug]/              -> obrigado + countdown
src/app/sala/[sessionId]/             -> sala ao vivo (video + chat + CTA)
src/app/oferta/[slug]/page.tsx        -> pagina de oferta/checkout
src/app/admin/                        -> painel admin (protegido por auth)
src/app/api/register/route.ts         -> cadastro lead + UTM + device
src/app/api/track/                    -> tracking comportamental
src/app/api/webhooks/cron/route.ts    -> cron: sessoes + follow-ups por estagio
src/app/api/webhooks/                 -> webhooks de pagamento (MP, Vega, etc)
src/lib/sessions.ts                   -> engine de grade horaria BRT
src/lib/whatsapp.ts                   -> Evolution API + distribuicao round-robin
src/lib/email.ts                      -> templates Resend
supabase/migrations/001_initial_schema.sql -> schema completo
supabase/migrations/002_seed.sql      -> seed webinarios + comentarios roteirizados

## IMPORTANTE
Criado em 07/06/2026. Sempre execute as migrations do Supabase antes de qualquer mudanca no banco.
Teste o fluxo completo: cadastro -> sala -> tracking -> follow-up antes de ir a producao.
