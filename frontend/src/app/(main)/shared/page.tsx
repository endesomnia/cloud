'use client'

import { useState, useEffect } from 'react'
import { Box, Button } from '@shared/ui'
import { useLanguage } from '@src/shared/context/languageContext'
import { 
  Share2, 
  Folder, 
  File, 
  Clock, 
  Search,
  SlidersHorizontal,
  ArrowDownUp,
  LayoutGrid,
  List,
  Users,
  UserPlus,
  UserCheck,
  UserX
} from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDate } from '@src/shared/lib'
import { useViewMode } from '@src/shared/context/viewModeContext'
import { getSharedWithUser, getSharedByUser, removeShare, SharedFile } from '@src/shared/api/shared'
import { useUserStore } from '@src/entities/user/model/user-store'
import { useTheme } from '@src/shared/context/themeContext'

interface SharedItem extends SharedFile {
  name: string;
  lastModified: Date;
  extension?: string;
  size?: number;
  type: 'folder' | 'file';
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
  else return (bytes / 1073741824).toFixed(1) + ' GB';
};

const getFileIcon = (type: 'folder' | 'file', extension?: string) => {
  if (type === 'folder') {
    return <Folder size={24} className="drop-shadow-md" />;
  }
  
  return <File size={24} className="drop-shadow-md" />;
};

