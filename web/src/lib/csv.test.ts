import { describe, expect, it } from 'vitest'
import { exportCsv, parseCsv, parseDate } from './csv'

describe('csv', () => {
  it('exporta ordenado y sin encabezado', () => {
    expect(
      exportCsv([
        { date: '2021-01-28', mood: 5 },
        { date: '2021-01-08', mood: 1 },
      ]),
    ).toBe('2021-01-08,1\n2021-01-28,5')
  })

  it('lee el formato Date.toString() de Java exportado por Android', () => {
    expect(parseDate('Thu Jan 28 00:00:00 GMT+11:00 2021')).toBe('2021-01-28')
    expect(parseDate('Fri Jan 08 00:00:00 AEDT 2021')).toBe('2021-01-08')
    expect(parseDate('Mon Mar 04 00:00:00 CST 2024')).toBe('2024-03-04')
  })

  it('lee fechas ISO', () => {
    expect(parseDate('2021-01-28')).toBe('2021-01-28')
    expect(parseDate('2021-02-30')).toBeNull()
  })

  it('ignora líneas inválidas y ánimos fuera de rango', () => {
    const text = [
      'Thu Jan 28 00:00:00 GMT+11:00 2021,5',
      '2021-01-29,3',
      '2021-01-30,9',
      'basura',
      '',
      '2021-01-29,2',
    ].join('\r\n')

    const { moods, skipped } = parseCsv(text)
    expect(moods).toEqual([
      { date: '2021-01-28', mood: 5 },
      { date: '2021-01-29', mood: 2 },
    ])
    expect(skipped).toBe(2)
  })

  it('ida y vuelta', () => {
    const moods = [
      { date: '2021-01-08', mood: 1 as const },
      { date: '2021-01-09', mood: 3 as const },
    ]
    expect(parseCsv(exportCsv(moods)).moods).toEqual(moods)
  })
})
