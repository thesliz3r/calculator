import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-accent-primary bg-opacity-10 hover:bg-opacity-20 transition-colors"
    >
      {theme === 'dark' ? (
        <Moon className="w-5 h-5 text-accent-primary" />
      ) : (
        <Sun className="w-5 h-5 text-accent-primary" />
      )}
    </button>
  );
}; 