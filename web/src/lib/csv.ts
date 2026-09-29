import { isValidDayKey, toDayKey } from './dates'
import { isMoodScore, type Mood } from './moods'

/** Exporta una línea "YYYY-MM-DD,mood" por registro, sin encabezado (como Android). */
export function exportCsv(moods: Mood[]): string {
  return [...moods]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((m) => `${m.date},${m.mood}`)
    .join('\n')
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

// Formato Date.toString() de Java: "Thu Jan 28 00:00:00 GMT+11:00 2021".
// Android guardaba el inicio del día local, así que solo se toman día, mes y año.
const JAVA_DATE = /^[A-Za-z]{3}\s+([A-Za-z]{3})\s+(\d{1,2})\s+\d{2}:\d{2}:\d{2}\s+.*?(\d{4})$/

export function parseDate(raw: string): string | null {
  const value = raw.trim().replace(/^"|"$/g, '')

  const iso = value.slice(0, 10)
  if (isValidDayKey(iso)) return iso

  const match = JAVA_DATE.exec(value)
  if (match) {
    const month = MONTHS.indexOf(match[1].toLowerCase())
    const day = Number(match[2])
    const year = Number(match[3])
    if (month < 0) return null
    const key = toDayKey(new Date(year, month, day))
    return isValidDayKey(key) && Number(key.slice(8)) === day ? key : null
  }

  return null
}

export interface ParseResult {
  moods: Mood[]
  skipped: number
}

/** Lee CSV exportado por la app Android o por esta PWA. Ignora líneas inválidas. */
export function parseCsv(text: string): ParseResult {
  const byDate = new Map<string, Mood>()
  let skipped = 0

  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue

    const comma = line.lastIndexOf(',')
    const date = comma > 0 ? parseDate(line.slice(0, comma)) : null
    const score = comma > 0 ? Number(line.slice(comma + 1).trim()) : NaN

    if (!date || !isMoodScore(score)) {
      skipped++
      continue
    }

    byDate.set(date, { date, mood: score })
  }

  return { moods: [...byDate.values()], skipped }
}
