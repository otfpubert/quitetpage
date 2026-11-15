import { calculateChartOp } from './overpower'
import { calculateChartRating, SCORE_BORDERS } from './rating'
import type { ClearLamp } from './types'

export interface CurvePoint {
  score: number
  op: number
  rating: number
}

/** Default dual-chart window: 975k–1010k (plan §4.2). */
export function generateOpCurve(
  chartConstant: number,
  lamp: ClearLamp = 'NONE',
  options?: { from?: number; to?: number; step?: number },
): CurvePoint[] {
  const from = options?.from ?? SCORE_BORDERS.S
  const to = options?.to ?? SCORE_BORDERS.MAX
  const step = options?.step ?? 100
  const points: CurvePoint[] = []
  for (let score = from; score <= to; score += step) {
    points.push({
      score,
      op: calculateChartOp(chartConstant, score, lamp),
      rating: calculateChartRating(chartConstant, score),
    })
  }
  if (points[points.length - 1]?.score !== to) {
    points.push({
      score: to,
      op: calculateChartOp(chartConstant, to, lamp),
      rating: calculateChartRating(chartConstant, to),
    })
  }
  return points
}

/**
 * Approximate intersections where OP_A(score) == OP_B(score)
 * within the shared score domain (same lamp on both).
 */
export function findOpCrossovers(
  ccA: number,
  ccB: number,
  lamp: ClearLamp = 'NONE',
): number[] {
  if (ccA === ccB) return []
  const a = generateOpCurve(ccA, lamp, { step: 1 })
  const b = generateOpCurve(ccB, lamp, { step: 1 })
  const hits: number[] = []
  for (let i = 1; i < a.length; i++) {
    const d0 = a[i - 1].op - b[i - 1].op
    const d1 = a[i].op - b[i].op
    if (d0 === 0) hits.push(a[i - 1].score)
    else if (d0 * d1 < 0) {
      // linear interpolate crossing
      const t = d0 / (d0 - d1)
      hits.push(Math.round(a[i - 1].score + t * (a[i].score - a[i - 1].score)))
    }
  }
  return [...new Set(hits)]
}

export function simulateDeltas(input: {
  chartConstant: number
  currentScore: number
  currentLamp: ClearLamp
  targetScore: number
  targetLamp: ClearLamp
  currentBestSongOp: number
  totalTheoreticalMaxOp: number
}) {
  const current = calculateChartOp(
    input.chartConstant,
    input.currentScore,
    input.currentLamp,
  )
  const simulated = calculateChartOp(
    input.chartConstant,
    input.targetScore,
    input.targetLamp,
  )
  const deltaChartOp = simulated - current
  const deltaSongOp = Math.max(0, simulated - input.currentBestSongOp)
  const deltaTotalOpPercent =
    input.totalTheoreticalMaxOp > 0
      ? (deltaSongOp / input.totalTheoreticalMaxOp) * 100
      : 0
  return { current, simulated, deltaChartOp, deltaSongOp, deltaTotalOpPercent }
}
