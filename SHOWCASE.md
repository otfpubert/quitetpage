# Landing — Showcase & Wybór motywu

Dokument opisuje dodatkową warstwę projektu: **landing showcase**, który służy jako narzędzie prezentacyjne przed finalnym wdrożeniem strony HR. Klient wchodzi na `/`, czyta listę planowanych funkcji, wybiera wariant Hero i motyw kolorystyczny, widzi live-podgląd, a następnie potwierdza wybór.

## 1. Cel

- Pokazać klientowi zakres funkcji, które są planowane (źródło prawdy: [PLAN.md](PLAN.md))
- Dać możliwość porównania 3 wariantów Hero obok siebie
- Dać możliwość przełączenia 5 gotowych motywów kolorystycznych z podglądem na żywo
- Zebrać decyzję (wariant + motyw) w formie do przekazania deweloperowi

Landing **nie jest** docelową stroną HR — pełna demonstracyjna wersja strony HR jest dostępna pod `/preview`.

## 2. Struktura routingu

| Ścieżka | Zawartość |
|---------|-----------|
| `/` | Landing showcase (lista funkcji + picker wariantów + picker motywu + live preview) |
| `/preview` | Pełna demonstracyjna strona HR (obecny layout: Hero, Services, HowWeWork, WhyUs, Testimonials, FAQ, Contact, Footer) |
| `/preview?hero=<id>&theme=<id>` | Ta sama strona, ale z wymuszonym wariantem Hero i motywem przekazanymi w query stringu |

## 3. Sekcje landingu

```
NAVBAR (prosty — logo + link "Podgląd pełnej strony")
│
├── HERO LANDINGU
│   "Wybierz wygląd swojej strony"
│   Podtytuł: krótki opis, po co ten krok
│
├── PLANOWANE FUNKCJE
│   Siatka kart, każda karta = jedna funkcja z PLAN.md
│   Źródło: statyczna lista w kodzie, synchronizowana ręcznie z PLAN.md sekcja 3.1
│
├── WYBÓR WARIANTU HERO
│   3 karty obok siebie — każda to miniatura wariantu Hero
│   Kliknięcie karty = zaznaczenie wariantu (aktywny wariant podświetlony)
│
├── WYBÓR MOTYWU KOLORYSTYCZNEGO
│   5 "swatchy" — każdy motyw pokazany jako próbka 3 kolorów (primary/secondary/accent) + nazwa
│   Kliknięcie = natychmiastowa zmiana CSS variables na całej stronie
│
├── LIVE PREVIEW
│   Osadzony iframe z /preview?hero=<id>&theme=<id>
│   Przełączniki desktop/tablet/mobile (zmiana szerokości iframe)
│   Ponownie renderowany przy każdej zmianie
│
└── CTA + PODSUMOWANIE WYBORU
    Informacja jaki wariant + motyw wybrano
    Przycisk "Otwórz pełny podgląd w nowej karcie" → /preview?hero=...&theme=...
```

## 4. Motywy kolorystyczne (presety)

Źródło: PLAN.md sekcja 4.2. Definicje w `src/config/themes.ts`.

| ID | Nazwa | Primary | Secondary | Accent | Surface | Tekst |
|----|-------|---------|-----------|--------|---------|-------|
| `corporate-blue` | Corporate Blue | `#1e3a5f` | `#0d9488` | `#f59e0b` | `#f8fafc` | `#1f2937` |
| `modern-teal` | Modern Teal | `#0f766e` | `#134e4a` | `#fbbf24` | `#f0fdfa` | `#134e4a` |
| `warm-professional` | Warm Professional | `#1e293b` | `#475569` | `#d4a373` | `#fafaf9` | `#1c1917` |
| `fresh-green` | Fresh Green | `#166534` | `#15803d` | `#84cc16` | `#f7fee7` | `#14532d` |
| `dark-premium` | Dark Premium | `#0a0a0a` | `#262626` | `#eab308` | `#171717` | `#fafafa` |

Motywy wstrzykiwane są przez data-attribute na `<html data-theme="...">` i regułę CSS:

