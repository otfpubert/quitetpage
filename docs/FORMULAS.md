# CHUNITHM Rating & OVER POWER — Formula Spec

**Ruleset pin:** VERSE ~ X-VERSE-X (LUMINOUS+ OP aggregation)  
**Sources (authoritative for this project):**

1. [wikiwiki — レーティング・OVER POWER](https://wikiwiki.jp/chunithmwiki/%E3%83%AC%E3%83%BC%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0%E3%83%BBOVER%20POWER)
2. [chunithm.org — Overpower and Possession](https://chunithm.org/intermediate/overpower/#overpower-calculationdisplay-luminous_1)

---

## 1. Chart constant

Internal difficulty `chartConstant` (e.g. `14.5`, `15.4`). Display level uses `+` when the first decimal digit is ≥ 5.

---

## 2. Single-chart Rating

Rating is defined at rank score borders and **interpolates linearly between borders**. Values ≤ 0 clamp to `0`. Cap at **SSS+**: `chartConstant + 2.15` (no further gain past 1,009,000).

| Rank | Score | Rating at border |
|------|------:|------------------|
| SSS+ | 1,009,000 | `CC + 2.15` |
| SSS  | 1,007,500 | `CC + 2.00` |
| SS+  | 1,005,000 | `CC + 1.50` |
| SS   | 1,000,000 | `CC + 1.00` |
| S+   | 990,000  | `CC + 0.60` |
| S    | 975,000  | `CC` |
| AAA  | 950,000  | `CC − 1.67` (≈) |
| AA   | 925,000  | `CC − 3.34` (≈) |
| A    | 900,000  | `CC − 5.00` |
| BBB  | 800,000  | `(CC − 5) / 2` |
| C    | 500,000  | `0` |
| below 500,000 | — | `0` |

### Implementation notes (from wikiwiki)

- **A ~ AAA** are treated as one linear segment from A:  
  `CC − 5 + (score − 900,000) / 75,000 × 5`  
  equivalently `CC − 5 + (score − 900,000) / 15,000`.  
  Table values `−1.67` / `−3.34` are rounded displays of `5/3` / `10/3`.
- **S ~ S+** share one slope from S:  
  `CC + (score − 975,000) / 25,000`  
  (at 990,000 → `+0.60`).
- Delta rates above S (wikiwiki):

| Band | Rate |
|------|------|
| SSS → SSS+ | +0.01 / 100 pts |
| SS+ → SSS | +0.01 / 50 pts |
| SS → SS+ | +0.01 / 100 pts |
| S → SS | +0.01 / 250 pts |

### Player total Rating (VERSE~)

```
Total Rating = (Σ Best30 chart ratings + Σ New20 chart ratings) / 50
```

- **Best 30:** top 30 all-time unique charts by single-chart rating.
- **New 20:** top 20 charts from current-version new songs.
- Best and New frames **do not share** the same chart; a new-song chart that would also qualify for Best goes into New only (wikiwiki).
- Existing-song **ULTIMA** charts added in a new version do **not** enter New 20.
- Within a version, total rating does not drop; it can drop on version change when New 20 resets.

---

## 3. Single-chart OVER POWER

### Lamp bonus (補正1)

| Lamp | Bonus |
|------|------:|
| NONE / CLEAR | 0.00 |
| FC | 0.50 |
| AJ | 1.00 |
| AJC | 1.25 |

Lamp is **independent of the current high score** once earned (wikiwiki notes this as community understanding).

### Piecewise OP

| Score | OP |
|------:|----|
| `≤ 1,007,500` | `chartRating(CC, score) × 5 + lampBonus` |
| `1,007,501 … 1,009,999` | `(CC + 2) × 5 + lampBonus + (score − 1,007,500) × 0.0015` |
| `1,010,000` (AJC / theoretical max) | `(CC + 3) × 5` |

`補正2 = (score − 1,007,500) × 0.0015` (max 3.75 from SSS to AJC).

Unlike Rating, OP **keeps growing past SSS+** until 1,010,000.

### Worked example (wikiwiki)

```
CC = 15.4, score = 1,009,540, lamp = AJ
base = (15.4 + 2) × 5 = 87.00
補正2 = (1,009,540 − 1,007,500) × 0.0015 = 3.06
OP = 87.00 + 1.00 + 3.06 = 91.06
```

### Chart theoretical max OP

```
maxOp(CC) = (CC + 3) × 5
```

---

## 4. Aggregate OVER POWER (LUMINOUS+~)

Per [chunithm.org](https://chunithm.org/intermediate/overpower/#overpower-calculationdisplay-luminous_1) and wikiwiki:

- For each **song**, take the **single difficulty with the highest OP** (lower difficulty can beat a weak higher difficulty).
- Sum those song maxima → **Total OP**.
- Theoretical max for a song uses the **highest available difficulty’s** AJC OP.
- Unlocked songs only for NET totals (wikiwiki footnote: exclude locked + challenge-folder-only entries).
- **HOT OVER POWER:** same rules, restricted to current-version new songs (VERSE+).

```
Total OP % = Total OP / Σ_songs maxOp(highestCC(song)) × 100
```

OP % color bands (wikiwiki): white &lt;70, silver 70–79.99, gold 80–89.99, platinum 90–94.99, rainbow 95–100.

---

## 5. Possession (VERSE ~ X-VERSE-X)

From chunithm.org (aligned with wikiwiki VERSE～X-VERSE-X history). Rank gate is **minimum rank on every MASTER + ULTIMA chart**.

| Plate | Rating | Min M/U rank | OP % |
|-------|-------:|--------------|-----:|
| Silver | ≥ 16.00 | S | — |
| Gold | ≥ 16.00 | S+ | ≥ 97.50% |
| Platinum | ≥ 16.00 | SS | ≥ 99.00% |
| Rainbow | ≥ 16.00 | SSS | ≥ 99.50% |

> **Note:** Mate later relaxed M/U rank gates (Gold→S, Plat→S+, Rainbow→SS). This app pins **X-VERSE-X** unless config says otherwise.

Possession uses overall song OP % (wikiwiki: 全楽曲の OVER POWER 合計). Display is suppressed when Rating display is OFF; OP display OFF still shows possession.

---

## 6. Open implementation choices (not fixed by sources)

| Topic | Default for this app |
|-------|----------------------|
| Display truncation of rating | Show 2 decimals (floor toward zero for display); OP math uses raw rating before display truncate |
| OP quantum | Compute full float; optionally floor to 0.005 when matching NET (RemyWiki; **not** stated on the two pinned pages) |
| Chart DB / import | Manual CC + score entry first; catalog import later |
| WORLD'S END | Excluded from standard Rating/OP calculator views |
