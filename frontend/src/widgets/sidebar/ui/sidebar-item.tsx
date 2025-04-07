'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Box } from '@src/shared/ui'
import { useTheme } from '@src/shared/context/themeContext'

interface SidebarItemProps {
  Icon: ReactNode
  title: string
  route: string
  className?: string
  collapsed?: boolean
}

export const SidebarItem = ({ Icon, title, route, className = '', collapsed = false }: SidebarItemProps) => {
  const pathname = usePathname()
  const isActive = pathname === route || pathname.startsWith(`${route}/`)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Link href={route} className="block">
      <Box 
        className={`
          flex items-center group relative overflow-hidden
          ${isActive 
            ? isDark 
              ? 'bg-[#1E293B] text-white font-medium' 
              : 'bg-blue-50 text-gray-900 font-medium' 
            : isDark 
              ? 'text-gray-400 hover:text-white' 
              : 'text-gray-600 hover:text-gray-900'
          } 
          ${className}
        `}
      >
        {isActive && (
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[60%] ${isDark ? 'bg-[#3B82F6]' : 'bg-[#2563EB]'} rounded-r-full theme-transition`} />
        )}
        <div className={`${collapsed ? 'mx-auto' : ''} relative z-10 ${isActive ? isDark ? 'text-[#3B82F6]' : 'text-[#2563EB]' : ''} theme-transition`}>
          {Icon}
        </div>
        {!collapsed && (
          <span className={`ml-3 relative z-10 transition-transform duration-200 group-hover:translate-x-0.5 ${isActive ? 'font-medium' : ''}`}>
            {title}
          </span>
        )}
        
        {isActive && (
          <span className={`absolute bottom-0 left-0 right-0 h-[1px] ${isDark 
            ? 'bg-gradient-to-r from-[#3B82F6]/40 via-[#60A5FA]/20 to-transparent' 
            : 'bg-gradient-to-r from-[#2563EB]/40 via-[#3B82F6]/20 to-transparent'
          } theme-transition`} />
        )}
        
        <div className={`
          absolute inset-0 opacity-0 
          transition-opacity duration-300 group-hover:opacity-100
          ${isActive 
            ? isDark 
              ? 'bg-gradient-to-r from-[#1E293B]/40 to-[#1E293B]/0' 
              : 'bg-gradient-to-r from-blue-50/80 to-blue-50/0'
            : isDark 
              ? 'bg-gradient-to-r from-[#1E293B]/30 to-[#1E293B]/0' 
              : 'bg-gradient-to-r from-gray-100/50 to-gray-100/0'
          } theme-transition
        `} />
      </Box>
    </Link>
  )
}
