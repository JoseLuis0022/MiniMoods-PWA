<script lang="ts">
  import Icon from './Icon.svelte'
  import { ICON_LEFT, ICON_RIGHT } from '../lib/icons'
  import { MOODS, type Mood } from '../lib/moods'
  import {
    formatMonthYear,
    getFirstDayOfNextMonth,
    getFirstDayOfPreviousMonth,
    getMonthGrid,
    toDayKey,
    weekdayInitials,
  } from '../lib/dates'
  import { intlLocale, t } from '../lib/i18n/index.svelte'

  interface Props {
    date: Date
    moods: Mood[]
    onSelect: (date: Date) => void
  }

  let { date, moods, onSelect }: Props = $props()

  const cells = $derived(getMonthGrid(date))
  const moodByDay = $derived(new Map(moods.map((m) => [m.date, m.mood])))
  const selectedKey = $derived(toDayKey(date))
  const todayKey = toDayKey(new Date())
  const weekdays = $derived(weekdayInitials(intlLocale()))
  const title = $derived(formatMonthYear(date, intlLocale()))
  const dayFormat = $derived(new Intl.DateTimeFormat(intlLocale(), { dateStyle: 'full' }))
  const rtl = $derived(document.documentElement.dir === 'rtl')
</script>

<section class="card calendar-card">
  <header>
    <button
      type="button"
      class="nav pressable"
      aria-label={t('previous_month')}
      onclick={() => onSelect(getFirstDayOfPreviousMonth(date))}
    >
      <Icon path={rtl ? ICON_RIGHT : ICON_LEFT} size={28} />
    </button>
    <h2 aria-live="polite">{title}</h2>
    <button
      type="button"
      class="nav pressable"
      aria-label={t('next_month')}
      onclick={() => onSelect(getFirstDayOfNextMonth(date))}
    >
      <Icon path={rtl ? ICON_LEFT : ICON_RIGHT} size={28} />
    </button>
  </header>

  <div class="grid weekdays" aria-hidden="true">
    {#each weekdays as day, i (i)}
      <span>{day}</span>
    {/each}
  </div>

  <div class="grid days">
    {#each cells as cell (cell.key)}
      {@const mood = moodByDay.get(cell.key)}
      <div class="cell">
        <button
          type="button"
          class="day"
          class:other={!cell.inMonth}
          class:has-mood={mood !== undefined}
          class:selected={cell.key === selectedKey}
          class:today={cell.key === todayKey}
          style:--mood-color={mood ? MOODS[mood].color : undefined}
          aria-current={cell.key === selectedKey ? 'date' : undefined}
          aria-label="{dayFormat.format(cell.date)}{mood ? `, ${t(MOODS[mood].labelKey)}` : ''}"
          onclick={() => onSelect(cell.date)}
        >
          {cell.date.getDate()}
        </button>
      </div>
    {/each}
  </div>
</section>

<style>
  .calendar-card {
    padding: 16px 0 8px;
    overflow: hidden;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px 16px;
  }

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 400;
    color: var(--color-icon);
  }

  .nav {
    display: flex;
    padding: 6px;
    border-radius: 50%;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }

  .weekdays span {
    text-align: center;
    font-size: 14px;
    padding: 8px 0 12px;
  }

  .cell {
    display: flex;
    justify-content: center;
    padding: 8px 0;
    border-top: 1px solid var(--color-card-border);
  }

  .days .cell:nth-child(-n + 7) {
    border-top: none;
  }

  .day {
    width: 38px;
    height: 38px;
    border-radius: 5px;
    font-size: 15px;
    color: var(--color-icon);
    transition: background-color 0.15s ease, box-shadow 0.15s ease;
  }

  .day:hover {
    background: var(--color-button);
  }

  .day.other {
    color: var(--color-disabled);
  }

  .day.today {
    font-weight: 700;
  }

  .day.has-mood {
    background: var(--mood-color);
    color: #3a3839;
  }

  .day.selected {
    box-shadow: 0 0 0 2px var(--color-card), 0 0 0 4px var(--color-icon);
  }
</style>
