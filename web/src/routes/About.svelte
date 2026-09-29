<script lang="ts">
  import Icon from '../components/Icon.svelte'
  import { ICON_LEFT, ICON_RIGHT } from '../lib/icons'
  import { MOODS } from '../lib/moods'
  import { burstFrom } from '../lib/confetti'
  import { bulkUpsert } from '../lib/db'
  import { parseCsv } from '../lib/csv'
  import { t } from '../lib/i18n/index.svelte'
  import { setThemePreference, theme, type ThemePreference } from '../lib/theme.svelte'

  const REPO = 'https://github.com/JoseLuis0022/MiniMoods-PWA'
  const ORIGINAL_REPO = 'https://github.com/CampbellMG/MiniMoods'

  const rtl = document.documentElement.dir === 'rtl'

  let importMessage = $state('')
  let fileInput: HTMLInputElement

  function goBack() {
    if (history.length > 1) history.back()
    else location.hash = '#/'
  }

  // Mantener presionado el ícono lanza confeti (setOnLongClickListener en Android).
  let pressTimer: ReturnType<typeof setTimeout> | undefined

  function startPress(event: PointerEvent) {
    const target = event.currentTarget as Element
    pressTimer = setTimeout(() => burstFrom(target), 500)
  }

  function cancelPress() {
    clearTimeout(pressTimer)
  }

  async function handleImport() {
    const file = fileInput.files?.[0]
    fileInput.value = ''
    if (!file) return

    try {
      const { moods, skipped } = parseCsv(await file.text())
      if (moods.length === 0) {
        importMessage = t('import_error')
        return
      }
      const count = await bulkUpsert(moods)
      importMessage = t('import_done', { count })
      if (skipped > 0) importMessage += ` · ${t('import_skipped', { count: skipped })}`
    } catch (error) {
      console.error(error)
      importMessage = t('import_error')
    }
  }

  const themeOptions: { value: ThemePreference; key: 'system_default' | 'light' | 'dark' }[] = [
    { value: 'system', key: 'system_default' },
    { value: 'light', key: 'light' },
    { value: 'dark', key: 'dark' },
  ]
</script>

<main>
  <nav class="toolbar">
    <button type="button" class="back pressable" onclick={goBack} aria-label={t('back')}>
      <Icon path={rtl ? ICON_RIGHT : ICON_LEFT} size={28} />
    </button>
  </nav>

  <div class="hero">
    <button
      type="button"
      class="app-icon"
      aria-label={t('app_name')}
      onpointerdown={startPress}
      onpointerup={cancelPress}
      onpointerleave={cancelPress}
      onpointercancel={cancelPress}
      oncontextmenu={(event) => event.preventDefault()}
    >
      <Icon path={MOODS[1].icon} size={128} color={MOODS[1].color} />
    </button>
    <p class="version">{__APP_VERSION__}</p>
  </div>

  <a class="card link pressable" href="{REPO}/issues" target="_blank" rel="noopener">{t('contact_us')}</a>
  <a class="card link pressable" href={REPO} target="_blank" rel="noopener">{t('contribute')}</a>
  <a class="card link pressable" href={ORIGINAL_REPO} target="_blank" rel="noopener">{t('credit')}</a>

  <hr />

  <section class="settings" aria-label={t('settings')}>
    <fieldset class="card setting">
      <legend>{t('theme')}</legend>
      {#each themeOptions as option (option.value)}
        <label class="option">
          <input
            type="radio"
            name="theme"
            value={option.value}
            checked={theme.preference === option.value}
            onchange={() => setThemePreference(option.value)}
          />
          <span>{t(option.key)}</span>
        </label>
      {/each}
    </fieldset>

    <div class="card setting">
      <h2>{t('data')}</h2>
      <label class="option file pressable">
        <input bind:this={fileInput} type="file" accept=".csv,text/csv,text/plain" onchange={handleImport} />
        <span>{t('import')}</span>
      </label>
      <p class="status" aria-live="polite">{importMessage}</p>
    </div>
  </section>
</main>

<style>
  main {
    margin-top: calc(-32px + 8px);
  }

  .toolbar {
    padding: 0 8px;
  }

  .back {
    display: flex;
    padding: 10px;
    border-radius: 50%;
    color: var(--color-icon);
  }

  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 24px;
  }

  .app-icon {
    border-radius: 50%;
    touch-action: manipulation;
    -webkit-touch-callout: none;
    user-select: none;
  }

  .version {
    margin: 16px 0 48px;
    font-size: 14px;
  }

  .link {
    display: block;
    padding: 16px;
  }

  .card + .card {
    margin-top: 16px;
  }

  hr {
    height: 1px;
    margin: 16px 32px;
    border: 0;
    background: var(--color-card-border);
  }

  :global([data-theme='dark']) hr {
    background: #3b4146;
  }

  .setting {
    margin-top: 16px;
    padding: 16px;
    min-inline-size: auto;
  }

  legend,
  h2 {
    float: left;
    width: 100%;
    margin: 0 0 8px;
    padding: 0;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.7;
  }

  .option {
    display: flex;
    align-items: center;
    gap: 12px;
    clear: both;
    padding: 10px 4px;
    cursor: pointer;
  }

  .option input[type='radio'] {
    width: 18px;
    height: 18px;
    margin: 0;
    accent-color: var(--color-primary);
  }

  .file {
    border-radius: 10px;
    padding: 10px 8px;
  }

  .file input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
  }

  .file:focus-within {
    outline: 2px solid var(--color-focus);
  }

  .status {
    margin: 4px 0 0;
    min-height: 1.4em;
    font-size: 14px;
  }
</style>
