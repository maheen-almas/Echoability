export type Theme = {
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    surfaceAlt: string;
    surfaceElevated: string;
    text: string;
    textMuted: string;
    textOnPrimary: string;
    textOnSecondary: string;
    border: string;
    borderLight: string;
    dyslexia: string;
    autism: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  typography: {
    fontFamily: string;
    fontFamilyBold: string;
    fontSizeXs: number;
    fontSizeSm: number;
    fontSizeMd: number;
    fontSizeLg: number;
    fontSizeXl: number;
    fontSizeXxl: number;
    lineHeightBody: number;
    lineHeightHeading: number;
  };
  surfaces: {
    card: {
      backgroundColor: string;
      borderRadius: number;
      padding: number;
    };
    elevated: {
      backgroundColor: string;
      borderRadius: number;
      padding: number;
    };
  };
};

const baseColors = {
  primary: '#4F86F7',
  primaryLight: '#7AA7FF',
  primaryDark: '#2D63E6',
  secondary: '#2EC4B6',
  secondaryLight: '#5DD9CC',
  accent: '#FF9F1C',
  success: '#06D6A0',
  warning: '#FFD166',
  error: '#EF476F',
  info: '#4F86F7',
  background: '#F7F9FC',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF2F8',
  surfaceElevated: '#FFFFFF',
  text: '#1A2B4A',
  textMuted: '#6B7A99',
  textOnPrimary: '#FFFFFF',
  textOnSecondary: '#FFFFFF',
  border: '#E1E8F0',
  borderLight: '#EFF3F8',
  dyslexia: '#4F86F7',
  autism: '#2EC4B6',
};

export const lightTheme: Theme = {
  colors: baseColors,
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radius: { sm: 8, md: 16, lg: 24, xl: 32, full: 9999 },
  typography: {
    fontFamily: 'System',
    fontFamilyBold: 'System',
    fontSizeXs: 12,
    fontSizeSm: 14,
    fontSizeMd: 16,
    fontSizeLg: 20,
    fontSizeXl: 26,
    fontSizeXxl: 34,
    lineHeightBody: 24,
    lineHeightHeading: 30,
  },
  surfaces: {
    card: { backgroundColor: baseColors.surface, borderRadius: 16, padding: 16 },
    elevated: { backgroundColor: baseColors.surfaceElevated, borderRadius: 24, padding: 20 },
  },
};

export const highContrastTheme: Theme = {
  ...lightTheme,
  colors: {
    ...baseColors,
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceAlt: '#F0F4FA',
    text: '#000000',
    textMuted: '#222222',
    border: '#000000',
    borderLight: '#444444',
    primary: '#0033CC',
    primaryDark: '#001A66',
    secondary: '#006644',
    accent: '#B85C00',
    error: '#B00020',
    success: '#006633',
  },
};

export type LearningMode = 'dyslexia' | 'autism';

export const modeColor = (mode: LearningMode): string =>
  mode === 'autism' ? baseColors.autism : baseColors.dyslexia;
