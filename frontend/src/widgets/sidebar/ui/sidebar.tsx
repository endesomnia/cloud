'use client'

import { Folder, Home, Share2, Upload, Star, Settings, FileText, HelpCircle, Cloud } from 'lucide-react'

import { User } from '@entities/user'
import { GithubBtn } from '@features/user'
import {
  Box,
} from '@shared/ui'
import { SidebarItem } from './sidebar-item'
import { routes } from '@shared/constant'
import { UserAuth } from '@src/shared/api'
import { isUserAuth } from '@src/shared/lib'
import { useTheme } from '@src/shared/context/themeContext'
import { useLanguage } from '@src/shared/context/languageContext'

export const SideBar = ({ user }: { user: User | UserAuth | null | any }) => {
  const isAuthUser = isUserAuth(user) ? 'yes' : 'no'
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { t } = useLanguage()

  const GithubUserButton = {
    yes: <></>,
    no: <GithubBtn userName={user.name} />,
  }[isAuthUser]

  return (
    <Box className={`flex flex-col w-full h-screen ${isDark 
      ? 'bg-gradient-to-b from-[#0A0F1A]/95 to-[#111827]/95 border-r border-gray-800/60' 
      : 'bg-gradient-to-b from-white/95 to-gray-50/95 border-r border-gray-200'
    } backdrop-blur-md shadow-sm ${isDark ? 'shadow-[#0A0F1A]/20' : 'shadow-gray-200/50'} theme-transition`}>
      <Box className="flex-grow overflow-y-auto py-4 px-3 space-y-6">
        <div className="space-y-2">
          <h3 className={`text-xs uppercase ${isDark ? 'text-gray-500' : 'text-gray-500'} font-semibold px-3 py-1 flex items-center`}>
            <Home size={14} className="mr-2" />
            {t("dashboard")} 
          </h3>
          <SidebarItem 
            Icon={<Folder size={18} className={isDark ? "text-[#3B82F6]" : "text-[#2563EB]"} />} 
            title={t("folders")} 
            route={routes.buckets} 
            className={`py-2 px-3 rounded-lg ${isDark 
              ? 'hover:bg-[#1E293B]/70 active:bg-[#1E293B] text-white' 
              : 'hover:bg-gray-100 active:bg-gray-200 text-gray-900'
            } font-medium transition-all duration-200 theme-transition`}
          />
          <SidebarItem 
            Icon={<Star size={18} className="text-amber-400" />} 
            title={t("starred")} 
            route={routes.starred} 
            className={`py-2 px-3 rounded-lg ${isDark 
              ? 'hover:bg-[#1E293B]/70 text-gray-300 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            } transition-all duration-200 theme-transition`}
          />
        </div>

        <div className="space-y-2">
          <h3 className={`text-xs uppercase ${isDark ? 'text-gray-500' : 'text-gray-500'} font-semibold px-3 py-1 flex items-center`}>
            <Share2 size={14} className="mr-2" />
            {t("sharing")}
          </h3>
          <SidebarItem 
            Icon={<Cloud size={18} className={isDark ? "text-indigo-400" : "text-indigo-500"} />} 
            title={t("shared_with")}
            route={routes.shared} 
            className={`py-2 px-3 rounded-lg ${isDark 
              ? 'hover:bg-[#1E293B]/70 text-gray-300 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            } transition-all duration-200 theme-transition`}
          />
        </div>

        <div className="space-y-2">
          <h3 className={`text-xs uppercase ${isDark ? 'text-gray-500' : 'text-gray-500'} font-semibold px-3 py-1 flex items-center`}>
            <Settings size={14} className="mr-2" />
            {t("preferences")}
          </h3>
          <SidebarItem 
            Icon={<Settings size={18} className={isDark ? "text-gray-400" : "text-gray-500"} />} 
            title={t("settings")} 
            route={`${routes.user}?tab=settings`} 
            className={`py-2 px-3 rounded-lg ${isDark 
              ? 'hover:bg-[#1E293B]/70 text-gray-300 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            } transition-all duration-200 theme-transition`}
          />
        </div>
      </Box>

      <Box className={`p-4 ${isDark 
        ? 'bg-gradient-to-b from-[#0A0F1A]/95 to-[#111827]/95' 
        : 'bg-gradient-to-b from-white/95 to-gray-50/95'
      } theme-transition`}>
        <div className={`${isDark 
          ? 'bg-gradient-to-r from-[#1E293B]/80 to-[#1E293B]/50 border border-gray-800/50' 
          : 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200'
        } rounded-lg p-4 shadow-sm ${isDark ? 'shadow-black/10' : 'shadow-gray-200/50'} theme-transition`}>
          <div className="flex items-center mb-3">
            <div className={`p-2 rounded-md ${isDark 
              ? 'bg-gradient-to-br from-[#3B82F6] to-[#60A5FA]' 
              : 'bg-gradient-to-br from-[#2563EB] to-[#3B82F6]'
            } theme-transition`}>
              <Upload size={16} className="text-white" />
            </div>
            <div className="ml-3">
              <h4 className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium text-sm theme-transition`}>Storage</h4>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs theme-transition`}>2.5 GB of 10 GB</p>
            </div>
          </div>
          <div className={`w-full ${isDark ? 'bg-gray-700/70' : 'bg-gray-200'} rounded-full h-1.5 mb-1 theme-transition`}>
            <div className={`${isDark 
              ? 'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]' 
              : 'bg-gradient-to-r from-[#2563EB] to-[#3B82F6]'
            } h-1.5 rounded-full theme-transition`} style={{ width: '25%' }}></div>
          </div>
        </div>
      </Box>
    </Box>
  )
}
