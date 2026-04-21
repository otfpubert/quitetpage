# Plan strony internetowej — Usługi kadrowo-płacowe

## 1. Cel projektu

Stworzenie profesjonalnej, nowoczesnej strony internetowej dla firmy oferującej usługi kadrowo-płacowe. Strona ma pełnić rolę wizytówki firmy, prezentować ofertę i umożliwiać kontakt potencjalnym klientom.

---

## 2. Stack technologiczny

| Warstwa | Technologia | Uzasadnienie |
|---------|-------------|--------------|
| Framework | **Astro** | Generuje statyczny HTML — szybki, lekki, doskonałe SEO. Obsługuje Markdown jako źródło treści. |
| Styling | **Tailwind CSS** | Szybkie prototypowanie, łatwe tworzenie wariantów motywów, responsywność out-of-the-box. |
| Animacje | **AOS (Animate on Scroll)** | Lekka biblioteka, eleganckie efekty pojawiania się elementów przy scrollowaniu. Opcjonalnie: subtelne CSS transitions na hover. |
| Treści | **Markdown / MDX** | Pliki `.md` edytowalne w dowolnym edytorze tekstu — osoba nietechniczna nie musi znać kodu. |
| Formularz kontaktowy | **Resend** lub **EmailJS** | Wysyłka maili bez własnego backendu. Integracja przez API. |
| Antyspam | **hCaptcha** | Darmowy, RODO-friendly (serwery w UE), skuteczny. Alternatywa: Cloudflare Turnstile. |
| Zdjęcia | **Unsplash / Pexels** | Darmowe stockowe zdjęcia z licencją komercyjną. |
| Ikony | **Lucide** lub **Heroicons** | Lekkie, spójne zestawy ikon SVG. |
| Deploy | **Netlify** lub **Vercel** | Darmowy hosting, automatyczny deploy z Git, HTTPS, CDN. |

### Alternatywy do rozważenia
- **Next.js** zamiast Astro — jeśli w przyszłości strona miałaby rozrosnąć się w aplikację (panel klienta, logowanie)
- **Svelte** — lżejszy od Reacta, dobry dla prostych stron z interaktywnymi elementami
- **Plain HTML + Tailwind** — najprostsze rozwiązanie, ale trudniejsze w utrzymaniu przy wielu podstronach

---

## 3. Struktura strony

### 3.1 Strona główna (one-page z sekcjami + podstrony szczegółowe)

```
NAWIGACJA (sticky)
│
├── HERO
│   Nagłówek + podtytuł + przycisk CTA ("Skontaktuj się" / "Poznaj ofertę")
│   Tło: stockowe zdjęcie biurowe lub gradient + grafika
│
├── O NAS
│   Krótki opis firmy, misja, doświadczenie
│   Zdjęcie zespołu lub ikona/ilustracja
│
├── USŁUGI
│   Karty z ikonami — każda karta to osobna usługa
│   Kliknięcie → podstrona z pełnym opisem
│   Przykładowe kategorie (placeholder):
│   • Obsługa kadrowa
│   • Obsługa płacowa
│   • Outsourcing HR
│   • BHP i szkolenia
│   • Doradztwo prawne
│
├── JAK DZIAŁAMY
│   Wizualny stepper / timeline (3-5 kroków)
│   np. Kontakt → Analiza potrzeb → Oferta → Wdrożenie → Stała obsługa
│
├── PAKIETY / CENNIK (opcjonalnie)
│   Tabela porównawcza 2-3 wariantów współpracy
│   Albo tekst "Wycena indywidualna — skontaktuj się"
│
├── DLACZEGO MY
│   Wyróżniki firmy w formie ikon + krótkich opisów
│   np. Terminowość, Dedykowany opiekun, Bezpieczeństwo danych, Doświadczenie
│
├── OPINIE KLIENTÓW
│   Karuzela / siatka z testimonialami
│   Opcjonalnie: integracja z opiniami Google
│
├── FAQ
│   Accordion z najczęściej zadawanymi pytaniami
│
├── KONTAKT
│   Formularz (imię, email, telefon, wiadomość + captcha)
│   Dane kontaktowe firmy obok formularza
│   Opcjonalnie: embed mapy Google
│
└── FOOTER
    Dane firmy, NIP, REGON, KRS
    Linki: Polityka prywatności, Regulamin
    Social media (jeśli są)
    Copyright
```

