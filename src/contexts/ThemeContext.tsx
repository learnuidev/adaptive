import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'beige' | 'dark' | 'rose';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('adaptive-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('adaptive-theme', theme);
    
    // Remove all theme classes
    document.documentElement.classList.remove('light', 'beige', 'dark', 'rose');
    
    // Add the current theme class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'beige') {
      document.documentElement.classList.add('beige');
    } else if (theme === 'rose') {
      document.documentElement.classList.add('rose');
    }
  }, [theme]);

  const value = { theme, setTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};