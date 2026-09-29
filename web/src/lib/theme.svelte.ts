export type ThemePreference = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'mini-moods:theme'
const THEME_COLORS = { light: '#FBFBFB', dark: '#25292E' }

function readPreference(): ThemePreference {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === 'light' || value === 'dark' || value === 'system') return value
  } catch {
    // Almacenamiento bloqueado: usar el del sistema.
  }
  return 'system'
}

export const theme = $state({ preference: readPreference() })

const media = window.matchMedia('(prefers-color-scheme: dark)')

function resolved(): 'light' | 'dark' {
  if (theme.preference === 'system') return media.matches ? 'dark' : 'light'
  return theme.preference
}

export function applyTheme(): void {
  const mode = resolved()
  document.documentElement.dataset.theme = mode
  document.documentElement.style.colorScheme = mode
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute('content', THEME_COLORS[mode])
  })
}

export function setThemePreference(preference: ThemePreference): void {
  theme.preference = preference
  try {
    localStorage.setItem(STORAGE_KEY, preference)
  } catch {
    // Ignorar.
  }
  applyTheme()
}

media.addEventListener('change', () => {
  if (theme.preference === 'system') applyTheme()
})