### 3.2 Podstrony

| Ścieżka | Zawartość |
|----------|-----------|
| `/uslugi/[slug]` | Szczegółowy opis każdej usługi (z pliku Markdown) |
| `/o-nas` | Rozszerzone informacje o firmie |
| `/kontakt` | Pełny formularz kontaktowy + mapa |
| `/polityka-prywatnosci` | Polityka prywatności i RODO |
| `/regulamin` | Regulamin strony |

---

## 4. System motywów i modularność

### 4.1 Konfiguracja motywu

Plik `theme.config.ts` z ustawieniami:

```typescript
export const theme = {
  // Kolory
  colors: {
    primary: '#1e40af',    // niebieski — profesjonalizm
    secondary: '#0f766e',  // teal — zaufanie
    accent: '#f59e0b',     // amber — CTA
    background: '#ffffff',
    text: '#1f2937',
  },

  // Wariant hero
  heroLayout: 'split',  // 'centered' | 'split' | 'full-image' | 'gradient'

  // Wariant kart usług
  servicesLayout: 'grid',  // 'grid' | 'list' | 'carousel'

  // Font
  font: 'Inter',  // 'Inter' | 'Plus Jakarta Sans' | 'DM Sans'

  // Zaokrąglenia
  borderRadius: 'md',  // 'none' | 'sm' | 'md' | 'lg' | 'full'
}
```

### 4.2 Propozycje motywów do przetestowania

| Motyw | Kolorystyka | Hero | Vibe |
|-------|------------|------|------|
| **Corporate Blue** | Niebieski + granat | Split (tekst + zdjęcie) | Klasycznie profesjonalny |
| **Modern Teal** | Teal + ciemny | Centered z gradientem | Nowoczesny, minimalistyczny |
| **Warm Professional** | Granat + złoty akcent | Full-image z overlayem | Elegancki, premium |
| **Fresh Green** | Zieleń + jasne tło | Split z ilustracją | Przyjazny, ekologiczny |
| **Dark Premium** | Ciemne tło + złoto | Full-image | Luksusowy, wyróżniający |

Każdy motyw to zmiana jednego pliku konfiguracyjnego — cały wygląd strony się przebudowuje.

---

## 5. System zarządzania treścią

### 5.1 Struktura plików z treścią

```
content/
├── hero.md              — tekst nagłówka, podtytuł, tekst przycisku
├── about.md             — opis firmy
├── services/
│   ├── _index.md        — nagłówek sekcji usług
│   ├── kadry.md         — opis usługi kadrowej
│   ├── place.md         — opis usługi płacowej
│   ├── outsourcing.md   — opis outsourcingu
│   └── bhp.md           — opis BHP
├── steps.md             — kroki współpracy
├── advantages.md        — wyróżniki firmy
├── testimonials.md      — opinie klientów
├── faq.md               — pytania i odpowiedzi
├── contact.md           — dane kontaktowe
└── legal/
    ├── privacy.md       — polityka prywatności
    └── terms.md         — regulamin
```

### 5.2 Format pliku Markdown (przykład)

```markdown
---
title: "Obsługa kadrowa"
icon: "users"
order: 1
description: "Kompleksowa obsługa kadrowa dla Twojej firmy"
---

Tutaj treść opisu usługi. Można używać **pogrubienia**,
list, nagłówków — wszystko w prostym formacie tekstowym.

## Zakres usługi

- Prowadzenie akt osobowych
- Umowy o pracę i aneksy
- Ewidencja czasu pracy
```

### 5.3 Instrukcja edycji dla osoby nietechnicznej

Do dokumentacji dołączymy prosty poradnik:
- Jak otworzyć i edytować plik `.md` (np. w Notepad++ lub VS Code)
- Podstawy formatowania Markdown (pogrubienie, lista, nagłówek)
- Gdzie dodać nową usługę (skopiuj istniejący plik, zmień treść)
- Jak wrzucić zmianę na stronę (git push lub prosty skrypt / panel Netlify CMS)

Opcjonalnie: **Netlify CMS** lub **Decap CMS** — daje prosty panel administracyjny w przeglądarce do edycji plików Markdown bez dotykania kodu.

---

## 6. Formularz kontaktowy

