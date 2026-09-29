<script lang="ts">
  import Icon from './Icon.svelte'
  import { ICON_EXPAND } from '../lib/icons'
  import { MOODS, PICKER_ORDER, type MoodScore } from '../lib/moods'
  import { formatDayOfMonth, fromDayKey, isValidDayKey, toDayKey } from '../lib/dates'
  import { intlLocale, t } from '../lib/i18n/index.svelte'

  interface Props {
    date: Date
    currentMood: MoodScore | undefined
    onDateChange: (date: Date) => void
    onToggle: (mood: MoodScore) => void
  }

  let { date, currentMood, onDateChange, onToggle }: Props = $props()

  let input: HTMLInputElement

  const label = $derived(formatDayOfMonth(date, intlLocale()))

  function openPicker() {
    input.value = toDayKey(date)
    try {
      input.showPicker()
    } catch {
      input.focus()
      input.click()
    }
  }

  function handleChange() {
    if (isValidDayKey(input.value)) onDateChange(fromDayKey(input.value))
  }
</script>

<section class="card mood-card">
  <div class="date-wrapper">
    <button class="date pressable" type="button" onclick={openPicker} aria-label="{t('choose_date')}: {label}">
      <span>{label}</span>
      <Icon path={ICON_EXPAND} size={24} />
    </button>
    <input
      bind:this={input}
      class="date-input"
      type="date"
      tabindex="-1"
      aria-hidden="true"
      onchange={handleChange}
    />
  </div>

  <div class="moods" role="group" aria-label={label}>
    {#each PICKER_ORDER as score (score)}
      {@const info = MOODS[score]}
      {@const active = currentMood === score}
      <button
        type="button"
        class="mood"
        class:active
        aria-pressed={active}
        aria-label={t(info.labelKey)}
        onclick={() => onToggle(score)}
      >
        <Icon path={info.icon} size={40} color={active ? info.color : 'var(--color-disabled)'} />
      </button>
    {/each}
  </div>
</section>

<style>
  .mood-card {
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .date-wrapper {
    position: relative;
    margin-bottom: 16px;
  }

  .date {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--color-primary);
  }

  .date-input {
    position: absolute;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    width: 100%;
    height: 100%;
    border: 0;
  }

  .moods {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    width: 100%;
    padding-inline-start: 8px;
  }

  .mood {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    max-width: 64px;
    width: 100%;
    justify-self: center;
    padding: 8px;
    border-radius: 10px;
    background: var(--color-button);
    transition: background-color 0.15s ease, transform 0.1s ease;
  }

  .mood:active {
    background: var(--color-button-pressed);
    transform: scale(0.94);
  }
</style>
