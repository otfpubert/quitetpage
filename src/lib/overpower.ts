import { calculateChartRating, SCORE_BORDERS } from './rating'
import type { ClearLamp } from './types'

export const LAMP_BONUS: Record<ClearLamp, number> = {
  NONE: 0,
  CLEAR: 0,
  FC: 0.5,
  AJ: 1.0,
  AJC: 1.25,
}

/** Theoretical max OP for a chart: (CC + 3) × 5 */
export function maxTheoreticalOp(chartConstant: number): number {
  return (chartConstant + 3) * 5
}

/**
 * Single-chart OVER POWER.
 * Source: wikiwiki OVER POWER table + worked example.
 */
export function calculateChartOp(
  chartConstant: number,
  score: number,
  lamp: ClearLamp,
): number {
  const s = clampScore(score)
  const lampBonus = LAMP_BONUS[lamp]

  if (s >= SCORE_BORDERS.MAX) {
    return maxTheoreticalOp(chartConstant)
  }

  if (s > SCORE_BORDERS.SSS) {
    const base = (chartConstant + 2) * 5
    const scoreBonus = (s - SCORE_BORDERS.SSS) * 0.0015
    return base + lampBonus + scoreBonus
  }

  const rating = calculateChartRating(chartConstant, s)
  return rating * 5 + lampBonus
}

/**
 * Optional NET-style quantum (RemyWiki: floor to nearest 0.005).
 * Not stated on the two pinned project sources — off by default.
 */
export function floorOpQuantum(op: number): number {
  return Math.floor(op / 0.005) * 0.005
}

export function calculateSongOp(
  charts: Array<{ chartConstant: number; score: number; lamp: ClearLamp }>,
): number {
  if (charts.length === 0) return 0
  return Math.max(...charts.map((c) => calculateChartOp(c.chartConstant, c.score, c.lamp)))
}

export function calculateTotalOp(
  songOps: number[],
): number {
  return songOps.reduce((a, x) => a + x, 0)
}

export function calculateOpPercent(totalOp: number, theoreticalMax: number): number {
  if (theoreticalMax <= 0) return 0
  return (totalOp / theoreticalMax) * 100
}

export type OpPercentColor = 'white' | 'silver' | 'gold' | 'platinum' | 'rainbow'

export function getOpPercentColor(percent: number): OpPercentColor {
  if (percent >= 95) return 'rainbow'
  if (percent >= 90) return 'platinum'
  if (percent >= 80) return 'gold'
  if (percent >= 70) return 'silver'
  return 'white'
}

function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0
  return Math.min(SCORE_BORDERS.MAX, Math.max(0, Math.floor(score)))
}
