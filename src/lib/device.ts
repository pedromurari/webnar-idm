export function parseDevice(userAgent: string): { device: string; browser: string; os: string } {
  const ua = userAgent.toLowerCase()

  const device = /mobile|android|iphone|ipad|tablet/.test(ua) ? 'mobile' : 'desktop'

  let browser = 'Outro'
  if (ua.includes('edg/')) browser = 'Edge'
  else if (ua.includes('chrome')) browser = 'Chrome'
  else if (ua.includes('safari')) browser = 'Safari'
  else if (ua.includes('firefox')) browser = 'Firefox'
  else if (ua.includes('opera') || ua.includes('opr/')) browser = 'Opera'

  let os = 'Outro'
  if (ua.includes('windows')) os = 'Windows'
  else if (ua.includes('mac os') || ua.includes('macos')) os = 'macOS'
  else if (ua.includes('android')) os = 'Android'
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS'
  else if (ua.includes('linux')) os = 'Linux'

  return { device, browser, os }
}
