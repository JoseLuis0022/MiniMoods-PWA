<script lang="ts">
  import Icon from './Icon.svelte'
  import { MOODS, type Mood } from '../lib/moods'
  import { fromDayKey } from '../lib/dates'
  import { t } from '../lib/i18n/index.svelte'

  interface Props {
    moods: Mood[]
  }

  let { moods }: Props = $props()

  const HEIGHT = 260
  const LINE_WIDTH = 5
  const PAD = LINE_WIDTH // margen para que la línea no se corte en los bordes
  const Y_MAX = 6
  const GRID = [6, 4, 2, 0]
  const INTENSITY = 0.18

  let width = $state(0)

  const sorted = $derived([...moods].sort((a, b) => a.date.localeCompare(b.date)))

  const yFor = (value: number) => PAD + (1 - value / Y_MAX) * (HEIGHT - PAD * 2)

  // Mismo algoritmo CUBIC_BEZIER de MPAndroidChart (LineChartRenderer.drawCubicBezier).
  const path = $derived.by(() => {
    if (sorted.length === 0 || width === 0) return ''

    const times = sorted.map((m) => fromDayKey(m.date).getTime())
    const minX = times[0]
    const maxX = times[times.length - 1]
    const span = maxX - minX

    // Eje Y invertido: 1 (muy feliz) arriba.
    const points = sorted.map((m, i) => ({
      x: span === 0 ? 0 : PAD + ((times[i] - minX) / span) * (width - PAD * 2),
      y: yFor(Y_MAX - m.mood),
    }))

    if (points.length === 1) {
      return `M${PAD},${points[0].y} L${width - PAD},${points[0].y}`
    }

    let d = `M${points[0].x},${points[0].y}`
    for (let j = 1; j < points.length; j++) {
      const prevPrev = points[Math.max(j - 2, 0)]
      const prev = points[j - 1]
      const cur = points[j]
      const next = points[Math.min(j + 1, points.length - 1)]

      const prevDx = (cur.x - prevPrev.x) * INTENSITY
      const prevDy = (cur.y - prevPrev.y) * INTENSITY
      const curDx = (next.x - prev.x) * INTENSITY
      const curDy = (next.y - prev.y) * INTENSITY

      d += ` C${prev.x + prevDx},${prev.y + prevDy} ${cur.x - curDx},${cur.y - curDy} ${cur.x},${cur.y}`
    }
    return d
  })

  // Reinicia la animación cuando cambian los datos.
  const signature = $derived(sorted.map((m) => `${m.date}:${m.mood}`).join('|'))
</script>

<section class="card chart-card">
  <div class="labels" aria-hidden="true">
    <Icon path={MOODS[1].icon} size={32} color={MOODS[1].color} />
    <Icon path={MOODS[3].icon} size={32} color={MOODS[3].color} />
    <Icon path={MOODS[5].icon} size={32} color={MOODS[5].color} />
  </div>

  <div class="plot" bind:clientWidth={width} style:height="{HEIGHT}px">
    {#if width > 0}
      <svg width={width} height={HEIGHT} role="img" aria-label={sorted.length ? undefined : t('no_moods')}>
        {#each GRID as value (value)}
          <line class="grid" x1="0" x2={width} y1={yFor(value)} y2={yFor(value)} />
        {/each}
        {#key signature}
          {#if path}
            <path class="line" d={path} stroke-width={LINE_WIDTH} />
          {/if}
        {/key}
      </svg>
    {/if}

    {#if sorted.length === 0}
      <p class="empty">{t('no_moods')}</p>
    {/if}
  </div>
</section>

<style>
  .chart-card {
    display: flex;
    gap: 12px;
    padding: 16px;
  }

  .labels {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .plot {
    position: relative;
    flex: 1;
    min-width: 0;
  }

  svg {
    display: block;
    overflow: visible;
  }

  .grid {
    stroke: var(--color-grid);
    stroke-width: 1;
  }

  .line {
    fill: none;
    stroke: var(--color-primary);
    stroke-linecap: round;
    stroke-linejoin: round;
    transform-box: view-box;
    transform-origin: 50% 100%;
    /* animateY(600, EaseInBack) */
    animation: grow 600ms cubic-bezier(0.6, -0.28, 0.735, 0.045) both;
  }

  @keyframes grow {
    from {
      transform: scaleY(0);
    }
    to {
      transform: scaleY(1);
    }
  }

  .empty {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    text-align: center;
    color: var(--color-icon);
    opacity: 0.8;
    font-size: 14px;
  }
</style>
