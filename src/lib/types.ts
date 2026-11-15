export type Difficulty = 'BASIC' | 'ADVANCED' | 'EXPERT' | 'MASTER' | 'ULTIMA'

export type ClearLamp = 'NONE' | 'CLEAR' | 'FC' | 'AJ' | 'AJC'

export type ScoreRank =
  | 'D'
  | 'C'
  | 'BBB'
  | 'A'
  | 'AA'
  | 'AAA'
  | 'S'
  | 'S+'
  | 'SS'
  | 'SS+'
  | 'SSS'
  | 'SSS+'

export interface Chart {
  id: string
  songId: string
  title: string
  difficulty: Difficulty
  displayLevel: string
  chartConstant: number
  isNewSong: boolean
}

export interface PlayRecord {
  chartId: string
  highScore: number
  bestClearLamp: ClearLamp
}

export type PossessionPlate = 'none' | 'silver' | 'gold' | 'platinum' | 'rainbow'
