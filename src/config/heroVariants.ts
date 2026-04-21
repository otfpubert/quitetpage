export type HeroId = 'split' | 'centered' | 'full-image';

export type HeroDef = {
  id: HeroId;
  name: string;
  description: string;
};

export const heroVariants: HeroDef[] = [
  {
    id: 'split',
    name: 'Split',
    description: 'Tekst po lewej, zdjęcie po prawej. Klasyczny układ korporacyjny.',
  },
  {
    id: 'centered',
    name: 'Centered',
    description: 'Tekst i CTA wyśrodkowane, tło w gradiencie. Minimalistyczny.',
  },
  {
    id: 'full-image',
    name: 'Full image',
    description: 'Pełnoekranowe zdjęcie w tle z overlayem. Premium vibe.',
  },
];

export const DEFAULT_HERO: HeroId = 'split';

export const heroById = (id: string | null | undefined): HeroDef =>
  heroVariants.find((h) => h.id === id) ?? heroVariants[0];
