import type { ScoreRank } from './types'

/** Rank score borders used for display and OP band selection. */
export const SCORE_BORDERS = {
  SSS_PLUS: 1_009_000,
  SSS: 1_007_500,
  SS_PLUS: 1_005_000,
  SS: 1_000_000,
  S_PLUS: 990_000,
  S: 975_000,
  AAA: 950_000,
  AA: 925_000,
  A: 900_000,
  BBB: 800_000,
  C: 500_000,
  MAX: 1_010_000,
} as const

/**
 * Single-chart rating (VERSE / X-VERSE).
 * Linear interpolation between borders; clamp at 0; hard-cap at CC+2.15.
 *
 * Source: wikiwiki 単曲レートの算出
 * A~AAA unified: CC-5 + (score-900000)/15000
 * S~S+: CC + (score-975000)/25000
 */
export function calculateChartRating(chartConstant: number, score: number): number {
  const s = clampScore(score)
  if (s < SCORE_BORDERS.C) return 0

  if (s >= SCORE_BORDERS.SSS_PLUS) {
    return chartConstant + 2.15
  }

  if (s >= SCORE_BORDERS.SSS) {
    // +0.01 / 100 pts → / 10_000
    return chartConstant + 2.0 + (s - SCORE_BORDERS.SSS) / 10_000
  }

  if (s >= SCORE_BORDERS.SS_PLUS) {
    // +0.01 / 50 pts → / 5_000
    return chartConstant + 1.5 + (s - SCORE_BORDERS.SS_PLUS) / 5_000
  }

  if (s >= SCORE_BORDERS.SS) {
    // +0.01 / 100 pts → / 10_000
    return chartConstant + 1.0 + (s - SCORE_BORDERS.SS) / 10_000
  }

  if (s >= SCORE_BORDERS.S) {
    // S and S+ share slope: +0.01 / 250 pts → / 25_000
    return chartConstant + (s - SCORE_BORDERS.S) / 25_000
  }

  if (s >= SCORE_BORDERS.A) {
    // A~AAA unified from wikiwiki footnote
    return Math.max(0, chartConstant - 5 + (s - SCORE_BORDERS.A) / 15_000)
  }

  if (s >= SCORE_BORDERS.BBB) {
    const floor = (chartConstant - 5) / 2
    const ceil = chartConstant - 5
    const t = (s - SCORE_BORDERS.BBB) / 100_000
    return Math.max(0, floor + t * (ceil - floor))
  }

  // C ~ BBB
  const ceil = (chartConstant - 5) / 2
  const t = (s - SCORE_BORDERS.C) / 300_000
  return Math.max(0, t * ceil)
}

export function getScoreRank(score: number): ScoreRank {
  const s = clampScore(score)
  if (s >= SCORE_BORDERS.SSS_PLUS) return 'SSS+'
  if (s >= SCORE_BORDERS.SSS) return 'SSS'
  if (s >= SCORE_BORDERS.SS_PLUS) return 'SS+'
  if (s >= SCORE_BORDERS.SS) return 'SS'
  if (s >= SCORE_BORDERS.S_PLUS) return 'S+'
  if (s >= SCORE_BORDERS.S) return 'S'
  if (s >= SCORE_BORDERS.AAA) return 'AAA'
  if (s >= SCORE_BORDERS.AA) return 'AA'
  if (s >= SCORE_BORDERS.A) return 'A'
  if (s >= SCORE_BORDERS.BBB) return 'BBB'
  if (s >= SCORE_BORDERS.C) return 'C'
  return 'D'
}

/** Truncate toward zero to 2 decimal places (display). */
export function formatRating(rating: number): string {
  const truncated = Math.trunc(rating * 100) / 100
  return truncated.toFixed(2)
}

/**
 * Player total rating = average of Best30 + New20 (50 charts).
 * Charts must be unique across frames; callers should pre-partition.
 */
export function calculatePlayerRating(best30: number[], new20: number[]): number {
  const pad = (arr: number[], n: number) => {
    const copy = [...arr].sort((a, b) => b - a).slice(0, n)
    while (copy.length < n) copy.push(0)
    return copy
  }
  const b = pad(best30, 30)
  const n = pad(new20, 20)
  const sum = b.reduce((a, x) => a + x, 0) + n.reduce((a, x) => a + x, 0)
  return sum / 50
}

function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0
  return Math.min(SCORE_BORDERS.MAX, Math.max(0, Math.floor(score)))
}