const SharedPage = () => {
  const [sharedItems, setSharedItems] = useState<SharedItem[]>([]);
  const [sharedByMeItems, setSharedByMeItems] = useState<SharedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sharedWithMe' | 'sharedByMe'>('sharedWithMe');
  const [searchQuery, setSearchQuery] = useState('');
  const { sharedPageView, setSharedPageView, isMounted } = useViewMode();
  const { user } = useUserStore();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  
  const getFileNameAndExtension = (fileName: string): { name: string; extension?: string; type: 'folder' | 'file' } => {
    if (fileName.endsWith('/')) {
      return { 
        name: fileName.substring(0, fileName.length - 1),
        type: 'folder'
      };
    }
    
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1 || (fileName.startsWith('.') && lastDotIndex === 0)) {
      return { 
        name: fileName,
        type: 'file'
      };
    }
    
    return {
      name: fileName.substring(0, lastDotIndex),
      extension: fileName.substring(lastDotIndex + 1),
      type: 'file'
    };
  };
  
  useEffect(() => {
    const fetchSharedItems = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const [sharedWithMe, sharedByMe] = await Promise.all([
          getSharedWithUser({ userId: user.id }),
          getSharedByUser({ userId: user.id })
        ]);
        
        const processItems = (items: SharedFile[]): SharedItem[] => {
          return items.map(item => {
            const { name, extension, type } = getFileNameAndExtension(item.fileName);
            return {
              ...item,
              name,
              extension,
              type,
              lastModified: new Date(item.createdAt),
              size: 0, // Размер файла не предоставляется API, можно добавить в будущем
            };
          });
        };
        
        setSharedItems(processItems(sharedWithMe));
        setSharedByMeItems(processItems(sharedByMe));
      } catch (error) {
        console.error('Ошибка при загрузке общих элементов:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSharedItems();
  }, [user?.id]);
  
  const removeSharedAccess = async (id: string) => {
    if (!user?.id) return;
    
    try {
      const success = await removeShare({ id, userId: user.id });
      if (success) {
        if (activeTab === 'sharedWithMe') {
          setSharedItems(prev => prev.filter(item => item.id !== id));
        } else {
          setSharedByMeItems(prev => prev.filter(item => item.id !== id));
        }
      }
    } catch (error) {
      console.error('Ошибка при отмене общего доступа:', error);
    }
  };
  
  const displayedItems = activeTab === 'sharedWithMe' ? sharedItems : sharedByMeItems;
  
  const filteredItems = displayedItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (activeTab === 'sharedWithMe' && item.sharedBy?.name && item.sharedBy.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (activeTab === 'sharedByMe' && item.sharedTo?.name && item.sharedTo.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className={`min-h-screen overflow-hidden ${!isDark && 'bg-gray-50'} theme-transition`}>
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div 
          className={`absolute top-[-15%] left-[-10%] w-[800px] h-[800px] ${isDark 
            ? 'bg-gradient-to-br from-[#1E293B]/60 via-[#334155]/40 to-[#1E293B]/60' 
            : 'bg-gradient-to-br from-purple-100/60 via-purple-50/40 to-purple-100/60'
          } rounded-full mix-blend-normal filter blur-[120px] animate-blob opacity-70 theme-transition`}
        />
        <div 
          className={`absolute top-[35%] right-[-15%] w-[800px] h-[800px] ${isDark 
            ? 'bg-gradient-to-bl from-[#0F172A]/80 via-[#1E293B]/60 to-[#0F172A]/80' 
            : 'bg-gradient-to-bl from-gray-100/80 via-gray-50/60 to-white/80'
          } rounded-full mix-blend-normal filter blur-[110px] animate-blob animation-delay-2000 theme-transition`}
        />
        <div 
          className={`absolute bottom-[-20%] left-[25%] w-[1000px] h-[1000px] ${isDark 
            ? 'bg-gradient-to-tr from-[#1E293B]/60 via-[#334155]/40 to-[#1E293B]/60' 
            : 'bg-gradient-to-tr from-gray-100/60 via-gray-50/40 to-gray-100/60'
          } rounded-full mix-blend-normal filter blur-[140px] animate-blob animation-delay-4000 theme-transition`}
        />
        <div 
          className={`absolute top-[20%] left-[50%] w-[500px] h-[500px] ${isDark 
            ? 'bg-gradient-to-bl from-[#7B64C2]/10 via-[#A084DC]/5 to-transparent' 
            : 'bg-gradient-to-bl from-purple-300/30 via-purple-200/20 to-transparent'
          } rounded-full mix-blend-normal filter blur-[80px] animate-blob animation-delay-3000 theme-transition`}
        />
      </div>

      <div 
        className={`absolute inset-0 ${isDark
          ? "bg-[url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=)]"
          : "bg-[url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=)]"
        } opacity-30 theme-transition`}
      />

      <Box className="w-full px-6 md:px-10 lg:px-16 py-10 relative z-10">
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 animate-fade-in">
            <div className="flex items-center relative">
              <h1 className={`text-5xl font-bold text-transparent bg-clip-text ${isDark 
                ? 'bg-gradient-to-r from-white to-gray-400' 
                : 'bg-gradient-to-r from-gray-900 to-gray-600'
              } theme-transition`}>
                {t('shared')}
              </h1>
              <div className={`absolute top-0 left-0 w-full h-full ${isDark 
                ? 'bg-gradient-to-r from-[#7B64C2]/10 to-transparent' 
                : 'bg-gradient-to-r from-purple-500/10 to-transparent'
              } blur-xl opacity-70 animate-pulse-slow theme-transition`}></div>
              
              <div className="flex items-center ml-4">
                <span className={`${isDark 
                  ? 'bg-gradient-to-r from-[#7B64C2] to-[#A084DC]' 
                  : 'bg-gradient-to-r from-purple-600 to-purple-500'
                } text-white text-sm font-medium px-3 py-1.5 rounded-full shadow-lg shadow-purple-500/20 flex items-center theme-transition`}>
                  <span className="mr-1">{filteredItems.length}</span>
                  <Users className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </div>

            <div className="flex items-center mt-4 md:mt-0 space-x-4">
              <div className="relative flex-grow md:flex-grow-0 mr-2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'} theme-transition`} />
                </div>
                <input 
                  type="search" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`block w-full md:w-60 p-2 pl-10 h-10 text-sm ${isDark 
                    ? 'bg-[#1E293B]/60 hover:bg-[#1E293B]/80 focus:bg-[#1E293B] border-gray-700/50 text-white focus:ring-[#7B64C2]/50 focus:border-[#7B64C2]/50' 
                    : 'bg-white/60 hover:bg-white/80 focus:bg-white border-gray-300 text-gray-700 focus:ring-purple-500/50 focus:border-purple-500/50'
                  } border rounded-lg transition-all duration-200 theme-transition`} 
                  placeholder={`${t('search')}...`} 
                />
              </div>
              
              <div className="flex items-center space-x-2 mr-2">
                <button 
                  onClick={() => setSharedPageView('grid')} 
                  className={`p-2 rounded-md transition-all duration-300 ${isMounted && sharedPageView === 'grid' 
                    ? isDark ? 'bg-[#7B64C2] text-white' : 'bg-purple-600 text-white'
                    : isDark
                      ? 'bg-[#1E293B]/70 hover:bg-[#1E293B] text-gray-300 hover:text-white border border-gray-700/30 hover:border-[#7B64C2]/40' 
                      : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 border border-gray-200 hover:border-purple-500/40'
                  } theme-transition`}
                  title={t('grid_view')}
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setSharedPageView('list')} 
                  className={`p-2 rounded-md transition-all duration-300 ${isMounted && sharedPageView === 'list' 
                    ? isDark ? 'bg-[#7B64C2] text-white' : 'bg-purple-600 text-white'
                    : isDark
                      ? 'bg-[#1E293B]/70 hover:bg-[#1E293B] text-gray-300 hover:text-white border border-gray-700/30 hover:border-[#7B64C2]/40' 
                      : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 border border-gray-200 hover:border-purple-500/40'
                  } theme-transition`}
                  title={t('list_view')}
                >
                  <List size={18} />
                </button>
              </div>
              
              <button className={`${isDark 
                ? 'bg-[#1E293B]/70 hover:bg-[#1E293B] text-gray-300 hover:text-white border-gray-700/30 hover:border-[#7B64C2]/40 hover:shadow-[#7B64C2]/5' 
                : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-gray-200 hover:border-purple-500/40 hover:shadow-purple-500/5'
              } h-11 px-5 rounded-lg text-sm font-medium flex items-center transition-all duration-300 border hover:shadow-md group theme-transition`}>
                <SlidersHorizontal size={16} className={`mr-2 ${isDark 
                  ? 'group-hover:text-[#7B64C2]' 
                  : 'group-hover:text-purple-600'
                } transition-colors duration-300 theme-transition`} />
                <span>{t('filters')}</span>
              </button>
              <button className={`${isDark 
                ? 'bg-[#1E293B]/70 hover:bg-[#1E293B] text-gray-300 hover:text-white border-gray-700/30 hover:border-[#7B64C2]/40 hover:shadow-[#7B64C2]/5' 
                : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-gray-200 hover:border-purple-500/40 hover:shadow-purple-500/5'
              } h-11 px-5 rounded-lg text-sm font-medium flex items-center transition-all duration-300 border hover:shadow-md group theme-transition`}>
                <ArrowDownUp size={16} className={`mr-2 ${isDark 
                  ? 'group-hover:text-[#7B64C2]' 
                  : 'group-hover:text-purple-600'
                } transition-colors duration-300 theme-transition`} />
                <span>{t('sort')}</span>
              </button>
            </div>
          </div>
          
          <div className="mb-10">
            <div className={`inline-flex p-1 ${isDark 
              ? 'bg-[#1E293B]/80 border-gray-700/30' 
              : 'bg-white border-gray-200'
            } border rounded-lg shadow-sm theme-transition`}>
              <button
                onClick={() => setActiveTab('sharedWithMe')}
                className={`flex items-center px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeTab === 'sharedWithMe'
                    ? isDark
                      ? 'bg-[#7B64C2] text-white shadow-md shadow-[#7B64C2]/30'
                      : 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : isDark
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-700 hover:text-gray-900'
                } theme-transition`}
              >
                <UserCheck size={18} className="mr-2" />
                {t('shared_with_me')}
              </button>
              
              <button
                onClick={() => setActiveTab('sharedByMe')}
                className={`flex items-center px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeTab === 'sharedByMe'
                    ? isDark
                      ? 'bg-[#7B64C2] text-white shadow-md shadow-[#7B64C2]/30'
                      : 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : isDark
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-700 hover:text-gray-900'
                } theme-transition`}
              >
                <UserPlus size={18} className="mr-2" />
                {t('shared_by_me')}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in">
              <div className="relative">
                <div className={`w-16 h-16 border-4 ${isDark 
                  ? 'border-[#1E293B] border-t-[#7B64C2]' 
                  : 'border-gray-200 border-t-purple-600'
                } rounded-full animate-spin theme-transition`}></div>
                <div className={`absolute inset-0 w-16 h-16 border-4 border-transparent ${isDark 
                  ? 'border-t-[#A084DC]/30' 
                  : 'border-t-purple-400/50'
                } rounded-full animate-spin theme-transition`} style={{ animationDuration: '1.5s' }}></div>
              </div>
              <p className={`mt-6 ${isDark ? 'text-gray-400' : 'text-gray-500'} text-lg animate-pulse theme-transition`}>
                {t('loading_shared_files')}
              </p>
            </div>
          ) : filteredItems.length > 0 ? (
            <>
              {/* Отображение элементов грид или список */}
              {sharedPageView === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in animation-delay-200">
                  {filteredItems.map((item, index) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group relative ${isDark 
                        ? 'bg-[#1F2937]/80 border-gray-800/60 hover:border-[#7B64C2]/60 hover:shadow-[#7B64C2]/5' 
                        : 'bg-white border-gray-200 hover:border-purple-400 hover:shadow-purple-500/5'
                      } border rounded-xl overflow-hidden p-5 hover:shadow-lg transition-all duration-500 backdrop-blur-sm theme-transition`}
                    >
                      <div className={`absolute -inset-0.5 ${isDark 
                        ? 'bg-gradient-to-r from-[#7B64C2]/0 via-[#7B64C2]/20 to-[#7B64C2]/0' 
                        : 'bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0'
                      } rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-gradient-x theme-transition`}></div>
                      
                      <div className="flex items-start group/header">
                        <div className={`flex-shrink-0 ${
                          item.type === 'folder' 
                            ? isDark 
                              ? 'bg-[#7B64C2]/20 text-purple-300 group-hover:text-purple-200' 
                              : 'bg-purple-100 text-purple-600 group-hover:text-purple-700'
                            : isDark 
                              ? 'bg-[#3B82F6]/20 text-blue-300 group-hover:text-blue-200' 
                              : 'bg-blue-100 text-blue-600 group-hover:text-blue-700'
                        } p-3 rounded-lg transition-colors duration-300 theme-transition`}>
                          {getFileIcon(item.type, item.extension)}
                        </div>
                        <div className="ml-3 flex-grow">
                          <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-1 text-base theme-transition`}>
                            {item.name}
                          </h3>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate theme-transition`}>
                            {item.type === 'folder' ? t('folder') : (
                              item.extension?.toUpperCase() || t('file')
                            )}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => removeSharedAccess(item.id)}
                          className={`ml-1 p-2 rounded-full ${isDark 
                            ? 'bg-[#111827]/70 hover:bg-[#111827] text-gray-400 hover:text-red-400' 
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-red-500'
                          } transition-colors duration-300 group/icon theme-transition`}
                          title={t('remove_shared_access')}
                        >
                          <UserX size={16} />
                        </button>
                      </div>
                      
                      <div className={`mt-4 pt-4 ${isDark ? 'border-gray-700/50' : 'border-gray-200'} border-t grid grid-cols-2 gap-2 theme-transition`}>
                        <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs theme-transition`}>
                          <span className="uppercase font-medium block mb-1">{activeTab === 'sharedWithMe' ? t('from') : t('to')}</span>
                          <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} theme-transition`}>
                            {activeTab === 'sharedWithMe' 
                              ? (item.sharedBy?.name || t('unknown'))
                              : (item.sharedTo?.name || t('unknown'))
                            }
                          </span>
                        </div>
                        
                        <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs theme-transition`}>
                          <span className="uppercase font-medium block mb-1">{t('added')}</span>
                          <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} theme-transition`}>
                            {formatDate(item.lastModified)}
                          </span>
                        </div>
                        
                        <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs col-span-2 mt-2 theme-transition`}>
                          <span className="uppercase font-medium block mb-1">{t('path')}</span>
                          <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} break-all theme-transition`}>
                            {`${item.bucketName}/${item.fileName}`}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={`${isDark 
                  ? 'bg-[#1F2937]/80 border-gray-800/60' 
                  : 'bg-white border-gray-200'
                } border rounded-xl overflow-hidden animate-fade-in animation-delay-200 theme-transition`}>
                  <div className={`grid grid-cols-12 py-3 px-6 ${isDark 
                    ? 'bg-[#111827]/50 border-gray-800/60 text-gray-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-500'
                  } border-b text-sm font-medium theme-transition`}>
                    <div className="col-span-5 md:col-span-6">{t('name')}</div>
                    <div className="col-span-3 md:col-span-2 text-center">{activeTab === 'sharedWithMe' ? t('shared_by') : t('shared_to')}</div>
                    <div className="col-span-3 md:col-span-3 text-center">{t('added')}</div>
                    <div className="col-span-1 md:col-span-1 text-right"></div>
                  </div>
                  
                  {filteredItems.map((item, index) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`grid grid-cols-12 py-4 px-6 ${isDark 
                        ? 'border-gray-800/40 hover:bg-[#1E293B]' 
                        : 'border-gray-200/40 hover:bg-gray-50'
                      } border-b transition-colors duration-200 group theme-transition`}
                    >
                      <div className="col-span-5 md:col-span-6 flex items-center">
                        <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mr-3 ${
                          item.type === 'folder' 
                            ? isDark 
                              ? 'bg-gradient-to-r from-[#7B64C2]/20 to-[#A084DC]/20 text-purple-300' 
                              : 'bg-gradient-to-r from-purple-500/10 to-purple-400/10 text-purple-600'
                            : isDark 
                              ? 'bg-gradient-to-r from-[#3B82F6]/20 to-[#60A5FA]/20 text-blue-300' 
                              : 'bg-gradient-to-r from-blue-500/10 to-blue-400/10 text-blue-600'
                        } theme-transition`}>
                          {item.type === 'folder' 
                            ? <Folder size={20} className="drop-shadow-md" /> 
                            : <File size={20} className="drop-shadow-md" />}
                        </div>
                        <div>
                          <div className={`truncate font-medium ${isDark ? 'text-white' : 'text-gray-800'} theme-transition`}>
                            {item.name}
                          </div>
                          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5 theme-transition`}>
                            {item.bucketName}/{item.fileName}
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-3 md:col-span-2 flex items-center justify-center">
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm theme-transition`}>
                          {activeTab === 'sharedWithMe' 
                            ? (item.sharedBy?.name || t('unknown'))
                            : (item.sharedTo?.name || t('unknown'))
                          }
                        </span>
                      </div>
                      
                      <div className="col-span-3 md:col-span-3 flex items-center justify-center">
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm flex items-center theme-transition`}>
                          <Clock size={14} className={`mr-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'} theme-transition`} />
                          {formatDate(item.lastModified)}
                        </span>
                      </div>
                      
                      <div className="col-span-1 md:col-span-1 flex items-center justify-end">
                        <button
                          onClick={() => removeSharedAccess(item.id)}
                          className={`p-2 rounded-full ${isDark 
                            ? 'text-gray-400 hover:text-red-400 hover:bg-[#111827]/70' 
                            : 'text-gray-500 hover:text-red-500 hover:bg-gray-100/70'
                          } transition-all duration-300 theme-transition`}
                          title={t('remove_shared_access')}
                        >
                          <UserX size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[65vh] animate-fade-in animation-delay-400">
              <div className="relative group perspective-800">
                <div className={`absolute inset-0 ${isDark 
                  ? 'bg-gradient-to-r from-[#7B64C2]/20 to-[#A084DC]/20' 
                  : 'bg-gradient-to-r from-purple-500/20 to-purple-400/10'
                } rounded-full blur-xl opacity-80 animate-pulse-slow theme-transition`}></div>
                <div className={`relative z-10 p-8 rounded-full ${isDark 
                  ? 'bg-gradient-to-br from-[#1E293B] to-[#111827] border-gray-700/40' 
                  : 'bg-gradient-to-br from-white to-gray-50 border-gray-200/70'
                } border shadow-2xl transform transition-transform duration-700 group-hover:rotate-3 theme-transition`}>
                  {activeTab === 'sharedWithMe' ? (
                    <UserCheck size={64} className={`${isDark ? 'text-gray-500' : 'text-gray-400'} theme-transition`} />
                  ) : (
                    <UserPlus size={64} className={`${isDark ? 'text-gray-500' : 'text-gray-400'} theme-transition`} />
                  )}
                </div>
                <div className={`absolute -inset-0.5 ${isDark 
                  ? 'bg-gradient-to-r from-[#7B64C2]/0 via-[#7B64C2]/20 to-[#7B64C2]/0' 
                  : 'bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0'
                } rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-gradient-x theme-transition`}></div>
              </div>
              
              <h2 className={`text-4xl font-bold text-transparent bg-clip-text ${isDark 
                ? 'bg-gradient-to-r from-white to-gray-400' 
                : 'bg-gradient-to-r from-gray-900 to-gray-600'
              } mt-8 mb-3 theme-transition max-w-md text-center`}>
                {activeTab === 'sharedWithMe' ? t('no_shared_files_with_me') : t('no_shared_files_by_me')}
              </h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-10 text-center max-w-md text-lg theme-transition`}>
                {activeTab === 'sharedWithMe' ? t('nobody_shared_with_you') : t('you_not_shared_with_others')}
              </p>
              <p className={`${isDark ? 'text-gray-500' : 'text-gray-400'} mb-10 text-center max-w-md text-base theme-transition`}>
                {activeTab === 'sharedWithMe' ? t('files_will_appear_here') : t('share_files_to_appear_here')}
              </p>
            </div>
          )}
        </div>
      </Box>
    </main>
  )
}

export default SharedPage