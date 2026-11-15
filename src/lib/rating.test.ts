import { describe, expect, it } from 'vitest'
import {
  calculateChartRating,
  calculatePlayerRating,
  formatRating,
  getScoreRank,
} from './rating'

describe('calculateChartRating', () => {
  it('caps at SSS+ (CC+2.15)', () => {
    expect(calculateChartRating(15.4, 1_009_000)).toBeCloseTo(17.55, 10)
    expect(calculateChartRating(15.4, 1_010_000)).toBeCloseTo(17.55, 10)
  })

  it('matches SSS / SS+ / SS / S borders', () => {
    expect(calculateChartRating(14.0, 1_007_500)).toBeCloseTo(16.0, 10)
    expect(calculateChartRating(14.0, 1_005_000)).toBeCloseTo(15.5, 10)
    expect(calculateChartRating(14.0, 1_000_000)).toBeCloseTo(15.0, 10)
    expect(calculateChartRating(14.0, 975_000)).toBeCloseTo(14.0, 10)
    expect(calculateChartRating(14.0, 990_000)).toBeCloseTo(14.6, 10)
  })

  it('interpolates SSS band (+0.01 / 100)', () => {
    // 1000 pts above SSS → +0.10
    expect(calculateChartRating(15.0, 1_008_500)).toBeCloseTo(17.1, 10)
  })

  it('uses unified A~AAA slope', () => {
    // at 925000: CC-5 + 25000/15000 = CC - 3.333...
    expect(calculateChartRating(15.0, 925_000)).toBeCloseTo(15 - 10 / 3, 10)
    // at 950000: CC-5 + 50000/15000 = CC - 1.666...
    expect(calculateChartRating(15.0, 950_000)).toBeCloseTo(15 - 5 / 3, 10)
  })

  it('returns 0 below 500k and for low BBB when CC small', () => {
    expect(calculateChartRating(15.0, 499_999)).toBe(0)
    expect(calculateChartRating(4.0, 800_000)).toBe(0) // (4-5)/2 < 0 → clamped
  })

  it('linear BBB and C bands', () => {
    expect(calculateChartRating(15.0, 800_000)).toBeCloseTo(5.0, 10)
    expect(calculateChartRating(15.0, 900_000)).toBeCloseTo(10.0, 10)
    expect(calculateChartRating(15.0, 500_000)).toBe(0)
  })
})

describe('getScoreRank / formatRating / playerRating', () => {
  it('classifies ranks', () => {
    expect(getScoreRank(1_009_000)).toBe('SSS+')
    expect(getScoreRank(1_007_500)).toBe('SSS')
    expect(getScoreRank(990_000)).toBe('S+')
    expect(getScoreRank(400_000)).toBe('D')
  })

  it('truncates display rating', () => {
    expect(formatRating(16.159)).toBe('16.15')
  })

  it('averages best30 + new20 over 50', () => {
    const best = Array(30).fill(16)
    const neu = Array(20).fill(15)
    expect(calculatePlayerRating(best, neu)).toBeCloseTo((30 * 16 + 20 * 15) / 50, 10)
  })
})
