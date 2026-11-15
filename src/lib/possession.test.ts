import { describe, expect, it } from 'vitest'
import { evaluatePossession } from './possession'

describe('evaluatePossession (VERSE~X-VERSE-X)', () => {
  it('requires rating 16+', () => {
    expect(
      evaluatePossession({ rating: 15.99, minMasterUltimaRank: 'SSS', opPercent: 100 }),
    ).toBe('none')
  })

  it('awards silver / gold / platinum / rainbow', () => {
    expect(
      evaluatePossession({ rating: 16.0, minMasterUltimaRank: 'S', opPercent: 0 }),
    ).toBe('silver')
    expect(
      evaluatePossession({ rating: 16.0, minMasterUltimaRank: 'S+', opPercent: 97.5 }),
    ).toBe('gold')
    expect(
      evaluatePossession({ rating: 16.0, minMasterUltimaRank: 'SS', opPercent: 99.0 }),
    ).toBe('platinum')
    expect(
      evaluatePossession({ rating: 16.0, minMasterUltimaRank: 'SSS', opPercent: 99.5 }),
    ).toBe('rainbow')
  })

  it('blocks plate when rank gate fails', () => {
    expect(
      evaluatePossession({ rating: 16.5, minMasterUltimaRank: 'AAA', opPercent: 99.9 }),
    ).toBe('none')
  })
})
