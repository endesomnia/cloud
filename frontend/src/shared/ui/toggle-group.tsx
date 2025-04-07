'use client'

import { ThemeToggle } from './theme-toggle'
import { LanguageToggle } from './language-toggle'
import { useTheme } from '@src/shared/context/themeContext'

interface ToggleGroupProps {
  className?: string
}

export const ToggleGroup = ({ className = '' }: ToggleGroupProps) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  return (
    <div 
      className={`flex items-center p-1 gap-1.5 rounded-lg ${isDark 
        ? 'bg-[#1F2937]/60 border border-[#374151]/60' 
        : 'bg-gray-100/80 border border-gray-200/80'
      } backdrop-blur-sm shadow-sm theme-transition ${className}`}
    >
      <ThemeToggle variant="ghost" className={`h-8 w-8 ${isDark ? 'bg-transparent' : 'bg-transparent'}`} />
      
      <div className={`h-5 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'} theme-transition`}></div>
      
      <LanguageToggle variant="ghost" className={`h-8 w-14 ${isDark ? 'bg-transparent' : 'bg-transparent'}`} />
    </div>
  )
} 