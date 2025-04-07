'use client'

import { useLanguage } from '@src/shared/context/languageContext';
import { Languages } from 'lucide-react';
import { Button } from './button';
import { motion } from 'framer-motion';

interface LanguageToggleProps {
  className?: string;
  iconOnly?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
}

export const LanguageToggle = ({ 
  className = '', 
  iconOnly = false,
  variant = 'outline' 
}: LanguageToggleProps) => {
  const { language, toggleLanguage, isMounted, t } = useLanguage();
  
  if (!isMounted) return <div className={`h-9 w-9 ${className}`}></div>;
  
  const isEn = language === 'en';
  
  return (
    <Button
      variant={variant}
      size="icon"
      onClick={toggleLanguage}
      className={`relative overflow-hidden ${className} ${isEn 
        ? 'bg-[#1E293B]/70 hover:bg-[#1E293B] text-gray-300 hover:text-white' 
        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
      } theme-transition`}
      title={isEn ? t('russian') : t('english')}
    >
      <div className="relative z-10 flex items-center justify-сontent">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute">
            <Languages size={16} />
        </motion.div>
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="ml-5 font-bold text-xs"
        >
          {isEn ? 'EN' : 'RU'}
        </motion.span>
      </div>
      
      <span className={`absolute inset-0 ${isEn 
        ? 'bg-gradient-to-r from-[#3B82F6]/0 via-[#3B82F6]/10 to-[#3B82F6]/0' 
        : 'bg-gradient-to-r from-[#F59E0B]/0 via-[#F59E0B]/10 to-[#F59E0B]/0'
      } opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x`}></span>
    </Button>
  );
}; 