import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, Platform } from 'react-native';
import { highContrastTheme, lightTheme, type Theme } from './theme';

export type Settings = {
  largeText: boolean;
  highContrast: boolean;
  calmMode: boolean;
  speechEnabled: boolean;
  reducedAnimation: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  largeText: false,
  highContrast: false,
  calmMode: false,
  speechEnabled: true,
  reducedAnimation: false,
};

const STORAGE_KEY = 'echoability_settings';

type SettingsContextValue = {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
  toggle: (key: keyof Settings) => void;
  theme: Theme;
  fontScale: number;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

function loadSettings(): Settings {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      // ignore
    }
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: Settings) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateSettings = (partial: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const toggle = (key: keyof Settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const theme = useMemo<Theme>(() => {
    const base = settings.highContrast ? highContrastTheme : lightTheme;
    if (settings.largeText) {
      return {
        ...base,
        typography: {
          ...base.typography,
          fontSizeXs: 14,
          fontSizeSm: 16,
          fontSizeMd: 18,
          fontSizeLg: 24,
          fontSizeXl: 30,
          fontSizeXxl: 40,
          lineHeightBody: 28,
          lineHeightHeading: 36,
        },
      };
    }
    return base;
  }, [settings.highContrast, settings.largeText]);

  const fontScale = settings.largeText ? 1.25 : 1.0;

  const value = useMemo(
    () => ({ settings, updateSettings, toggle, theme, fontScale }),
    [settings, theme, fontScale]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
