// Design System Tokens — Single source of truth for all design values
// Every component must import from here, never hardcode values

export const colors = {
  primary: '#123C3E',
  'primary-hover': '#092A2C',
  'primary-container': '#1D5B5D',
  'primary-fixed': '#D7F2EC',
  'primary-fixed-dim': '#A7D9D0',
  'on-primary': '#ffffff',
  'on-primary-container': '#D5FAFF',
  'on-primary-fixed': '#001F23',
  'on-primary-fixed-variant': '#004F56',
  'inverse-primary': '#7AD4DF',

  accent: '#EF7F3C',
  'accent-hover': '#D65D20',
  'on-accent': '#ffffff',

  secondary: '#123C3E',
  'secondary-container': '#E4F0EC',
  'secondary-fixed': '#B1EFD8',
  'secondary-fixed-dim': '#96D3BD',
  'on-secondary': '#ffffff',
  'on-secondary-container': '#084850',
  'on-secondary-fixed': '#002118',
  'on-secondary-fixed-variant': '#0D503F',

  tertiary: '#943742',
  'tertiary-container': '#B34F59',
  'tertiary-fixed': '#FFDADB',
  'tertiary-fixed-dim': '#FFB2B6',
  'on-tertiary': '#ffffff',
  'on-tertiary-container': '#FFF0F0',
  'on-tertiary-fixed': '#40000D',
  'on-tertiary-fixed-variant': '#7F2833',

  error: '#BA1A1A',
  'error-container': '#FFDAD6',
  'error-vivid': '#DC2626',
  'on-error': '#ffffff',
  'on-error-container': '#93000A',

  background: '#F6F5F0',
  surface: '#FFFFFF',
  'surface-bright': '#FFFFFF',
  'surface-dim': '#D8DADA',
  'surface-variant': '#E4E8E8',
  'surface-tint': '#0B5F66',
  'surface-container-lowest': '#FFFFFF',
  'surface-container-low': '#F0F2EC',
  'surface-container': '#E9ECE4',
  'surface-container-high': '#E2E7DE',
  'surface-container-highest': '#DAE0D7',
  footer: '#102E30',
  'on-footer': '#E8F0F1',
  'on-footer-muted': '#A8BEC1',

  'on-background': '#12181A',
  'on-surface': '#12181A',
  'on-surface-variant': '#596567',
  'inverse-surface': '#1A2426',
  'inverse-on-surface': '#EFF1F1',

  outline: '#899495',
  'outline-variant': '#D9DED5',

  'deep-teal': '#092A2C',
  'soft-mint': '#E4F0EC',
  'warm-gray': '#5C6B6D',
  'clean-white': '#FFFFFF',
  'sale-red': '#DC2626',

  'azure-vibrant': '#123C3E',
  'ice-wash': '#F6F5F0',
  'sky-accent': '#EF7F3C',
  'slate-text': '#12181A',
} as const;

export const spacing = {
  base: '4px',
  xs: '8px',
  sm: '16px',
  md: '24px',
  gutter: '24px',
  lg: '48px',
  xl: '80px',
  'margin-mobile': '24px',
  'margin-desktop': '48px',
} as const;

export const borderRadius = {
  sm: '10px',
  DEFAULT: '14px',
  md: '18px',
  lg: '24px',
  xl: '32px',
  full: '9999px',
} as const;

export const fontFamily = {
  display: ['Poppins', 'sans-serif'],
  headline: ['Poppins', 'sans-serif'],
  title: ['Poppins', 'sans-serif'],
  body: ['Inter', 'sans-serif'],
  label: ['Inter', 'sans-serif'],
} as const;

export const fontSize = {
  h1: ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
  h2: ['32px', { lineHeight: '40px', letterSpacing: '-0.015em', fontWeight: '700' }],
  h3: ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
  h4: ['20px', { lineHeight: '28px', fontWeight: '600' }],
  h5: ['18px', { lineHeight: '26px', fontWeight: '600' }],
  h6: ['16px', { lineHeight: '24px', fontWeight: '600' }],
  body: ['16px', { lineHeight: '24px', fontWeight: '400' }],
  caption: ['12px', { lineHeight: '16px', fontWeight: '500' }],
  'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
  'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '700' }],
  'headline-lg-mobile': ['28px', { lineHeight: '36px', fontWeight: '700' }],
  'title-md': ['20px', { lineHeight: '28px', fontWeight: '600' }],
  'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
  'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
  'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.02em', fontWeight: '600' }],
  'label-sm': ['12px', { lineHeight: '16px', fontWeight: '500' }],
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(12, 46, 50, 0.06)',
  md: '0 4px 16px rgba(12, 46, 50, 0.08)',
  lg: '0 12px 32px -8px rgba(12, 46, 50, 0.14)',
  card: '0 1px 2px rgba(12, 46, 50, 0.05), 0 4px 16px rgba(12, 46, 50, 0.06)',
  'card-hover': '0 10px 28px rgba(12, 46, 50, 0.12)',
  'primary-glow': '0 4px 14px 0 rgba(11, 95, 102, 0.28)',
  'azure-glow': '0 4px 14px 0 rgba(11, 95, 102, 0.28)',
} as const;
