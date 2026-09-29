import { describe, expect, it } from 'vitest'
import {
  formatDayOfMonth,
  getFirstDayOfNextMonth,
  getFirstDayOfPreviousMonth,
  getMonthGrid,
  getMonthRange,
  toDayKey,
} from './dates'

describe('dates', () => {
  it('rango del mes', () => {
    expect(getMonthRange(new Date(2024, 1, 10))).toEqual(['2024-02-01', '2024-02-29'])
  })

  it('mes anterior y siguiente cruzan el año', () => {
    expect(toDayKey(getFirstDayOfPreviousMonth(new Date(2021, 0, 28)))).toBe('2020-12-01')
    expect(toDayKey(getFirstDayOfNextMonth(new Date(2021, 11, 31)))).toBe('2022-01-01')
  })

  it('la cuadrícula empieza en domingo y completa semanas', () => {
    const grid = getMonthGrid(new Date(2021, 0, 1))
    expect(grid[0].key).toBe('2020-12-27')
    expect(grid).toHaveLength(42)
    expect(grid.filter((c) => c.inMonth)).toHaveLength(31)
  })

  it('sufijos ordinales en inglés', () => {
    expect(formatDayOfMonth(new Date(2021, 0, 28), 'en')).toBe('28th of January')
    expect(formatDayOfMonth(new Date(2021, 0, 1), 'en')).toBe('1st of January')
    expect(formatDayOfMonth(new Date(2021, 0, 12), 'en')).toBe('12th of January')
    expect(formatDayOfMonth(new Date(2021, 0, 22), 'en')).toBe('22nd of January')
  })

  it('formato local en español', () => {
    expect(formatDayOfMonth(new Date(2021, 0, 28), 'es')).toBe('28 de enero')
  })
})
