export interface AccentTheme {
  id: string;
  name: string;
  hex: string;
  dim: string;
  border: string;
  glow: string;
  contrastText: string;
}

export const ACCENT_THEMES: Record<string, AccentTheme> = {
  emerald: {
    id: 'emerald',
    name: 'Emerald (Sage)',
    hex: '#83D18B',
    dim: 'rgba(131, 209, 139, 0.08)',
    border: 'rgba(131, 209, 139, 0.22)',
    glow: 'rgba(131, 209, 139, 0.35)',
    contrastText: '#050608'
  },
  azure: {
    id: 'azure',
    name: 'Azure (Blue)',
    hex: '#3B82F6',
    dim: 'rgba(59, 130, 246, 0.08)',
    border: 'rgba(59, 130, 246, 0.22)',
    glow: 'rgba(59, 130, 246, 0.35)',
    contrastText: '#FFFFFF'
  },
  indigo: {
    id: 'indigo',
    name: 'Indigo (Violet)',
    hex: '#6366F1',
    dim: 'rgba(99, 102, 241, 0.08)',
    border: 'rgba(99, 102, 241, 0.22)',
    glow: 'rgba(99, 102, 241, 0.35)',
    contrastText: '#FFFFFF'
  },
  cyan: {
    id: 'cyan',
    name: 'Cyan (Ocean)',
    hex: '#06B6D4',
    dim: 'rgba(6, 182, 212, 0.08)',
    border: 'rgba(6, 182, 212, 0.22)',
    glow: 'rgba(6, 182, 212, 0.35)',
    contrastText: '#050608'
  },
  teal: {
    id: 'teal',
    name: 'Teal (Mint)',
    hex: '#14B8A6',
    dim: 'rgba(20, 184, 166, 0.08)',
    border: 'rgba(20, 184, 166, 0.22)',
    glow: 'rgba(20, 184, 166, 0.35)',
    contrastText: '#050608'
  },
  amber: {
    id: 'amber',
    name: 'Amber (Gold)',
    hex: '#F59E0B',
    dim: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.22)',
    glow: 'rgba(245, 158, 11, 0.35)',
    contrastText: '#050608'
  },
  coral: {
    id: 'coral',
    name: 'Coral (Sunset)',
    hex: '#F97316',
    dim: 'rgba(249, 115, 22, 0.08)',
    border: 'rgba(249, 115, 22, 0.22)',
    glow: 'rgba(249, 115, 22, 0.35)',
    contrastText: '#FFFFFF'
  },
  rose: {
    id: 'rose',
    name: 'Rose (Magenta)',
    hex: '#F43F5E',
    dim: 'rgba(244, 63, 94, 0.08)',
    border: 'rgba(244, 63, 94, 0.22)',
    glow: 'rgba(244, 63, 94, 0.35)',
    contrastText: '#FFFFFF'
  }
};

export const ACCENT_STORAGE_KEY = 'synapseiq_accent_color';

export const applyAccentTheme = (themeIdOrHex: string) => {
  // Find matching theme by ID or Hex, default to emerald
  const theme = Object.values(ACCENT_THEMES).find(
    (t) => t.id === themeIdOrHex || t.hex.toLowerCase() === themeIdOrHex.toLowerCase()
  ) || ACCENT_THEMES.emerald;

  const root = document.documentElement;
  root.style.setProperty('--color-accent-sage', theme.hex);
  root.style.setProperty('--color-accent-sage-dim', theme.dim);
  root.style.setProperty('--color-accent-sage-border', theme.border);
  root.style.setProperty('--color-accent-sage-glow', theme.glow);
  root.style.setProperty('--color-accent-contrast-text', theme.contrastText);

  try {
    localStorage.setItem(ACCENT_STORAGE_KEY, theme.id);
  } catch (e) {
    console.warn('Unable to persist accent theme to localStorage:', e);
  }

  return theme;
};

export const initAccentTheme = () => {
  let saved = 'emerald';
  try {
    const storedSettings = localStorage.getItem('synapseiq_enterprise_settings');
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings);
      if (parsed.accentColor) saved = parsed.accentColor;
    } else {
      const direct = localStorage.getItem(ACCENT_STORAGE_KEY);
      if (direct) saved = direct;
    }
  } catch (e) {
    // fallback to default emerald
  }
  return applyAccentTheme(saved);
};
