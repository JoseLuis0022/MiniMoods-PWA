import Dexie, { liveQuery, type EntityTable, type Observable } from 'dexie'
import { getMonthRange, toDayKey } from './dates'
import type { Mood, MoodScore } from './moods'

export class MoodDatabase extends Dexie {
  moods!: EntityTable<Mood, 'date'>

  constructor(name = 'mini-moods') {
    super(name)
    this.version(1).stores({ moods: '&date' })
  }
}

export const db = new MoodDatabase()

export function getMoodForDay(date: Date, database = db): Promise<Mood | undefined> {
  return database.moods.get(toDayKey(date))
}

export async function addMood(date: Date, mood: MoodScore, database = db): Promise<void> {
  await database.moods.put({ date: toDayKey(date), mood })
}

export async function removeMood(date: Date, database = db): Promise<void> {
  await database.moods.delete(toDayKey(date))
}

/** Igual que MoodSelectionUseCase: tocar el mismo ánimo lo quita; si no, lo guarda/reemplaza. */
export async function toggleMood(date: Date, mood: MoodScore, database = db): Promise<void> {
  const current = await getMoodForDay(date, database)
  if (current?.mood === mood) {
    await removeMood(date, database)
  } else {
    await addMood(date, mood, database)
  }
}

export function getMoodsForMonth(date: Date, database = db): Promise<Mood[]> {
  const [from, to] = getMonthRange(date)
  return database.moods.where('date').between(from, to, true, true).toArray()
}

export function watchMoodsForMonth(date: Date, database = db): Observable<Mood[]> {
  return liveQuery(() => getMoodsForMonth(date, database))
}

export function getAllMoods(database = db): Promise<Mood[]> {
  return database.moods.orderBy('date').toArray()
}

/** Inserta o reemplaza (REPLACE, como Room). */
export async function bulkUpsert(moods: Mood[], database = db): Promise<number> {
  await database.moods.bulkPut(moods)
  return moods.length
}

let persistRequested = false

/** Pide al navegador que no borre los datos (importante en Safari/iOS). */
export async function requestPersistentStorage(): Promise<void> {
  if (persistRequested) return
  persistRequested = true
  try {
    if (navigator.storage?.persisted && !(await navigator.storage.persisted())) {
      await navigator.storage.persist?.()
    }
  } catch {
    // Sin soporte: no pasa nada.
  }
}
