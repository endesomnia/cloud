'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, Button } from '@shared/ui'
import { useUserStore } from '@entities/user'
import { LogoutBtn } from '@features/user'
import {
  ChevronLeft, 
  User,
  HardDrive, 
  Shield, 
  Settings, 
  Upload,
  Download, 
  Trash2,
  FileType,
  Edit3, 
  Save,
  Github,
  Moon,
  Sun
} from 'lucide-react'
import { routes } from '@shared/constant'
import { motion } from 'framer-motion'
import { getUserStats, updateUser, UserStats } from '@src/shared/api/users'
import { useTheme } from '@src/shared/context/themeContext'
import { useLanguage } from '@src/shared/context/languageContext'

const defaultUserStats: UserStats = {
  totalStorage: 5.0,
  usedStorage: 0,
  filesUploaded: 0,
  filesDownloaded: 0,
  filesDeleted: 0,
  lastActive: new Date().toISOString(),
  fileTypes: [
    { name: 'images', size: 0, color: '#4F46E5' },
    { name: 'documents', size: 0, color: '#10B981' },
    { name: 'videos', size: 0, color: '#F59E0B' },
    { name: 'other', size: 0, color: '#6D28D9' }
  ],
  activityData: [0, 0, 0, 0, 0, 0, 0]
};

