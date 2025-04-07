'use client'

import { routes } from '@shared/constant'
import { Box, Button, ToggleGroup } from '@shared/ui'
import Link from 'next/link'
import { useLanguage } from '@src/shared/context/languageContext'
import { useTheme } from '@src/shared/context/themeContext'

export const HomeClient = () => {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  return (
    <Box className={`flex flex-col min-h-screen relative overflow-hidden ${isDark ? 'bg-[#111827]' : 'bg-white'} theme-transition`}>
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div 
          className={`absolute top-[-15%] left-[-10%] w-[800px] h-[800px] ${isDark 
            ? 'bg-gradient-to-br from-[#1E293B]/80 via-[#334155]/60 to-[#1E293B]/80' 
            : 'bg-gradient-to-br from-blue-100/60 via-blue-50/40 to-blue-100/60'
          } rounded-full mix-blend-normal filter blur-[120px] animate-blob opacity-70 theme-transition`}
        />
        <div 
          className={`absolute top-[35%] right-[-15%] w-[800px] h-[800px] ${isDark 
            ? 'bg-gradient-to-bl from-[#0F172A]/90 via-[#1E293B]/70 to-[#0F172A]/90' 
            : 'bg-gradient-to-bl from-gray-100/80 via-gray-50/60 to-white/80'
          } rounded-full mix-blend-normal filter blur-[110px] animate-blob animation-delay-2000 theme-transition`}
        />
        <div 
          className={`absolute bottom-[-20%] left-[25%] w-[1000px] h-[1000px] ${isDark 
            ? 'bg-gradient-to-tr from-[#1E293B]/80 via-[#334155]/60 to-[#1E293B]/80' 
            : 'bg-gradient-to-tr from-gray-100/60 via-gray-50/40 to-gray-100/60'
          } rounded-full mix-blend-normal filter blur-[140px] animate-blob animation-delay-4000 theme-transition`}
        />
        <div 
          className={`absolute top-[20%] left-[50%] w-[500px] h-[500px] ${isDark 
            ? 'bg-gradient-to-bl from-[#3B82F6]/20 via-[#60A5FA]/10 to-transparent' 
            : 'bg-gradient-to-bl from-blue-200/30 via-blue-100/20 to-transparent'
          } rounded-full mix-blend-normal filter blur-[80px] animate-blob animation-delay-3000 theme-transition`}
        />
      </div>

      <div 
        className={`absolute inset-0 ${isDark
          ? "bg-[url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=)]"
          : "bg-[url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=)]"
        } opacity-30 theme-transition`}
      />

      <div className="absolute top-4 right-4 z-40">
        <ToggleGroup />
      </div>
      
      <div className="flex flex-col justify-center items-center flex-grow relative z-10">
        <div className="flex flex-col items-center gap-6 mb-16 animate-fade-in">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB]' : 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]'} blur-xl opacity-30 rounded-full theme-transition`}></div>
            <svg 
              className="w-20 h-20 text-white relative z-10 transform hover:scale-110 transition-transform duration-300"
              viewBox="0 0 64 64" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M48 42c4.4 0 8-3.6 8-8s-3.6-8-8-8c-.3 0-.6 0-.9.1C45.7 20.5 40.3 16 34 16c-8.8 0-16 7.2-16 16v1c-3.3 0-6 2.7-6 6s2.7 6 6 6h30z" 
                fill="url(#cloud_gradient_1)"
                className="animate-pulse-slow"
              />
              <path 
                d="M24 28c3.3 0 6-2.7 6-6s-2.7-6-6-6c-.2 0-.4 0-.6.1C22.3 12.4 18.2 9 13.5 9 7.2 9 2 14.2 2 20.5v.5C-.5 22 -1 24.2 -1 26.5 -1 30.1 1.9 33 5.5 33H24v-5z" 
                fill="url(#cloud_gradient_2)"
                className="animate-pulse-slow animation-delay-2000"
                opacity="0.8"
              />
              <defs>
                <linearGradient id="cloud_gradient_1" x1="24" y1="16" x2="56" y2="42" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3B82F6" />
                  <stop offset="1" stopColor="#1E40AF" />
                </linearGradient>
                <linearGradient id="cloud_gradient_2" x1="2" y1="9" x2="24" y2="33" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#60A5FA" />
                  <stop offset="1" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <h1 className={`text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-white to-gray-400' : 'from-gray-900 to-gray-600'} theme-transition`}>
                Jul
              </h1>
              <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] to-[#93C5FD]">
                Cloud
              </h1>
            </div>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg animate-fade-in animation-delay-200 theme-transition`}>
              {t('personal_cloud')}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-md animate-fade-in animation-delay-400">
          <Button 
            variant="default" 
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white h-12 rounded-lg text-lg font-medium transition-all duration-300 relative group overflow-hidden"
          >
            <Link href={routes.registr} className="flex items-center justify-center w-full h-full">
              <span className="relative z-10">{t('create_account')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB] to-[#1E40AF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </Button>

          <Button 
            variant="default" 
            className={`w-full ${isDark 
              ? 'bg-[#1F2937] hover:bg-[#374151] border-gray-700' 
              : 'bg-white hover:bg-gray-50 border-gray-200'
            } ${isDark ? 'text-white' : 'text-gray-800'} h-12 rounded-lg text-lg font-medium transition-all duration-300 border theme-transition`}
          >
            <Link href={routes.login} className="flex items-center justify-center w-full h-full">
              {t('sign_in')}
            </Link>
          </Button>

          <div className="text-center mt-4">
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm animate-fade-in animation-delay-600 theme-transition`}>
              {t('experience_future')}
            </p>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4 w-full animate-fade-in animation-delay-800">
            <div className={`flex flex-col items-center p-4 rounded-lg ${isDark 
              ? 'bg-[#1F2937]/40 border-gray-800 hover:border-[#3B82F6]/50 hover:bg-[#1F2937]/60' 
              : 'bg-white border-gray-200 hover:border-blue-500/50 hover:bg-blue-50/20'
            } border text-center transition-all duration-300 theme-transition`}>
              <svg className={`w-8 h-8 ${isDark ? 'text-[#3B82F6]' : 'text-blue-600'} mb-3 theme-transition`} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1C8.676 1 6 3.676 6 7v3H4c-1.105 0-2 .895-2 2v8c0 1.105.895 2 2 2h16c1.105 0 2-.895 2-2v-8c0-1.105-.895-2-2-2h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v3H8V7c0-2.276 1.724-4 4-4zm0 11c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2z"/>
              </svg>
              <span className={`${isDark ? 'text-white' : 'text-gray-800'} text-sm font-medium text-center theme-transition`}>{t('secure_storage')}</span>
            </div>
            <div className={`flex flex-col items-center p-4 rounded-lg ${isDark 
              ? 'bg-[#1F2937]/40 border-gray-800 hover:border-[#3B82F6]/50 hover:bg-[#1F2937]/60' 
              : 'bg-white border-gray-200 hover:border-blue-500/50 hover:bg-blue-50/20'
            } border text-center transition-all duration-300 theme-transition`}>
              <svg className={`w-8 h-8 ${isDark ? 'text-[#3B82F6]' : 'text-blue-600'} mb-3 theme-transition`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 1H7.5C6.12 1 5 2.12 5 3.5V20.5C5 21.88 6.12 23 7.5 23H16.5C17.88 23 19 21.88 19 20.5V3.5C19 2.12 17.88 1 16.5 1ZM12 22C11.17 22 10.5 21.33 10.5 20.5C10.5 19.67 11.17 19 12 19C12.83 19 13.5 19.67 13.5 20.5C13.5 21.33 12.83 22 12 22ZM17 18H7V4H17V18Z" fill="currentColor"/>
              </svg>
              <span className={`${isDark ? 'text-white' : 'text-gray-800'} text-sm font-medium text-center theme-transition`}>{t('access_anywhere')}</span>
            </div>
            <div className={`flex flex-col items-center p-4 rounded-lg ${isDark 
              ? 'bg-[#1F2937]/40 border-gray-800 hover:border-[#3B82F6]/50 hover:bg-[#1F2937]/60' 
              : 'bg-white border-gray-200 hover:border-blue-500/50 hover:bg-blue-50/20'
            } border text-center transition-all duration-300 theme-transition`}>
              <svg className={`w-8 h-8 ${isDark ? 'text-[#3B82F6]' : 'text-blue-600'} mb-3 theme-transition`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L4.09322 12.6879C3.74881 13.1064 3.57661 13.3157 3.57586 13.4925C3.57522 13.6461 3.63559 13.7923 3.74607 13.8902C3.87379 14 4.12582 14 4.62988 14H12L11 22L19.9068 11.3121C20.2512 10.8936 20.4234 10.6843 20.4241 10.5075C20.4248 10.3539 20.3644 10.2077 20.2539 10.1098C20.1262 10 19.8742 10 19.3701 10H12L13 2Z" fill="currentColor"/>
              </svg>
              <span className={`${isDark ? 'text-white' : 'text-gray-800'} text-sm font-medium text-center theme-transition`}>{t('fast_upload')}</span>
            </div>
          </div>
        </div>
      </div>
    </Box>
  )
} 