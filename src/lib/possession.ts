import type { PossessionPlate, ScoreRank } from './types'

const RANK_ORDER: ScoreRank[] = [
  'D',
  'C',
  'BBB',
  'A',
  'AA',
  'AAA',
  'S',
  'S+',
  'SS',
  'SS+',
  'SSS',
  'SSS+',
]

function rankAtLeast(actual: ScoreRank, required: ScoreRank): boolean {
  return RANK_ORDER.indexOf(actual) >= RANK_ORDER.indexOf(required)
}

/**
 * VERSE ~ X-VERSE-X possession (chunithm.org).
 * Mate relaxed ranks — not used unless ruleset changes.
 */
export function evaluatePossession(input: {
  rating: number
  /** Worst MASTER/ULTIMA rank across all such charts */
  minMasterUltimaRank: ScoreRank | null
  opPercent: number
}): PossessionPlate {
  const { rating, minMasterUltimaRank, opPercent } = input
  if (rating < 16 || minMasterUltimaRank == null) return 'none'

  if (
    rankAtLeast(minMasterUltimaRank, 'SSS') &&
    opPercent >= 99.5
  ) {
    return 'rainbow'
  }
  if (
    rankAtLeast(minMasterUltimaRank, 'SS') &&
    opPercent >= 99.0
  ) {
    return 'platinum'
  }
  if (
    rankAtLeast(minMasterUltimaRank, 'S+') &&
    opPercent >= 97.5
  ) {
    return 'gold'
  }
  if (rankAtLeast(minMasterUltimaRank, 'S')) {
    return 'silver'
  }
  return 'none'
}

export const POSSESSION_THRESHOLDS = {
  rating: 16.0,
  silver: { minRank: 'S' as const, opPercent: null },
  gold: { minRank: 'S+' as const, opPercent: 97.5 },
  platinum: { minRank: 'SS' as const, opPercent: 99.0 },
  rainbow: { minRank: 'SSS' as const, opPercent: 99.5 },
} as const