### 6.1 Pola formularza

| Pole | Typ | Wymagane | Walidacja |
|------|-----|----------|-----------|
| Imię i nazwisko | text | Tak | Min. 2 znaki |
| Email | email | Tak | Format email |
| Telefon | tel | Nie | Format PL (+48...) |
| Firma | text | Nie | — |
| Temat | select | Tak | Lista predefiniowana |
| Wiadomość | textarea | Tak | Min. 10 znaków |
| Zgoda RODO | checkbox | Tak | Musi być zaznaczony |
| hCaptcha | widget | Tak | Token walidowany server-side |

### 6.2 Obsługa techniczna

1. Użytkownik wypełnia formularz i rozwiązuje captchę
2. Formularz wysyła dane przez API (Resend / EmailJS)
3. Mail trafia na skonfigurowany adres firmowy
4. Użytkownik widzi potwierdzenie wysłania
5. Opcjonalnie: autoresponse do użytkownika ("Dziękujemy, odezwiemy się w ciągu 24h")

### 6.3 Ochrona przed spamem — warstwy

1. **hCaptcha** — główna ochrona (RODO-friendly, serwery w UE)
2. **Honeypot** — ukryte pole, które boty wypełniają a ludzie nie widzą
3. **Rate limiting** — max X wiadomości z jednego IP na godzinę (po stronie API)

---

## 7. Wymagania prawne

### 7.1 Obowiązkowe dla strony firmowej w Polsce

#### A. Dane identyfikacyjne firmy (obowiązek z ustawy o świadczeniu usług drogą elektroniczną)
Muszą być łatwo dostępne na stronie (footer lub podstrona):
- Pełna nazwa firmy
- Adres siedziby
- NIP
- REGON
- KRS (jeśli spółka zarejestrowana w KRS)
- Adres email kontaktowy
- Numer telefonu

#### B. Polityka prywatności (RODO — Rozporządzenie UE 2016/679)
Wymagana gdy strona zbiera jakiekolwiek dane osobowe (formularz, cookies, analytics). Musi zawierać:
- Kto jest administratorem danych (nazwa firmy, adres, kontakt)
- Jakie dane są zbierane i w jakim celu
- Podstawa prawna przetwarzania (zgoda, uzasadniony interes, umowa)
- Okres przechowywania danych
- Prawa użytkownika (dostęp, sprostowanie, usunięcie, przenoszenie, sprzeciw)
- Informacja o prawie wniesienia skargi do UODO
- Czy dane są przekazywane do państw trzecich (np. jeśli używamy Google Analytics)
- Informacja o zautomatyzowanym podejmowaniu decyzji (jeśli dotyczy)

#### C. Polityka cookies (Prawo telekomunikacyjne art. 173)
- **Banner cookies** — wyświetlany przy pierwszej wizycie
- Informacja jakie cookies są używane i w jakim celu
- Możliwość wyrażenia/odmowy zgody na cookies niezbędne vs analityczne vs marketingowe
- Link do pełnej polityki cookies (może być częścią polityki prywatności)

#### D. Klauzula informacyjna przy formularzu kontaktowym
Checkbox ze zgodą na przetwarzanie danych, np.:
> "Wyrażam zgodę na przetwarzanie moich danych osobowych w celu odpowiedzi na przesłane zapytanie, zgodnie z Polityką prywatności."

#### E. Regulamin strony (zalecany, nie zawsze obowiązkowy)
Zalecany gdy strona zawiera formularz lub oferuje jakiekolwiek usługi online. Powinien zawierać:
- Definicje (usługodawca, użytkownik, strona)
- Zakres usług świadczonych drogą elektroniczną
- Warunki korzystania ze strony
- Procedura reklamacyjna
- Postanowienia końcowe

### 7.2 Dodatkowe zalecenia

- **Certyfikat SSL (HTTPS)** — hosting na Netlify/Vercel zapewnia to automatycznie
- **Dostępność (WCAG)** — nie jest jeszcze obowiązkowa dla firm prywatnych w PL, ale warto stosować podstawowe zasady (kontrast, alt-texty, nawigacja klawiaturą)
- **Informacja o prawach autorskich** — copyright w footerze

### 7.3 Uwaga

