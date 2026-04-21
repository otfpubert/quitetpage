export type ThemeId =
  | 'corporate-blue'
  | 'modern-teal'
  | 'warm-professional'
  | 'fresh-green'
  | 'dark-premium';

export type ThemeDef = {
  id: ThemeId;
  name: string;
  description: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  accent: string;
  accentLight: string;
  surface: string;
  surfaceDark: string;
};

export const themes: ThemeDef[] = [
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    description: 'Klasycznie profesjonalny — niebieski + granat.',
    primary: '#1e3a5f',
    primaryLight: '#2d5a8e',
    primaryDark: '#0f1f33',
    secondary: '#0d9488',
    secondaryLight: '#14b8a6',
    accent: '#f59e0b',
    accentLight: '#fbbf24',
    surface: '#f8fafc',
    surfaceDark: '#f1f5f9',
  },
  {
    id: 'modern-teal',
    name: 'Modern Teal',
    description: 'Nowoczesny, minimalistyczny — teal + jasne akcenty.',
    primary: '#0f766e',
    primaryLight: '#14b8a6',
    primaryDark: '#134e4a',
    secondary: '#0369a1',
    secondaryLight: '#0ea5e9',
    accent: '#fbbf24',
    accentLight: '#fde047',
    surface: '#f0fdfa',
    surfaceDark: '#ccfbf1',
  },
  {
    id: 'warm-professional',
    name: 'Warm Professional',
    description: 'Elegancki, premium — grafit + złoty akcent.',
    primary: '#1e293b',
    primaryLight: '#475569',
    primaryDark: '#0f172a',
    secondary: '#64748b',
    secondaryLight: '#94a3b8',
    accent: '#d4a373',
    accentLight: '#e8c8a0',
    surface: '#fafaf9',
    surfaceDark: '#f5f5f4',
  },
  {
    id: 'fresh-green',
    name: 'Fresh Green',
    description: 'Przyjazny, ekologiczny — zieleń + jasne tło.',
    primary: '#166534',
    primaryLight: '#22c55e',
    primaryDark: '#14532d',
    secondary: '#15803d',
    secondaryLight: '#4ade80',
    accent: '#84cc16',
    accentLight: '#a3e635',
    surface: '#f7fee7',
    surfaceDark: '#ecfccb',
  },
  {
    id: 'dark-premium',
    name: 'Dark Premium',
    description: 'Luksusowy, wyróżniający — ciemne tło + złoto.',
    primary: '#0a0a0a',
    primaryLight: '#262626',
    primaryDark: '#000000',
    secondary: '#404040',
    secondaryLight: '#737373',
    accent: '#eab308',
    accentLight: '#facc15',
    surface: '#171717',
    surfaceDark: '#0a0a0a',
  },
];

export const DEFAULT_THEME: ThemeId = 'corporate-blue';

export const themeById = (id: string | null | undefined): ThemeDef =>
  themes.find((t) => t.id === id) ?? themes[0];
