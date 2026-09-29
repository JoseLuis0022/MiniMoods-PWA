import { ICON_MOOD } from './icons'

export type MoodScore = 1 | 2 | 3 | 4 | 5

export interface Mood {
  /** Día local en formato YYYY-MM-DD. */
  date: string
  mood: MoodScore
}

export interface MoodInfo {
  score: MoodScore
  color: string
  labelKey: 'very_happy' | 'happy' | 'neutral' | 'sad' | 'very_sad'
  icon: string
}

// 1 = muy feliz … 5 = muy triste, igual que en Android.
export const MOODS: Record<MoodScore, MoodInfo> = {
  1: { score: 1, color: '#9CCC65', labelKey: 'very_happy', icon: ICON_MOOD[1] },
  2: { score: 2, color: '#D4E157', labelKey: 'happy', icon: ICON_MOOD[2] },
  3: { score: 3, color: '#FFCA28', labelKey: 'neutral', icon: ICON_MOOD[3] },
  4: { score: 4, color: '#FFA726', labelKey: 'sad', icon: ICON_MOOD[4] },
  5: { score: 5, color: '#FF7043', labelKey: 'very_sad', icon: ICON_MOOD[5] },
}

/** Orden de los botones en la tarjeta: de triste a feliz. */
export const PICKER_ORDER: MoodScore[] = [5, 4, 3, 2, 1]

export const isMoodScore = (value: number): value is MoodScore =>
  Number.isInteger(value) && value >= 1 && value <= 5
