interface SendMessageParams {
  phone: string
  message: string
  instanceName?: string
  evolutionUrl?: string
  apiKey?: string
}

interface EvolutionInstance {
  instance: { instanceName: string; status: string }
}

export async function sendWhatsAppMessage({
  phone,
  message,
  instanceName,
  evolutionUrl,
  apiKey,
}: SendMessageParams): Promise<boolean> {
  const url = evolutionUrl || process.env.EVOLUTION_API_URL
  const key = apiKey || process.env.EVOLUTION_API_KEY
  const instance = instanceName || 'default'

  if (!url || !key) return false

  const cleanPhone = phone.replace(/\D/g, '')
  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`

  try {
    const res = await fetch(`${url}/message/sendText/${instance}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: key },
      body: JSON.stringify({
        number: `${formattedPhone}@s.whatsapp.net`,
        text: message,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

/** Gets all active instances from Evolution API, sorted by least recently used (round-robin) */
export async function getActiveInstances(evolutionUrl?: string, apiKey?: string) {
  const url = evolutionUrl || process.env.EVOLUTION_API_URL
  const key = apiKey || process.env.EVOLUTION_API_KEY

  if (!url || !key) return []

  try {
    const res = await fetch(`${url}/instance/fetchInstances`, {
      headers: { apikey: key },
    })
    if (!res.ok) return []
    const data: EvolutionInstance[] = await res.json()
    return data.filter((i) => i.instance.status === 'open').map((i) => i.instance.instanceName)
  } catch {
    return []
  }
}

/** Sends a message via the least recently used active instance (round-robin) */
export async function sendRoundRobin(phone: string, message: string): Promise<{ sent: boolean; instance?: string }> {
  const instances = await getActiveInstances()
  if (instances.length === 0) return { sent: false }

  for (const instance of instances) {
    const sent = await sendWhatsAppMessage({ phone, message, instanceName: instance })
    if (sent) return { sent: true, instance }
  }
  return { sent: false }
}

export function buildFollowUpMessage(name: string, webinarTitle: string, offerUrl: string, wppGroupUrl?: string): string {
  return `Olá, ${name}! 👋\n\nObrigado por participar da nossa aula sobre *${webinarTitle}*.\n\nTemos uma oferta especial para você que assistiu até o fim. Clique abaixo para garantir sua vaga:\n👉 ${offerUrl}\n\n${wppGroupUrl ? `📲 Entre também no nosso grupo VIP: ${wppGroupUrl}` : ''}`
}

export function buildNoShowMessage(name: string, webinarTitle: string, nextSessionInfo: string): string {
  return `Oi, ${name}! Aqui é o IDM 😊\n\nVimos que você se inscreveu na aula sobre *${webinarTitle}* mas não conseguiu participar.\n\nTemos uma nova turma disponível! ${nextSessionInfo}\n\nClique para entrar na próxima turma 👇`
}
