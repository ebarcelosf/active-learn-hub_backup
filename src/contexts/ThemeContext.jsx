import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('ALH_theme') || 'dark';
    } catch (err) {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ALH_theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    } catch (err) {
      console.warn('Theme storage error:', err);
    }
  }, [theme]);

  function toggleTheme() {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }

  function setThemeMode(mode) {
    if (mode === 'dark' || mode === 'light') {
      setTheme(mode);
    }
  }

  const value = {
    theme,
    toggleTheme,
    setThemeMode,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
