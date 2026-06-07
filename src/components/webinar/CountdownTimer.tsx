'use client'

import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  targetTime: Date | string
  onExpire?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function CountdownTimer({ targetTime, onExpire, className = '', size = 'md' }: CountdownTimerProps) {
  const [secs, setSecs] = useState(0)

  useEffect(() => {
    const target = new Date(targetTime).getTime()

    const tick = () => {
      const diff = Math.max(0, Math.floor((target - Date.now()) / 1000))
      setSecs(diff)
      if (diff === 0) onExpire?.()
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetTime, onExpire])

  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60

  const pad = (n: number) => String(n).padStart(2, '0')

  const sizeClasses = {
    sm: { digit: 'text-2xl', label: 'text-[10px]', box: 'w-12 h-14' },
    md: { digit: 'text-4xl', label: 'text-xs', box: 'w-16 h-20' },
    lg: { digit: 'text-5xl', label: 'text-sm', box: 'w-20 h-24' },
  }[size]

  const units = h > 0
    ? [{ v: pad(h), l: 'horas' }, { v: pad(m), l: 'min' }, { v: pad(s), l: 'seg' }]
    : [{ v: pad(m), l: 'minutos' }, { v: pad(s), l: 'segundos' }]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {units.map((u, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`${sizeClasses.box} flex flex-col items-center justify-center rounded-xl bg-card border border-border`}>
            <span className={`${sizeClasses.digit} font-black text-primary tabular-nums leading-none`}>{u.v}</span>
            <span className={`${sizeClasses.label} text-muted-foreground uppercase tracking-widest mt-1`}>{u.l}</span>
          </div>
          {i < units.length - 1 && (
            <span className="text-primary font-black text-3xl pb-4">:</span>
          )}
        </div>
      ))}
    </div>
  )
}
