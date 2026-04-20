import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { VisualizationTokens } from './tokens';
import { midnight } from './presets/midnight';

const ThemeContext = createContext<VisualizationTokens>(midnight);

export function useTheme(): VisualizationTokens {
  return useContext(ThemeContext);
}

export interface ThemeProviderProps {
  theme: VisualizationTokens;
  children: ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const value = useMemo(() => theme, [theme]);
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
