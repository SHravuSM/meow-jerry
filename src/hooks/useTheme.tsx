
import { useState, useEffect } from 'react';
import { FontStyle, Theme } from '@/components/ThemeSelector';

export function useTheme() {
  // Initialize from localStorage or use defaults
  const [font, setFont] = useState<FontStyle>(() => {
    const savedFont = localStorage.getItem('typewild-font');
    return (savedFont as FontStyle) || 'jetbrains-mono';
  });
  
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('typewild-theme');
    return (savedTheme as Theme) || 'light';
  });

  // Update localStorage and document class when font changes
  useEffect(() => {
    localStorage.setItem('typewild-font', font);
    document.documentElement.classList.remove('font-inter', 'font-jetbrains-mono', 'font-roboto-mono', 'font-space-mono');
    document.documentElement.classList.add(`font-${font}`);
  }, [font]);

  // Update localStorage and document class when theme changes
  useEffect(() => {
    localStorage.setItem('typewild-theme', theme);
    document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-sepia');
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  return {
    font,
    setFont,
    theme,
    setTheme
  };
}
