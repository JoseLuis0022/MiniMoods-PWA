// Utilidades de fecha. Los días se manejan como claves locales "YYYY-MM-DD"
// para evitar problemas de zona horaria (equivale al atStartOfDay de Android).

const pad = (n: number) => String(n).padStart(2, '0')

export function toDayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function fromDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function isValidDayKey(key: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false
  return toDayKey(fromDayKey(key)) === key
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDayKey(a) === toDayKey(b)
}

/** Rango [primer día, último día] del mes como claves. */
export function getMonthRange(date: Date): [string, string] {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return [toDayKey(start), toDayKey(end)]
}

export function getFirstDayOfPreviousMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1)
}

export function getFirstDayOfNextMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1)
}

export function daysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

export interface CalendarCell {
  date: Date
  key: string
  inMonth: boolean
}

/** Cuadrícula del mes empezando en domingo, completando semanas con días vecinos. */
export function getMonthGrid(date: Date): CalendarCell[] {
  const first = new Date(date.getFullYear(), date.getMonth(), 1)
  const start = new Date(first)
  start.setDate(1 - first.getDay())

  const total = first.getDay() + daysInMonth(date)
  const weeks = Math.ceil(total / 7)
  const cells: CalendarCell[] = []

  for (let i = 0; i < weeks * 7; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    cells.push({ date: d, key: toDayKey(d), inMonth: d.getMonth() === date.getMonth() })
  }

  return cells
}

export function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th'
  switch (day % 10) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}

/** "28th of January" en inglés; formato local (p. ej. "28 de enero") en otros idiomas. */
export function formatDayOfMonth(date: Date, locale: string): string {
  if (locale.startsWith('en')) {
    const month = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date)
    return `${date.getDate()}${getDaySuffix(date.getDate())} of ${month}`
  }
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(date)
}

export function formatMonthYear(date: Date, locale: string): string {
  const text = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date)
  return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1)
}

/** Iniciales de los días de la semana, de domingo a sábado. */
export function weekdayInitials(locale: string): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: 'narrow' })
  // 2021-01-03 fue domingo.
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2021, 0, 3 + i)))
}
