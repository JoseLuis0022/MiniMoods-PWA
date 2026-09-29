import en from './locales/en.json'

export type MessageKey = keyof typeof en
type Messages = Partial<Record<MessageKey, string>>

const modules = import.meta.glob<Messages>('./locales/*.json', { eager: true, import: 'default' })

const catalogs: Record<string, Messages> = Object.fromEntries(
  Object.entries(modules).map(([path, messages]) => [path.match(/([\w-]+)\.json$/)![1], messages]),
)

const RTL = new Set(['ar', 'he', 'fa', 'ur'])

/** Elige el primer idioma del navegador que tengamos; si no, inglés. */
export function resolveLocale(preferred: readonly string[]): string {
  for (const tag of preferred) {
    const base = tag.toLowerCase().split('-')[0]
    if (catalogs[base]) return base
  }
  return 'en'
}

const browserLanguages = typeof navigator !== 'undefined' ? navigator.languages ?? [navigator.language] : ['en']

export const i18n = $state({ locale: resolveLocale(browserLanguages) })

/** Locale para Intl: usa el del navegador si coincide (p. ej. "es-MX"), si no el base. */
export function intlLocale(): string {
  return browserLanguages.find((l) => l.toLowerCase().startsWith(i18n.locale)) ?? i18n.locale
}

export function t(key: MessageKey, params: Record<string, string | number> = {}): string {
  const text = catalogs[i18n.locale]?.[key] ?? en[key] ?? key
  return text.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? ''))
}

export function applyDocumentLocale(): void {
  document.documentElement.lang = i18n.locale
  document.documentElement.dir = RTL.has(i18n.locale) ? 'rtl' : 'ltr'
}
