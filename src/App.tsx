import { useMemo, useState } from 'react'
import './App.css'
import { DualChartVisualizer } from './components/DualChartVisualizer'
import { simulateDeltas } from './lib/curves'
import {
  calculateChartOp,
  calculateChartRating,
  formatRating,
  getScoreRank,
  LAMP_BONUS,
  maxTheoreticalOp,
} from './lib'
import type { ClearLamp } from './lib/types'

const LAMPS: ClearLamp[] = ['NONE', 'CLEAR', 'FC', 'AJ', 'AJC']

function num(v: string, fallback: number): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

export default function App() {
  const [ccA, setCcA] = useState('15.4')
  const [scoreA, setScoreA] = useState('1009540')
  const [lampA, setLampA] = useState<ClearLamp>('AJ')

  const [ccB, setCcB] = useState('15.0')
  const [scoreB, setScoreB] = useState('1007500')
  const [lampB, setLampB] = useState<ClearLamp>('FC')

  const [targetScore, setTargetScore] = useState('1010000')
  const [targetLamp, setTargetLamp] = useState<ClearLamp>('AJC')
  const [bestSongOp, setBestSongOp] = useState('0')
  const [theoMax, setTheoMax] = useState('141780')

  const a = useMemo(() => {
    const cc = num(ccA, 15.4)
    const score = num(scoreA, 0)
    const rating = calculateChartRating(cc, score)
    const op = calculateChartOp(cc, score, lampA)
    return { cc, score, rating, op, rank: getScoreRank(score), maxOp: maxTheoreticalOp(cc) }
  }, [ccA, scoreA, lampA])

  const b = useMemo(() => {
    const cc = num(ccB, 15.0)
    const score = num(scoreB, 0)
    const rating = calculateChartRating(cc, score)
    const op = calculateChartOp(cc, score, lampB)
    return { cc, score, rating, op, rank: getScoreRank(score), maxOp: maxTheoreticalOp(cc) }
  }, [ccB, scoreB, lampB])

  const sim = useMemo(
    () =>
      simulateDeltas({
        chartConstant: a.cc,
        currentScore: a.score,
        currentLamp: lampA,
        targetScore: num(targetScore, a.score),
        targetLamp,
        currentBestSongOp: num(bestSongOp, 0) || a.op,
        totalTheoreticalMaxOp: num(theoMax, 1),
      }),
    [a.cc, a.score, a.op, lampA, targetScore, targetLamp, bestSongOp, theoMax],
  )

  return (
    <div className="app">
      <header className="hero">
        <h1 className="brand">
          CHUNI<span>THM</span>
        </h1>
        <p className="hero-copy">
          Rating &amp; OVER POWER calculator for VERSE / X-VERSE — single-chart math,
          dual-curve compare, and what-if OP deltas.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#calculator">
            Open calculator
          </a>
          <a className="btn btn-ghost" href="#compare">
            Compare charts
          </a>
        </div>
      </header>

      <section className="panel" id="calculator">
        <h2>Single-chart calc</h2>
        <p className="lede">
          Enter chart constant, score, and lamp. OP uses wikiwiki piecewise rules;
          rating caps at CC+2.15.
        </p>

        <div className="grid-2">
          <ChartInputs
            title="Chart A"
            cc={ccA}
            score={scoreA}
            lamp={lampA}
            onCc={setCcA}
            onScore={setScoreA}
            onLamp={setLampA}
          />
          <ChartInputs
            title="Chart B"
            cc={ccB}
            score={scoreB}
            lamp={lampB}
            onCc={setCcB}
            onScore={setScoreB}
            onLamp={setLampB}
          />
        </div>

        <div className="results">
          <div className="stat">
            <div className="k">Chart A Rating</div>
            <div className="v accent">{formatRating(a.rating)}</div>
            <div className="k">{a.rank} · max OP {a.maxOp.toFixed(2)}</div>
          </div>
          <div className="stat">
            <div className="k">Chart A OVER POWER</div>
            <div className="v">{a.op.toFixed(3)}</div>
            <div className="k">lamp +{LAMP_BONUS[lampA].toFixed(2)}</div>
          </div>
          <div className="stat">
            <div className="k">Chart B OVER POWER</div>
            <div className="v">{b.op.toFixed(3)}</div>
            <div className="k">
              rating {formatRating(b.rating)} · {b.rank}
            </div>
          </div>
        </div>
      </section>

      <section className="panel" id="compare">
        <h2>Dual-chart curves</h2>
        <p className="lede">
          Curves render as soon as two constants are set (975k–1010k). Toggle OP vs
          Rating; crossover markers appear when lamps match.
        </p>
        <DualChartVisualizer ccA={a.cc} ccB={b.cc} lampA={lampA} lampB={lampB} />
      </section>

      <section className="panel" id="what-if">
        <h2>What-if (Chart A)</h2>
        <p className="lede">
          Song-level OP yield uses max(0, simulated − current best song OP). Set
          theoretical max to project total OP% delta.
        </p>
        <div className="grid-2">
          <div className="field">
            <label htmlFor="target-score">Target score</label>
            <input
              id="target-score"
              inputMode="numeric"
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="target-lamp">Target lamp</label>
            <select
              id="target-lamp"
              value={targetLamp}
              onChange={(e) => setTargetLamp(e.target.value as ClearLamp)}
            >
              {LAMPS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="best-song-op">Current best song OP</label>
            <input
              id="best-song-op"
              inputMode="decimal"
              value={bestSongOp}
              onChange={(e) => setBestSongOp(e.target.value)}
              placeholder="defaults to Chart A OP"
            />
          </div>
          <div className="field">
            <label htmlFor="theo-max">Total theoretical max OP</label>
            <input
              id="theo-max"
              inputMode="decimal"
              value={theoMax}
              onChange={(e) => setTheoMax(e.target.value)}
            />
          </div>
        </div>
        <div className="results">
          <div className="stat">
            <div className="k">Simulated OP</div>
            <div className="v accent">{sim.simulated.toFixed(3)}</div>
          </div>
          <div className="stat">
            <div className="k">Δ chart OP</div>
            <div className="v">{sim.deltaChartOp.toFixed(3)}</div>
          </div>
          <div className="stat">
            <div className="k">Δ song OP / Δ OP%</div>
            <div className="v">
              {sim.deltaSongOp.toFixed(3)} / {sim.deltaTotalOpPercent.toFixed(4)}%
            </div>
          </div>
        </div>
      </section>

      <p className="sources">
        Formulas locked from{' '}
        <a
          href="https://wikiwiki.jp/chunithmwiki/%E3%83%AC%E3%83%BC%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0%E3%83%BBOVER%20POWER"
          target="_blank"
          rel="noreferrer"
        >
          wikiwiki
        </a>{' '}
        and{' '}
        <a
          href="https://chunithm.org/intermediate/overpower/#overpower-calculationdisplay-luminous_1"
          target="_blank"
          rel="noreferrer"
        >
          chunithm.org
        </a>
        . See <code>docs/FORMULAS.md</code>.
      </p>
    </div>
  )
}

function ChartInputs(props: {
  title: string
  cc: string
  score: string
  lamp: ClearLamp
  onCc: (v: string) => void
  onScore: (v: string) => void
  onLamp: (v: ClearLamp) => void
}) {
  const id = props.title.replace(/\s+/g, '-').toLowerCase()
  return (
    <div>
      <strong>{props.title}</strong>
      <div className="grid-2" style={{ marginTop: '0.65rem' }}>
        <div className="field">
          <label htmlFor={`${id}-cc`}>Chart constant</label>
          <input
            id={`${id}-cc`}
            inputMode="decimal"
            value={props.cc}
            onChange={(e) => props.onCc(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor={`${id}-score`}>Score</label>
          <input
            id={`${id}-score`}
            inputMode="numeric"
            value={props.score}
            onChange={(e) => props.onScore(e.target.value)}
          />
        </div>
        <div className="field" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor={`${id}-lamp`}>Clear lamp</label>
          <select
            id={`${id}-lamp`}
            value={props.lamp}
            onChange={(e) => props.onLamp(e.target.value as ClearLamp)}
          >
            {LAMPS.map((l) => (
              <option key={l} value={l}>
                {l} (+{LAMP_BONUS[l].toFixed(2)})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
