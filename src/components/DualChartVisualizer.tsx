import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { findOpCrossovers, generateOpCurve } from '../lib/curves'
import type { ClearLamp } from '../lib/types'
import { SCORE_BORDERS } from '../lib/rating'

const TICKS = [
  SCORE_BORDERS.S,
  SCORE_BORDERS.S_PLUS,
  SCORE_BORDERS.SS,
  SCORE_BORDERS.SS_PLUS,
  SCORE_BORDERS.SSS,
  SCORE_BORDERS.SSS_PLUS,
  SCORE_BORDERS.MAX,
]

function formatScoreTick(v: number): string {
  if (v === SCORE_BORDERS.MAX) return '1010k'
  if (v >= 1_000_000) return `${(v / 1000).toFixed(0)}k`
  return `${(v / 1000).toFixed(0)}k`
}

interface Props {
  ccA: number
  ccB: number
  lampA: ClearLamp
  lampB: ClearLamp
}

export function DualChartVisualizer({ ccA, ccB, lampA, lampB }: Props) {
  const [mode, setMode] = useState<'op' | 'rating'>('op')

  const data = useMemo(() => {
    const a = generateOpCurve(ccA, lampA)
    const b = generateOpCurve(ccB, lampB)
    return a.map((p, i) => ({
      score: p.score,
      a: mode === 'op' ? p.op : p.rating,
      b: mode === 'op' ? b[i].op : b[i].rating,
    }))
  }, [ccA, ccB, lampA, lampB, mode])

  const crossovers = useMemo(
    () => (mode === 'op' && lampA === lampB ? findOpCrossovers(ccA, ccB, lampA) : []),
    [ccA, ccB, lampA, lampB, mode],
  )

  return (
    <div>
      <div className="toggle-row">
        <button
          type="button"
          className={`chip ${mode === 'op' ? 'active' : ''}`}
          onClick={() => setMode('op')}
        >
          OVER POWER
        </button>
        <button
          type="button"
          className={`chip ${mode === 'rating' ? 'active' : ''}`}
          onClick={() => setMode('rating')}
        >
          Rating
        </button>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid stroke="rgba(12,26,36,0.08)" strokeDasharray="3 3" />
            <XAxis
              dataKey="score"
              type="number"
              domain={[SCORE_BORDERS.S, SCORE_BORDERS.MAX]}
              ticks={TICKS}
              tickFormatter={formatScoreTick}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              domain={['auto', 'auto']}
              width={48}
            />
            <Tooltip
              formatter={(value) =>
                typeof value === 'number' ? value.toFixed(3) : String(value ?? '')
              }
              labelFormatter={(label) => `Score ${Number(label).toLocaleString()}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="a"
              name={`Chart A (${ccA.toFixed(1)})`}
              stroke="#007a85"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive
              animationDuration={700}
            />
            <Line
              type="monotone"
              dataKey="b"
              name={`Chart B (${ccB.toFixed(1)})`}
              stroke="#e85d4c"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive
              animationDuration={700}
            />
            {mode === 'op' &&
              crossovers.map((score) => {
                const pt = data.find((d) => d.score === score) ?? data.find((d) => d.score >= score)
                if (!pt) return null
                return (
                  <ReferenceDot
                    key={score}
                    x={pt.score}
                    y={pt.a}
                    r={5}
                    fill="#e8a317"
                    stroke="#0c1a24"
                  />
                )
              })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {mode === 'op' && (
        <p className="crossovers">
          {crossovers.length === 0
            ? lampA === lampB
              ? 'No OP crossover in 975k–1010k for these constants.'
              : 'Crossover markers require matching lamps on both curves.'
            : `OP crossover score(s): ${crossovers.map((s) => s.toLocaleString()).join(', ')}`}
        </p>
      )}
    </div>
  )
}