const Page = () => {
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  
  const user = useUserStore((state) => state.user)
  const [activeTab, setActiveTab] = useState(tabParam === 'settings' ? 'settings' : 'overview')
  const [isEditing, setIsEditing] = useState(false)
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'
  const { t } = useLanguage()

  const [userData, setUserData] = useState({
    name: user?.email?.split('@')[0] || 'user',
    email: user?.email || 'user@example.com',
    avatar: '/assets/default-avatar.png',
    notifications: true,
    darkMode: isDark,
    twoFactorAuth: false
  })
  const [userStats, setUserStats] = useState<UserStats>(defaultUserStats)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    
    return () => clearTimeout(timer)
  }, [])
  
  useEffect(() => {
    if (tabParam === 'settings') {
      setActiveTab('settings');
    } else if (tabParam === 'overview') {
      setActiveTab('overview');
    }
  }, [tabParam]);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user?.id) return;
      
      try {
        const stats = await getUserStats({ userId: user.id });
        
        if (stats) {
          setUserStats(stats);
        } else {
          console.error('Не удалось получить статистику пользователя');
          setUserStats(defaultUserStats);
        }
      } catch (error) {
        console.error('Ошибка при получении статистики пользователя:', error);
        setUserStats(defaultUserStats);
      }
    };
    
    if (!loading) {
      fetchUserStats();
    }
  }, [user?.id, loading]);

  useEffect(() => {
    if (user) {
      setUserData(prev => ({
        ...prev,
        name: user.email?.split('@')[0] || t('user')
      }));
    }
  }, [user, t]);

  useEffect(() => {
    if (userStats) {
      setUserStats(prev => ({
        ...prev,
        fileTypes: [
          { name: t('images'), size: prev.fileTypes[0].size, color: prev.fileTypes[0].color },
          { name: t('documents'), size: prev.fileTypes[1].size, color: prev.fileTypes[1].color },
          { name: t('videos'), size: prev.fileTypes[2].size, color: prev.fileTypes[2].color },
          { name: t('other'), size: prev.fileTypes[3].size, color: prev.fileTypes[3].color }
        ]
      }));
    }
  }, [t]);

  useEffect(() => {
    setUserData(prev => ({
      ...prev,
      darkMode: isDark
    }))
  }, [isDark])

  if (!user && !loading) return (
    <div className="flex justify-center items-center h-screen">
      <Button onClick={() => push(routes.login)}>{t('sign_in')}</Button>
    </div>
  )

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    if (user?.id) {
      updateUser({
        userId: user.id,
        userData: {
          name: userData.name,
          email: userData.email
        }
      })
      .then(() => {
        setIsEditing(false)
      })
      .catch((error) => {
        console.error('Error updating user:', error)
      })
    }
  }

  const handleClose = () => {
    setIsEditing(false)
  }

  const handleThemeChange = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    setUserData(prev => ({ ...prev, darkMode: newTheme === 'dark' }))
  }

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full animate-fade-in">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`${isDark 
          ? 'bg-gradient-to-br from-[#1F2937]/90 to-[#1F2937]/70 border-gray-800/60 hover:border-[#3B82F6]/30 hover:shadow-[#3B82F6]/5' 
          : 'bg-white border-gray-200 hover:border-blue-300/50 hover:shadow-blue-300/5'
        } rounded-xl p-6 border transition-all duration-300 group hover:shadow-lg theme-transition`}
      >
        <div className="flex items-center mb-4">
          <div className={`p-3 ${isDark 
            ? 'bg-gradient-to-br from-[#3B82F6]/20 to-[#60A5FA]/10' 
            : 'bg-gradient-to-br from-[#2563EB]/10 to-[#3B82F6]/5'
          } rounded-lg mr-3 theme-transition`}>
            <HardDrive className={`${isDark ? 'text-[#3B82F6]' : 'text-[#2563EB]'} h-6 w-6 theme-transition`} />
          </div>
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} theme-transition`}>{t('storage_usage')}</h3>
        </div>
        
        // Визуализация заполненности хранилища пользователя (прогресс-бар)
        <div className="relative pt-5">
          <div className={`h-2 ${isDark ? 'bg-[#1E293B]' : 'bg-gray-100'} rounded-full overflow-hidden mb-2 theme-transition`}>
            <div 
              className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-full transition-all 
              duration-1000 ease-out group-hover:animate-pulse"
              style={{ width: `${(userStats.usedStorage / userStats.totalStorage) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm">
            <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} theme-transition`}>
              {t('used_storage')}: <span 
              className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium theme-transition`}>
                {userStats.usedStorage.toFixed(1)} {t('gb')}</span>
            </span>
            <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} theme-transition`}>
              {t('total_storage')}: <span 
              className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium theme-transition`}>
                {userStats.totalStorage} {t('gb')}</span>
            </span>
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-2">
            <div className={`${isDark 
              ? 'bg-[#111827]/50 border-gray-800/30 group-hover:border-gray-700/50' 
              : 'bg-gray-50 border-gray-200/50 group-hover:border-gray-300/60'
            } rounded-lg p-3 flex flex-col items-center justify-center border transition-all theme-transition`}>
              <Upload size={18} className={`${isDark ? 'text-[#3B82F6]' : 'text-[#2563EB]'} mb-1 theme-transition`} />
              <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold theme-transition`}>{userStats.filesUploaded}</span>
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} theme-transition`}>{t('files_uploaded')}</span>
            </div>
            <div className={`${isDark 
              ? 'bg-[#111827]/50 border-gray-800/30 group-hover:border-gray-700/50' 
              : 'bg-gray-50 border-gray-200/50 group-hover:border-gray-300/60'
            } rounded-lg p-3 flex flex-col items-center justify-center border transition-all theme-transition`}>
              <Download size={18} className={`${isDark ? 'text-[#10B981]' : 'text-emerald-600'} mb-1 theme-transition`} />
              <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold theme-transition`}>{userStats.filesDownloaded}</span>
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} theme-transition`}>{t('files_downloaded')}</span>
            </div>
            <div className={`${isDark 
              ? 'bg-[#111827]/50 border-gray-800/30 group-hover:border-gray-700/50' 
              : 'bg-gray-50 border-gray-200/50 group-hover:border-gray-300/60'
            } rounded-lg p-3 flex flex-col items-center justify-center border transition-all theme-transition`}>
              <Trash2 size={18} className={`${isDark ? 'text-[#F43F5E]' : 'text-rose-500'} mb-1 theme-transition`} />
              <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold theme-transition`}>{userStats.filesDeleted}</span>
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} theme-transition`}>{t('files_deleted')}</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`${isDark 
          ? 'bg-gradient-to-br from-[#1F2937]/90 to-[#1F2937]/70 border-gray-800/60 hover:border-[#3B82F6]/30 hover:shadow-[#3B82F6]/5' 
          : 'bg-white border-gray-200 hover:border-blue-300/50 hover:shadow-blue-300/5'
        } rounded-xl p-6 border transition-all duration-300 group hover:shadow-lg theme-transition`}
      >
        <div className="flex items-center mb-4">
          <div className={`p-3 ${isDark 
            ? 'bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/10' 
            : 'bg-gradient-to-br from-[#4F46E5]/10 to-[#7C3AED]/5'
          } rounded-lg mr-3 theme-transition`}>
            <FileType className={`${isDark ? 'text-[#4F46E5]' : 'text-[#4338CA]'} h-6 w-6 theme-transition`} />
          </div>
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} theme-transition`}>{t('file_types')}</h3>
        </div>
        
        <div className="space-y-4">
          {userStats.fileTypes.map((type, index) => (
            <div key={index} className="relative">
              <div className="flex justify-between items-center mb-1">
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm theme-transition`}>{type.name}</span>
                <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium text-sm theme-transition`}>{type.size.toFixed(1)} {t('gb')}</span>
              </div>
              <div className={`h-2 ${isDark ? 'bg-[#1E293B]' : 'bg-gray-100'} rounded-full overflow-hidden theme-transition`}>
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out group-hover:animate-pulse"
                  style={{ 
                    width: `${(type.size / userStats.usedStorage) * 100}%`,
                    backgroundColor: type.color 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-center">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 120 120" className="transform -rotate-90 w-full h-full">
              {userStats.fileTypes.map((type, i) => {
                const percentage = (type.size / userStats.usedStorage) * 100;
                const prevPercents = userStats.fileTypes
                  .slice(0, i)
                  .reduce((acc, curr) => acc + (curr.size / userStats.usedStorage) * 100, 0);
                
                const strokeDasharray = 283; // 2 * PI * 45
                const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;
                
                return (
                  <circle
                    key={i}
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke={type.color}
                    strokeWidth="12"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                      transform: `rotate(${prevPercents * 3.6}deg)`,
                      transformOrigin: '60px 60px',
                      opacity: 0.8,
                      transition: 'all 1s ease'
                    }}
                    className="group-hover:opacity-100"
                  />
                );
              })}
              <circle cx="60" cy="60" r="35" className={`${isDark ? 'fill-[#1F2937]' : 'fill-gray-100'} theme-transition`} />
            </svg>
          </div>
        </div>
      </motion.div>
    </div>
  )

  const renderSettings = () => (
    <div className={`w-full animate-fade-in theme-transition`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${isDark 
            ? 'bg-gradient-to-br from-[#1F2937]/90 to-[#1F2937]/70 border-gray-800/60 hover:border-[#3B82F6]/30 hover:shadow-[#3B82F6]/5' 
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-blue-300/50 hover:shadow-blue-300/5'
          } rounded-xl p-6 border transition-all duration-300 group hover:shadow-lg theme-transition`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className={`p-3 ${isDark 
                ? 'bg-gradient-to-br from-[#3B82F6]/20 to-[#60A5FA]/10' 
                : 'bg-gradient-to-br from-[#2563EB]/10 to-[#3B82F6]/5'
              } rounded-lg mr-3 theme-transition`}>
                <User className={`${isDark ? 'text-[#3B82F6]' : 'text-[#2563EB]'} h-6 w-6 theme-transition`} />
              </div>
              <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} theme-transition`}>{t('personal_data')}</h3>
            </div>
            <button 
              onClick={isEditing ? handleSave : handleEdit}
              className={`p-2 rounded-lg ${isDark 
                ? 'text-gray-400 hover:text-white hover:bg-[#1E293B]/70' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              } transition-all theme-transition`}
            >
              {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <label className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'} block mb-1 theme-transition`}>{t('name')}</label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({...userData, name: e.target.value})}
                disabled={!isEditing}
                className={`w-full ${isDark 
                  ? 'bg-[#111827]/50 border-gray-800/60 focus:border-[#3B82F6]/50 text-white focus:ring-[#3B82F6]/20' 
                  : 'bg-white border-gray-200 focus:border-blue-300/70 text-gray-900 focus:ring-blue-200/20'
                } border rounded-lg px-4 py-2 focus:outline-none transition-all disabled:opacity-70 theme-transition`}
              />
            </div>
            
            <div className="relative">
              <label className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'} block mb-1 theme-transition`}>{t('email')}</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({...userData, email: e.target.value})}
                disabled={!isEditing}
                className={`w-full ${isDark 
                  ? 'bg-[#111827]/50 border-gray-800/60 focus:border-[#3B82F6]/50 text-white focus:ring-[#3B82F6]/20' 
                  : 'bg-white border-gray-200 focus:border-blue-300/70 text-gray-900 focus:ring-blue-200/20'
                } border rounded-lg px-4 py-2 focus:outline-none transition-all disabled:opacity-70 theme-transition`}
              />
            </div>
            
            <div className="pt-4 flex items-center space-x-4">
              <Github className={`${isDark ? 'text-gray-400' : 'text-gray-500'} h-5 w-5 theme-transition`} />
              <button className={`${isDark 
                ? 'text-[#3B82F6] hover:text-[#60A5FA]' 
                : 'text-[#2563EB] hover:text-[#3B82F6]'
              } text-sm transition-colors theme-transition`}>
                {t('attach_github')}
              </button>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${isDark 
            ? 'bg-gradient-to-br from-[#1F2937]/90 to-[#1F2937]/70 border-gray-800/60 hover:border-[#3B82F6]/30 hover:shadow-[#3B82F6]/5' 
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-blue-300/50 hover:shadow-blue-300/5'
          } rounded-xl p-6 border transition-all duration-300 group hover:shadow-lg theme-transition`}
        >
          <div className="flex items-center mb-6">
            <div className={`p-3 ${isDark 
              ? 'bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/10' 
              : 'bg-gradient-to-br from-[#4F46E5]/10 to-[#7C3AED]/5'
            } rounded-lg mr-3 theme-transition`}>
              <Settings className={`${isDark ? 'text-[#4F46E5]' : 'text-[#4338CA]'} h-6 w-6 theme-transition`} />
            </div>
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} theme-transition`}>{t('settings')}</h3>
          </div>
          
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield size={18} className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mr-3 theme-transition`} />
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} theme-transition`}>{t('two_factor_auth')}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={userData.twoFactorAuth} 
                  onChange={() => setUserData({...userData, twoFactorAuth: !userData.twoFactorAuth})} 
                  className="sr-only peer" 
                />
                <div className={`w-11 h-6 ${isDark 
                  ? 'bg-[#111827] peer-focus:ring-[#3B82F6]/20' 
                  : 'bg-gray-200 peer-focus:ring-blue-300/20'
                } peer-focus:outline-none peer-focus:ring-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isDark 
                  ? 'peer-checked:bg-[#3B82F6]' 
                  : 'peer-checked:bg-[#2563EB]'
                } theme-transition`}></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                {isDark ? <Moon size={18} className="text-gray-400 mr-3" /> : <Sun size={18} className="text-gray-500 mr-3" />}
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} theme-transition`}>{t('dark_theme')}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={userData.darkMode} 
                  onChange={handleThemeChange} 
                  className="sr-only peer" 
                />
                <div className={`w-11 h-6 ${isDark 
                  ? 'bg-[#111827] peer-focus:ring-[#3B82F6]/20' 
                  : 'bg-gray-200 peer-focus:ring-blue-300/20'
                } peer-focus:outline-none peer-focus:ring-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isDark 
                  ? 'peer-checked:bg-[#3B82F6]' 
                  : 'peer-checked:bg-[#2563EB]'
                } theme-transition`}></div>
              </label>
            </div>
            
            <div className={`pt-4 border-t ${isDark ? 'border-gray-800/60' : 'border-gray-200'} theme-transition`}>
              <button className="mt-4 text-red-500 hover:text-red-400 text-sm transition-colors flex items-center">
                <Trash2 size={16} className="mr-2" />
                {t('delete_account')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className={`max-w-4xl w-[95vw] max-h-[90vh] h-auto ${isDark
        ? 'bg-gradient-to-b from-[#0A0F1A] to-[#111827] border-gray-800/60'
        : 'bg-gradient-to-b from-gray-50 to-white border-gray-200'
      } border overflow-hidden p-0 theme-transition`}>
        <div className="absolute inset-0 w-full h-full">
          <div 
            className={`absolute top-[-10%] left-[-5%] w-[600px] h-[600px] ${isDark
              ? 'bg-gradient-to-br from-[#1E293B]/60 via-[#334155]/40 to-[#1E293B]/60'
              : 'bg-gradient-to-br from-blue-50/60 via-blue-100/40 to-blue-50/60'
            } rounded-full mix-blend-normal filter blur-[120px] animate-blob opacity-70 theme-transition`}
          />
          <div 
            className={`absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] ${isDark
              ? 'bg-gradient-to-bl from-[#0F172A]/80 via-[#1E293B]/60 to-[#0F172A]/80'
              : 'bg-gradient-to-bl from-slate-100/80 via-slate-50/60 to-white/80'
            } rounded-full mix-blend-normal filter blur-[110px] animate-blob animation-delay-2000 theme-transition`}
          />
          <div 
            className={`absolute -z-10 top-[30%] right-[25%] w-[400px] h-[400px] ${isDark
              ? 'bg-gradient-to-br from-[#3B82F6]/5 via-[#60A5FA]/3 to-transparent'
              : 'bg-gradient-to-br from-[#2563EB]/5 via-[#3B82F6]/3 to-transparent'
            } rounded-full mix-blend-normal filter blur-[80px] animate-blob animation-delay-3000 theme-transition`}
          />
        </div>
        
        <div 
          className={`absolute inset-0 ${isDark
            ? "bg-[url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=)]"
            : "bg-[url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=)]"
          } opacity-30 theme-transition`}
        />
        
        {loading ? (
          <div className="h-[700px] flex items-center justify-center">
            <div className="relative">
              <div className={`w-16 h-16 border-4 ${isDark 
                ? 'border-[#1E293B] border-t-[#3B82F6]' 
                : 'border-gray-200 border-t-[#2563EB]'
              } rounded-full animate-spin theme-transition`}></div>
              <div className={`absolute inset-0 w-16 h-16 border-4 border-transparent ${isDark 
                ? 'border-t-[#60A5FA]/30' 
                : 'border-t-[#3B82F6]/30'
              } rounded-full animate-spin theme-transition`} style={{ animationDuration: '1.5s' }}></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[700px] overflow-auto relative z-10">
            <div className={`relative ${isDark 
              ? 'bg-gradient-to-r from-[#1E293B] to-[#111827] border-b border-gray-800/60' 
              : 'bg-gradient-to-r from-gray-100 to-white border-b border-gray-200'
            } overflow-hidden theme-transition`}>
              <div className={`absolute inset-0 ${isDark 
                ? 'bg-gradient-to-r from-[#3B82F6]/5 via-[#60A5FA]/10 to-[#3B82F6]/5' 
                : 'bg-gradient-to-r from-[#2563EB]/5 via-[#3B82F6]/10 to-[#2563EB]/5'
              } opacity-30 theme-transition`}></div>
              <div className={`absolute right-0 top-0 w-48 h-48 ${isDark 
                ? 'bg-gradient-to-br from-[#3B82F6]/20 to-transparent' 
                : 'bg-gradient-to-br from-[#2563EB]/20 to-transparent'
              } rounded-full blur-2xl opacity-50 theme-transition`}></div>
              
              <div className="relative flex flex-col md:flex-row items-center justify-between px-8 py-10 z-10">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="relative group">
                    <div className={`absolute -inset-1.5 ${isDark 
                      ? 'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]' 
                      : 'bg-gradient-to-r from-[#2563EB] to-[#3B82F6]'
                    } rounded-full blur opacity-30 group-hover:opacity-60 transition-all duration-500 theme-transition`}></div>
                    <div className={`relative w-24 h-24 rounded-full ${isDark 
                      ? 'bg-gradient-to-br from-[#1E293B] to-[#111827] border-2 border-[#3B82F6]/40 group-hover:border-[#3B82F6]' 
                      : 'bg-gradient-to-br from-white to-gray-100 border-2 border-[#2563EB]/40 group-hover:border-[#2563EB]'
                    } flex items-center justify-center transition-all duration-300 theme-transition`}>
                      <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} theme-transition`}>
                        {userData.name.substring(0, 1).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} theme-transition`}>
                      {userData.name}
                    </h2>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-lg theme-transition`}>
                      {userData.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button 
                    onClick={() => push(routes.buckets)}
                    variant="outline" 
                    className={`${isDark 
                      ? 'border-gray-700 hover:border-gray-500 bg-[#111827]/40 hover:bg-[#1E293B]' 
                      : 'border-gray-200 hover:border-gray-300 bg-white/40 hover:bg-gray-50'
                    } transition-all px-6 py-6 text-base theme-transition`}
                  >
                    <ChevronLeft size={20} className="mr-2" />
                    {t('back')}
                  </Button>
                  
                  <LogoutBtn />
                </div>
              </div>
            </div>
            
            <div className={`${isDark 
              ? 'bg-[#0F172A]/60 border-b border-gray-800/60' 
              : 'bg-gray-50/60 border-b border-gray-200'
            } px-8 theme-transition`}>
              <div className="flex space-x-1">
                <button 
                  onClick={() => {
                    setActiveTab('overview');
                    push(`${routes.user}?tab=overview`, { scroll: false });
                  }}
                  className={`px-4 py-3 text-sm font-medium transition-all relative ${
                    activeTab === 'overview' 
                      ? (isDark ? 'text-white' : 'text-gray-900') 
                      : (isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
                  } theme-transition`}
                >
                  {t('overview')}
                  {activeTab === 'overview' && (
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDark 
                      ? 'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]' 
                      : 'bg-gradient-to-r from-[#2563EB] to-[#3B82F6]'
                    } theme-transition`}></div>
                  )}
                </button>
                <button 
                  onClick={() => {
                    setActiveTab('settings');
                    push(`${routes.user}?tab=settings`, { scroll: false });
                  }}
                  className={`px-4 py-3 text-sm font-medium transition-all relative ${
                    activeTab === 'settings' 
                      ? (isDark ? 'text-white' : 'text-gray-900') 
                      : (isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
                  } theme-transition`}
                >
                  {t('settings')}
                  {activeTab === 'settings' && (
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDark 
                      ? 'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]' 
                      : 'bg-gradient-to-r from-[#2563EB] to-[#3B82F6]'
                    } theme-transition`}></div>
                  )}
                </button>
              </div>
            </div>
            
            <div className={`p-8 overflow-auto flex-grow ${isDark 
              ? 'bg-[#0A0F1A]/10' 
              : 'bg-white/10'
            } theme-transition`}>
              {activeTab === 'overview' ? renderOverview() : renderSettings()}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default Page
