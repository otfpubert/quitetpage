import { describe, expect, it } from 'vitest'
import {
  calculateChartOp,
  calculateOpPercent,
  getOpPercentColor,
  LAMP_BONUS,
  maxTheoreticalOp,
} from './overpower'

describe('calculateChartOp', () => {
  it('matches wikiwiki worked example (15.4 / 1009540 / AJ → 91.06)', () => {
    const op = calculateChartOp(15.4, 1_009_540, 'AJ')
    expect(op).toBeCloseTo(91.06, 10)
  })

  it('uses rating×5 + lamp at and below SSS', () => {
    // CC 14.0 SSS: rating 16.0 → OP 80 + FC 0.5 = 80.5
    expect(calculateChartOp(14.0, 1_007_500, 'FC')).toBeCloseTo(80.5, 10)
    expect(calculateChartOp(14.0, 975_000, 'NONE')).toBeCloseTo(70.0, 10)
  })

  it('keeps growing past SSS+ until AJC max', () => {
    const atSssPlus = calculateChartOp(15.4, 1_009_000, 'AJ')
    const higher = calculateChartOp(15.4, 1_009_500, 'AJ')
    expect(higher).toBeGreaterThan(atSssPlus)
    expect(calculateChartOp(15.4, 1_010_000, 'AJC')).toBeCloseTo(maxTheoreticalOp(15.4), 10)
    expect(maxTheoreticalOp(15.4)).toBeCloseTo(92.0, 10)
  })

  it('applies lamp bonuses', () => {
    expect(LAMP_BONUS.FC).toBe(0.5)
    expect(LAMP_BONUS.AJ).toBe(1.0)
    expect(LAMP_BONUS.AJC).toBe(1.25)
    const base = calculateChartOp(14.0, 1_000_000, 'NONE')
    expect(calculateChartOp(14.0, 1_000_000, 'AJ')).toBeCloseTo(base + 1.0, 10)
  })
})

describe('OP percent color', () => {
  it('maps wikiwiki bands', () => {
    expect(getOpPercentColor(69.99)).toBe('white')
    expect(getOpPercentColor(70)).toBe('silver')
    expect(getOpPercentColor(80)).toBe('gold')
    expect(getOpPercentColor(90)).toBe('platinum')
    expect(getOpPercentColor(95)).toBe('rainbow')
  })

  it('computes percent', () => {
    expect(calculateOpPercent(50, 100)).toBe(50)
  })
})
