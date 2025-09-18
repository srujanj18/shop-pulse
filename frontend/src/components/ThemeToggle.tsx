import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  size = 'md',
  variant = 'ghost'
}) => {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={toggleTheme}
      className={`${sizeClasses[size]} ${className} transition-all duration-200 hover:scale-105`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon 
          size={iconSizes[size]} 
          className="transition-transform duration-200 hover:rotate-12" 
        />
      ) : (
        <Sun 
          size={iconSizes[size]} 
          className="transition-transform duration-200 hover:rotate-12" 
        />
      )}
    </Button>
  );
};

// Compact version for headers/navbars
export const CompactThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon size={18} className="text-gray-600 dark:text-gray-400" />
      ) : (
        <Sun size={18} className="text-gray-600 dark:text-gray-400" />
      )}
    </button>
  );
}; 