> Powyższe informacje mają charakter orientacyjny. Treść polityki prywatności, regulaminu i klauzul RODO powinna być skonsultowana z prawnikiem lub inspektorem ochrony danych, aby była dostosowana do konkretnej działalności firmy.

---

## 8. Animacje i elementy wizualne

### 8.1 Animacje (AOS)

| Element | Animacja | Trigger |
|---------|----------|---------|
| Karty usług | Fade-up z delikatnym opóźnieniem kaskadowym | Scroll into view |
| Sekcja "Jak działamy" | Slide-in kolejnych kroków | Scroll into view |
| Liczniki (np. "500+ klientów") | Count-up animation | Scroll into view |
| Hero | Fade-in tekstu + slide zdjęcia | Page load |
| FAQ accordion | Smooth expand/collapse | Click |
| Nawigacja | Zmiana tła na scroll (transparent → solid) | Scroll |

### 8.2 Mikrointerakcje

- Hover na kartach usług — delikatne powiększenie + cień
- Hover na przyciskach — zmiana koloru z transition
- Focus na polach formularza — podświetlenie obramowania
- Smooth scroll do sekcji po kliknięciu w nawigację

### 8.3 Zdjęcia stockowe — propozycje tematyczne

| Sekcja | Motyw zdjęcia |
|--------|---------------|
| Hero | Biuro, profesjonalny zespół, spotkanie biznesowe |
| O nas | Zespół przy pracy, uścisk dłoni |
| Usługi | Dokumenty, laptop, ikony tematyczne |
| Kontakt | Słuchawka, biurko, kawa + notatnik |

---

## 9. SEO i wydajność

- **Meta tagi** — title, description, og:image dla każdej podstrony
- **Sitemap.xml** — generowany automatycznie przez Astro
- **Schema.org** — structured data dla LocalBusiness
- **Optymalizacja obrazów** — Astro Image (automatyczna konwersja do WebP, lazy loading)
- **Lighthouse score** — cel: 95+ we wszystkich kategoriach
- **Core Web Vitals** — statyczna strona Astro powinna mieć doskonałe wyniki

---

## 10. Plan realizacji — etapy

### Etap 1: Fundament
- [ ] Inicjalizacja projektu Astro + Tailwind
- [ ] Struktura plików i folderów
- [ ] System motywów (theme config + CSS variables)
- [ ] Layout bazowy (nawigacja + footer)

### Etap 2: Sekcje strony głównej
- [ ] Hero (z wariantami layoutu)
- [ ] O nas
- [ ] Karty usług
- [ ] Jak działamy (stepper)
- [ ] Dlaczego my
- [ ] Opinie klientów
- [ ] FAQ
- [ ] Sekcja kontakt

### Etap 3: Funkcjonalności
- [ ] Formularz kontaktowy + walidacja
- [ ] Integracja hCaptcha
- [ ] Integracja z serwisem mailowym (Resend/EmailJS)
- [ ] Animacje AOS
- [ ] Banner cookies
- [ ] Responsywność (mobile / tablet / desktop)

### Etap 4: Podstrony i treści
- [ ] System podstron usług z Markdown
- [ ] Podstrona /o-nas
- [ ] Podstrona /kontakt
- [ ] Polityka prywatności
- [ ] Regulamin

### Etap 5: Polish i deploy
- [ ] Testy na różnych przeglądarkach
- [ ] Testy responsywności
- [ ] Optymalizacja wydajności (Lighthouse)
- [ ] SEO (meta tagi, sitemap, schema.org)
- [ ] Deploy na Netlify/Vercel
- [ ] Konfiguracja domeny

### Etap 6: Motywy
- [ ] Przygotowanie 3-5 wariantów kolorystycznych
- [ ] Prezentacja motywów do wyboru
- [ ] Wdrożenie wybranego motywu

---

## 11. Otwarte pytania

- [ ] Nazwa firmy i dane do uzupełnienia
- [ ] Dokładna lista usług
- [ ] Czy potrzebny cennik na stronie, czy wycena indywidualna?
- [ ] Czy są social media do podlinkowania?
- [ ] Czy jest logo firmy?
- [ ] Preferowany serwis mailowy do formularza
- [ ] Czy potrzebny panel CMS (Decap CMS) do edycji treści przez przeglądarkę?
- [ ] Budżet na ewentualne płatne usługi (domena, hosting premium, zdjęcia premium)