```css
:root,
[data-theme="corporate-blue"] {
  --color-primary: #1e3a5f;
  /* ... */
}
[data-theme="modern-teal"] {
  --color-primary: #0f766e;
  /* ... */
}
```

Zmiana motywu = ustawienie `document.documentElement.dataset.theme = <id>`. Żadnej kompilacji, żadnego reloadu.

## 5. Warianty Hero

Źródło: PLAN.md sekcja 4.1, pole `heroLayout`. Definicje w `src/components/hero/`.

| ID | Nazwa | Opis |
|----|-------|------|
| `split` | Split (tekst + zdjęcie) | Obecny Hero. Tekst po lewej, zdjęcie po prawej. Klasyczny układ korporacyjny. |
| `centered` | Centered | Tekst i CTA wyśrodkowane, tło w gradiencie. Minimalistyczny, nowoczesny. |
| `full-image` | Full image | Pełnoekranowe zdjęcie tła z overlayem. Tekst nakładany na zdjęcie. Premium vibe. |

Landing wybiera wariant przez mapę:

```ts
// src/components/hero/index.ts
import HeroSplit from './HeroSplit.astro';
import HeroCentered from './HeroCentered.astro';
import HeroFullImage from './HeroFullImage.astro';

export const heroVariants = {
  split: { component: HeroSplit, name: 'Split' },
  centered: { component: HeroCentered, name: 'Centered' },
  'full-image': { component: HeroFullImage, name: 'Full image' },
} as const;
```

## 6. Mechanika live preview

- Landing trzyma state `{ heroId, themeId }` w zmiennych JS (vanilla, bez frameworka)
- Zmiana state'u:
  1. Ustawia `data-theme` na `<html>` całej strony landingu (natychmiastowa zmiana kolorów nawet na landingu)
  2. Aktualizuje `src` iframe'a na `/preview?hero=<id>&theme=<id>`
  3. Aktualizuje blok "Twój wybór" i link CTA
- `/preview` czyta query string, wybiera wariant Hero z mapy i ustawia `data-theme` na `<html>` w scripcie inline (zero flash koloru)

## 7. Deploy — GitHub Pages

### Konfiguracja projektu

- `astro.config.mjs` — dodać `site` i `base`:
  ```js
  export default defineConfig({
    site: 'https://<user>.github.io',
    base: '/<repo-name>/',
    vite: { plugins: [tailwindcss()] },
  });
  ```
- Wszystkie wewnętrzne linki muszą iść przez `import.meta.env.BASE_URL` lub `Astro.url.pathname`
- Workflow: `.github/workflows/deploy.yml` — standardowy recipe z [docs.astro.build/pages/github](https://docs.astro.build/en/guides/deploy/github/)

### Kroki

1. `git init && git add -A && git commit -m "init"`
2. `gh repo create <repo-name> --public --source=. --push`
3. W Settings → Pages ustawić Source: GitHub Actions
4. Workflow deploy.yml uruchamia się na push do `main`, buduje Astro, publikuje `dist/`
5. URL: `https://<user>.github.io/<repo-name>/`

## 8. Plan implementacji (kolejność)

1. **Dokumentacja** (ten plik) — done
2. **Refactor** obecnej strony HR → `/preview`
3. **Wydzielenie** motywów (`src/config/themes.ts`) i wariantów Hero (`src/components/hero/*.astro`)
4. **Landing** (`src/pages/index.astro`) — lista funkcji + pickery + iframe preview
5. **astro.config** z `site` + `base` dla Pages
6. **Workflow** `.github/workflows/deploy.yml`
7. **git + gh repo create + push** — publikacja

## 9. Otwarte decyzje (na później)

- Czy klient będzie mógł zmieniać fonty? (na razie jeden font — Inter)
- Czy landing zbiera wybór w formularzu i wysyła mailem? (na razie tylko podgląd)
- Czy `/preview` ma też 3 warianty Services/HowWeWork? (MVP: 1 wariant każdego poza Hero)
- Czy po wdrożeniu landing zostaje na produkcji, czy tylko do czasu wyboru? (jeśli tylko do czasu — po decyzji `/` staje się `/preview`)
