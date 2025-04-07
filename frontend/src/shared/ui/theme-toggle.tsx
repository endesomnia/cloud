'use client'

import { useTheme } from '@src/shared/context/themeContext';
import { Sun, Moon } from 'lucide-react';
import { Button } from './button';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  className?: string;
  iconOnly?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
}

export const ThemeToggle = ({ 
  className = '', 
  iconOnly = false,
  variant = 'outline' 
}: ThemeToggleProps) => {
  const { theme, toggleTheme, isMounted } = useTheme();
  
  if (!isMounted) return <div className={`h-9 w-9 ${className}`}></div>;
  
  const isDark = theme === 'dark';
  
  return (
    <Button
      variant={variant}
      size="icon"
      onClick={toggleTheme}
      className={`relative overflow-hidden ${className} ${isDark 
        ? 'bg-[#1E293B]/70 hover:bg-[#1E293B] text-gray-300 hover:text-white' 
        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
      } theme-transition`}
      title={isDark ? 'Включить светлую тему' : 'Включить темную тему'}
    >
      <div className="relative z-10">
        {isDark ? (
          <motion.div
            initial={{ rotate: -30, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 30, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sun size={18} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ rotate: 30, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -30, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Moon size={18} />
          </motion.div>
        )}
      </div>
      
      <span className={`absolute inset-0 ${isDark 
        ? 'bg-gradient-to-r from-[#3B82F6]/0 via-[#3B82F6]/10 to-[#3B82F6]/0' 
        : 'bg-gradient-to-r from-[#F59E0B]/0 via-[#F59E0B]/10 to-[#F59E0B]/0'
      } opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x`}></span>
    </Button>
  );
}; 