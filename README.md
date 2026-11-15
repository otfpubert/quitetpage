# CHUNITHM Rating & OVER POWER Calculator

Client-side calculator for **VERSE / X-VERSE** single-chart Rating, OVER POWER, dual-chart curves, and what-if OP deltas.

## Formulas

Authoritative sources are pinned in [`docs/FORMULAS.md`](docs/FORMULAS.md):

- [wikiwiki — Rating / OVER POWER](https://wikiwiki.jp/chunithmwiki/%E3%83%AC%E3%83%BC%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0%E3%83%BBOVER%20POWER)
- [chunithm.org — Overpower / Possession](https://chunithm.org/intermediate/overpower/#overpower-calculationdisplay-luminous_1)

## Develop

```bash
npm install
npm run dev
npm test
npm run build
```

## Stack

React + TypeScript (Vite), Vitest for pure math, Recharts for dual-curve viz.
