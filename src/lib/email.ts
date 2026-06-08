import { Resend } from 'resend'

function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

interface SendFollowUpParams {
  to: string
  name: string
  webinarTitle: string
  offerUrl: string
  wppGroupUrl?: string
}

interface SendNoShowParams {
  to: string
  name: string
  webinarTitle: string
  captureUrl: string
}

export async function sendFollowUpEmail({ to, name, webinarTitle, offerUrl, wppGroupUrl }: SendFollowUpParams) {
  const resend = getResend()
  if (!resend) return false
  try {
    await resend.emails.send({
      from: 'IDM <noreply@institutodesspertamente.com.br>',
      to,
      subject: `${name}, você assistiu à aula — e temos algo especial para você 🎯`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
        <body style="margin:0;padding:0;background:#070a14;font-family:Inter,sans-serif;color:#edf2ff;">
          <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
            <div style="text-align:center;margin-bottom:32px;">
              <p style="color:#ffbf1a;font-size:14px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 8px;">Instituto Despertamente</p>
              <h1 style="font-size:28px;line-height:1.3;margin:0;color:#fff;">
                ${name}, você esteve na aula.<br>Agora é hora de ir além.
              </h1>
            </div>
            <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:28px;margin-bottom:24px;">
              <p style="color:#9aa4bf;margin:0 0 12px;font-size:15px;">Você participou da nossa aula gratuita:</p>
              <p style="color:#ffbf1a;font-size:18px;font-weight:700;margin:0 0 20px;">${webinarTitle}</p>
              <p style="color:#d4dbf1;font-size:15px;line-height:1.7;margin:0 0 20px;">
                Durante a aula, apresentamos uma oportunidade de ir ainda mais fundo nesse conteúdo. Essa oferta está disponível por tempo limitado para quem participou da aula ao vivo.
              </p>
              <a href="${offerUrl}" style="display:block;text-align:center;background:linear-gradient(90deg,#ffbf1a,#ffe066);color:#070a14;font-weight:900;font-size:16px;padding:16px 32px;border-radius:12px;text-decoration:none;">
                GARANTIR MINHA VAGA AGORA →
              </a>
            </div>
            ${wppGroupUrl ? `
            <div style="text-align:center;padding:20px;background:rgba(0,184,55,0.08);border:1px solid rgba(0,184,55,0.2);border-radius:12px;margin-bottom:24px;">
              <p style="margin:0 0 12px;color:#d4dbf1;">📲 Entre no nosso grupo VIP exclusivo:</p>
              <a href="${wppGroupUrl}" style="color:#00b837;font-weight:700;">Entrar no Grupo VIP do WhatsApp</a>
            </div>` : ''}
            <p style="color:#666;font-size:12px;text-align:center;margin:0;">
              © ${new Date().getFullYear()} Instituto Despertamente. Todos os direitos reservados.
            </p>
          </div>
        </body>
        </html>
      `,
    })
    return true
  } catch {
    return false
  }
}

export async function sendNoShowEmail({ to, name, webinarTitle, captureUrl }: SendNoShowParams) {
  const resend = getResend()
  if (!resend) return false
  try {
    await resend.emails.send({
      from: 'IDM <noreply@institutodesspertamente.com.br>',
      to,
      subject: `${name}, perdeu a aula? Tem nova turma disponível agora 👀`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#070a14;font-family:Inter,sans-serif;color:#edf2ff;">
          <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
            <p style="color:#ffbf1a;font-size:14px;text-transform:uppercase;letter-spacing:0.1em;">Instituto Despertamente</p>
            <h1 style="font-size:26px;margin:0 0 20px;">Ei, ${name}! Vimos que você não conseguiu participar 😢</h1>
            <p style="color:#d4dbf1;line-height:1.7;">
              Você se inscreveu na nossa aula gratuita sobre <strong style="color:#ffbf1a;">${webinarTitle}</strong>, mas não conseguiu acessar.
            </p>
            <p style="color:#d4dbf1;line-height:1.7;">Temos novas turmas disponíveis a cada 30 minutos. Clique abaixo para entrar na próxima:</p>
            <a href="${captureUrl}" style="display:block;text-align:center;background:linear-gradient(90deg,#ffbf1a,#ffe066);color:#070a14;font-weight:900;font-size:16px;padding:16px 32px;border-radius:12px;text-decoration:none;margin:24px 0;">
              VER PRÓXIMA TURMA DISPONÍVEL →
            </a>
            <p style="color:#666;font-size:12px;text-align:center;">© ${new Date().getFullYear()} Instituto Despertamente.</p>
          </div>
        </body>
        </html>
      `,
    })
    return true
  } catch {
    return false
  }
}
