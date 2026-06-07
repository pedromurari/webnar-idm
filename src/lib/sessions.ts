import { addMinutes, setHours, setMinutes, setSeconds, setMilliseconds, isAfter, isBefore, format } from 'date-fns'
import { toZonedTime, fromZonedTime } from 'date-fns-tz'

const TZ = 'America/Sao_Paulo'
const SESSION_START_HOUR = 6
const SESSION_END_HOUR = 23

/** Returns the next session slot (on the :00 or :30 grid) after a given time, within 06h-23h BRT */
export function getNextSessionTime(after: Date = new Date()): Date {
  const brt = toZonedTime(after, TZ)

  let candidate = setSeconds(setMilliseconds(brt, 0), 0)
  const mins = candidate.getMinutes()

  if (mins < 30) {
    candidate = setMinutes(candidate, 30)
  } else {
    candidate = setMinutes(addMinutes(candidate, 60 - mins), 0)
  }

  // If past 23:00, move to next day 06:00
  if (candidate.getHours() >= SESSION_END_HOUR) {
    const tomorrow = new Date(candidate)
    tomorrow.setDate(tomorrow.getDate() + 1)
    candidate = setHours(setMinutes(setSeconds(setMilliseconds(tomorrow, 0), 0), 0), SESSION_START_HOUR)
  }

  // If before 06:00, move to today 06:00
  if (candidate.getHours() < SESSION_START_HOUR) {
    candidate = setHours(setMinutes(setSeconds(setMilliseconds(candidate, 0), 0), 0), SESSION_START_HOUR)
  }

  return fromZonedTime(candidate, TZ)
}

/** Returns all session slots for a given day (BRT), 06:00 → 23:00 every 30 min */
export function getDaySessionSlots(date: Date, intervalMinutes = 30): Date[] {
  const brt = toZonedTime(date, TZ)
  const slots: Date[] = []

  let cursor = setHours(setMinutes(setSeconds(setMilliseconds(brt, 0), 0), 0), SESSION_START_HOUR)

  while (cursor.getHours() < SESSION_END_HOUR || (cursor.getHours() === SESSION_END_HOUR && cursor.getMinutes() === 0)) {
    slots.push(fromZonedTime(new Date(cursor), TZ))
    cursor = addMinutes(cursor, intervalMinutes)
    if (cursor.getHours() >= 24) break
  }

  return slots
}

/** Returns elapsed seconds since session start (for syncing video position) */
export function getElapsedSeconds(sessionStartTime: Date | string): number {
  const start = new Date(sessionStartTime)
  const now = new Date()
  const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000)
  return Math.max(0, elapsed)
}

/** Formats a BRT session time for display (e.g., "14:30") */
export function formatSessionTime(utcTime: Date | string): string {
  const brt = toZonedTime(new Date(utcTime), TZ)
  return format(brt, 'HH:mm')
}

/** Returns seconds until session starts */
export function getSecondsUntil(sessionStartTime: Date | string): number {
  const start = new Date(sessionStartTime)
  const now = new Date()
  return Math.max(0, Math.floor((start.getTime() - now.getTime()) / 1000))
}

/** Checks if a session time is within operating hours */
export function isWithinOperatingHours(time: Date | string): boolean {
  const brt = toZonedTime(new Date(time), TZ)
  const h = brt.getHours()
  return h >= SESSION_START_HOUR && h < SESSION_END_HOUR
}
