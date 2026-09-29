import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { MoodDatabase, getAllMoods, getMoodForDay, getMoodsForMonth, toggleMood, bulkUpsert } from './db'

// Replica MoodSelectionUseCaseImplTest y MoodRepositoryTest de Android.
describe('db', () => {
  let db: MoodDatabase

  beforeEach(() => {
    db = new MoodDatabase(`test-${Math.random()}`)
  })

  afterEach(async () => {
    await db.delete()
  })

  it('guarda un ánimo normalizado al día', async () => {
    await toggleMood(new Date(2021, 0, 28, 15, 30), 3, db)
    expect(await getMoodForDay(new Date(2021, 0, 28, 8), db)).toEqual({ date: '2021-01-28', mood: 3 })
  })

  it('quita el ánimo si se selecciona el mismo', async () => {
    const date = new Date(2021, 0, 28)
    await toggleMood(date, 3, db)
    await toggleMood(date, 3, db)
    expect(await getMoodForDay(date, db)).toBeUndefined()
  })

  it('reemplaza el ánimo si se selecciona otro', async () => {
    const date = new Date(2021, 0, 28)
    await toggleMood(date, 3, db)
    await toggleMood(date, 1, db)
    expect((await getMoodForDay(date, db))?.mood).toBe(1)
    expect(await getAllMoods(db)).toHaveLength(1)
  })

  it('devuelve solo los ánimos del mes', async () => {
    await bulkUpsert(
      [
        { date: '2020-12-31', mood: 1 },
        { date: '2021-01-01', mood: 2 },
        { date: '2021-01-31', mood: 3 },
        { date: '2021-02-01', mood: 4 },
      ],
      db,
    )
    const moods = await getMoodsForMonth(new Date(2021, 0, 15), db)
    expect(moods.map((m) => m.date)).toEqual(['2021-01-01', '2021-01-31'])
  })
})
