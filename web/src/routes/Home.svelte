<script lang="ts">
  import MoodPicker from '../components/MoodPicker.svelte'
  import MoodChart from '../components/MoodChart.svelte'
  import MoodCalendar from '../components/MoodCalendar.svelte'
  import ActionsCard from '../components/ActionsCard.svelte'
  import { getAllMoods, requestPersistentStorage, toggleMood, watchMoodsForMonth } from '../lib/db'
  import { exportCsv } from '../lib/csv'
  import { shareOrDownload } from '../lib/share'
  import { getMonthRange, toDayKey } from '../lib/dates'
  import { selection } from '../lib/state.svelte'
  import { t } from '../lib/i18n/index.svelte'
  import type { Mood, MoodScore } from '../lib/moods'

  let moods = $state<Mood[]>([])

  // Solo se vuelve a suscribir cuando cambia el mes, no el día.
  const monthKey = $derived(getMonthRange(selection.date)[0])

  $effect(() => {
    const [year, month] = monthKey.split('-').map(Number)
    const subscription = watchMoodsForMonth(new Date(year, month - 1, 1)).subscribe({
      next: (value) => (moods = value),
      error: (error) => console.error(error),
    })
    return () => subscription.unsubscribe()
  })

  const currentMood = $derived(moods.find((m) => m.date === toDayKey(selection.date))?.mood)

  function selectDate(date: Date) {
    selection.date = date
  }

  async function handleToggle(score: MoodScore) {
    await toggleMood(selection.date, score)
    requestPersistentStorage()
  }

  async function handleExport() {
    const csv = exportCsv(await getAllMoods())
    await shareOrDownload(csv, `mini-moods-${toDayKey(new Date())}.csv`, t('export'))
  }
</script>

<main>
  <h1 class="visually-hidden">{t('app_name')}</h1>
  <MoodPicker date={selection.date} {currentMood} onDateChange={selectDate} onToggle={handleToggle} />
  <MoodChart {moods} />
  <MoodCalendar date={selection.date} {moods} onSelect={selectDate} />
  <ActionsCard onExport={handleExport} />
</main>
