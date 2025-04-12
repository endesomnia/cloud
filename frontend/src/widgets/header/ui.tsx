import { Box, ToggleGroup } from '@src/shared/ui'
import Link from 'next/link'
import { routes } from '@src/shared/constant'
import { User, LogOut, Folder, Star, Cloud } from 'lucide-react'
import { DoLogout } from '@src/actions'
import { useRouter, usePathname } from 'next/navigation'
import Cookies from 'js-cookie'
import { useTheme } from '@src/shared/context/themeContext'
import { useLanguage } from '@src/shared/context/languageContext'

interface Props {
  className?: string
}

export const Header = ({ className }: Props) => {
  const { push } = useRouter()
  const pathname = usePathname()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { t } = useLanguage()

  const isActive = (path: string) => {
    if (path === routes.buckets && pathname === '/') return true
    return pathname.startsWith(path)
  }

  const handleLogout = async () => {
    Cookies.remove('token')
    Cookies.remove('userId')
    await DoLogout()
    push(routes.startUp)
  }

  const handleProfile = () => {
    push(routes.user)
  }

  return (
    <Box className={`flex items-center justify-center w-full px-8 py-5 z-20 relative ${isDark 
      ? 'bg-gradient-to-r from-[#0A0F1A]/95 to-[#111827]/95' 
      : 'bg-gradient-to-r from-slate-50/95 to-white/95'
    } backdrop-blur-md ${isDark 
      ? 'border-b border-gray-800/60' 
      : 'border-b border-gray-200'
    } shadow-sm shadow-[#0A0F1A]/20 theme-transition ${className}`}>
      <div className="flex items-center mx-6">
        <Link href={routes.buckets} className="flex items-center group relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/10 rounded-lg scale-0 group-hover:scale-100 transition-all duration-500 origin-center"></div>
          <div className="relative flex items-center">
            <svg 
              className={`w-10 h-10 ${isDark ? 'text-[#3B82F6]' : 'text-[#2563EB]'} mr-3 drop-shadow-md transform group-hover:rotate-6 transition-all duration-500 theme-transition`}
              viewBox="0 0 64 64" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M48 42c4.4 0 8-3.6 8-8s-3.6-8-8-8c-.3 0-.6 0-.9.1C45.7 20.5 40.3 16 34 16c-8.8 0-16 7.2-16 16v1c-3.3 0-6 2.7-6 6s2.7 6 6 6h30z" 
                fill="url(#header_gradient_1)"
              />
              <path 
                d="M24 28c3.3 0 6-2.7 6-6s-2.7-6-6-6c-.2 0-.4 0-.6.1C22.3 12.4 18.2 9 13.5 9 7.2 9 2 14.2 2 20.5v.5C-.5 22 -1 24.2 -1 26.5 -1 30.1 1.9 33 5.5 33H24v-5z" 
                fill="url(#header_gradient_2)"
                opacity="0.8"
              />
              <defs>
                <linearGradient id="header_gradient_1" x1="24" y1="16" x2="56" y2="42" gradientUnits="userSpaceOnUse">
                  <stop stopColor={isDark ? "#3B82F6" : "#2563EB"} />
                  <stop offset="1" stopColor={isDark ? "#2563EB" : "#1D4ED8"} />
                </linearGradient>
                <linearGradient id="header_gradient_2" x1="2" y1="9" x2="24" y2="33" gradientUnits="userSpaceOnUse">
                  <stop stopColor={isDark ? "#60A5FA" : "#3B82F6"} />
                  <stop offset="1" stopColor={isDark ? "#3B82F6" : "#2563EB"} />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex items-center">
              <span className={`text-2xl font-bold bg-clip-text text-transparent ${isDark 
                ? 'bg-gradient-to-r from-white to-gray-400' 
                : 'bg-gradient-to-r from-gray-900 to-gray-600'
              } theme-transition`}>
                Jul
              </span>
              <span className={`text-2xl font-bold bg-clip-text text-transparent ${isDark 
                ? 'bg-gradient-to-r from-[#3B82F6] to-[#93C5FD]' 
                : 'bg-gradient-to-r from-[#2563EB] to-[#60A5FA]'
              } theme-transition`}>
                Cloud
              </span>
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 flex items-center justify-center">
        <div className={`flex items-center rounded-xl ${isDark 
          ? 'bg-gradient-to-r from-[#1E293B]/30 to-[#1E293B]/50' 
          : 'bg-gradient-to-r from-gray-100/60 to-gray-100/80'
        } backdrop-blur-sm p-1.5 relative transition-all duration-500 shadow-sm ${isDark ? 'shadow-black/5' : 'shadow-gray-300/30'} mx-4 max-w-lg w-full`}>
          <div className={`absolute ${isActive(routes.buckets) 
            ? 'left-1.5 translate-x-0' 
            : 'left-[calc(50%-1px)]'
          } top-1.5 bottom-1.5 w-[calc(50%-3px)] rounded-lg ${isDark
            ? 'bg-gradient-to-br from-[#1E293B]/90 to-[#1E293B]/70'
            : 'bg-gradient-to-br from-white to-white/90'
          } shadow-md ${isDark ? 'shadow-black/10' : 'shadow-gray-200/70'} transition-all duration-400 ease-in-out z-0 transform`}></div>

          <Link 
            href={routes.buckets} 
            className={`flex items-center relative justify-center py-2.5 px-4 rounded-lg z-10 group transition-all duration-300 w-1/2 ${
              isActive(routes.buckets) ? 'text-current' : isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <Folder size={22} className={`${isActive(routes.buckets)
              ? isDark ? 'text-[#3B82F6]' : 'text-[#2563EB]'
              : isDark ? 'text-gray-400 group-hover:text-[#3B82F6]' : 'text-gray-500 group-hover:text-[#2563EB]'
            } transition-colors duration-300 group-hover:scale-115 group-active:scale-95 mr-1.5`} />
            <span className={`hidden md:inline font-medium ${
              isActive(routes.buckets)
                ? isDark ? 'text-white' : 'text-gray-900'
                : isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-900'
            } transition-colors duration-300`}>
              {t("folders")}
            </span>

            {isActive(routes.buckets) && (
              <span className={`absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 rounded-full ${
                isDark ? 'bg-[#3B82F6]' : 'bg-[#2563EB]'
              } opacity-80`}></span>
            )}
          </Link>
          
          <Link 
            href={routes.starred} 
            className={`flex items-center relative justify-center py-2.5 px-4 rounded-lg z-10 group transition-all duration-300 w-1/2 ${
              isActive(routes.starred) ? 'text-current' : isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <Star size={22} className={`${isActive(routes.starred)
              ? 'text-amber-400'
              : isDark ? 'text-gray-400 group-hover:text-amber-400' : 'text-gray-500 group-hover:text-amber-400'
            } transition-colors duration-300 group-hover:scale-115 group-active:scale-95 mr-1.5`} />
            <span className={`hidden md:inline font-medium ${
              isActive(routes.starred)
                ? isDark ? 'text-white' : 'text-gray-900'
                : isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-900'
            } transition-colors duration-300`}>
              {t("starred")}
            </span>
            
            {isActive(routes.starred) && (
              <span className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 rounded-full bg-amber-400 opacity-80"></span>
            )}
          </Link>
        </div>
      </nav>

      <div className="flex items-center mx-6 space-x-4">
        <ToggleGroup />
        
        <button 
          onClick={handleProfile}
          className={`p-2.5 hidden md:flex items-center justify-center rounded-lg overflow-hidden relative group transform hover:scale-105 active:scale-95 transition-all duration-300`}
        >
          <div className={`absolute inset-0 ${isDark 
            ? 'bg-[#1E293B]/0 group-hover:bg-[#1E293B]/70 group-active:bg-[#1E293B]' 
            : 'bg-gray-100/0 group-hover:bg-gray-100 group-active:bg-gray-200'
          } transition-all duration-300`}></div>
          <User className={`h-5 w-5 relative ${isDark 
            ? 'text-gray-400 group-hover:text-white' 
            : 'text-gray-600 group-hover:text-gray-900'
          } transition-colors duration-300`} />
        </button>
        
        <button 
          onClick={handleLogout}
          className={`p-2.5 hidden md:flex rounded-lg overflow-hidden relative group transform hover:scale-105 active:scale-95 transition-all duration-300`}
        >
          <div className={`absolute inset-0 ${isDark 
            ? 'bg-[#1E293B]/0 group-hover:bg-[#1E293B]/70 group-active:bg-[#1E293B]' 
            : 'bg-gray-100/0 group-hover:bg-gray-100 group-active:bg-gray-200'
          } transition-all duration-300`}></div>
          <LogOut className={`h-5 w-5 relative ${isDark 
            ? 'text-gray-400 group-hover:text-red-500' 
            : 'text-gray-600 group-hover:text-red-500'
          } group-hover:translate-x-0.5 transition-all duration-300`} />
        </button>
      </div>
    </Box>
  )
}