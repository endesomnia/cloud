'use client'

import { useState, useEffect, useRef } from 'react'
import { Box, Button } from '@shared/ui'
import { routes } from '@shared/constant'
import { 
  Star, 
  Folder, 
  File, 
  Clock, 
  Search,
  SlidersHorizontal,
  ArrowDownUp,
  StarOff,
  PlusCircle,
  LayoutGrid,
  List,
  X,
  ChevronDown,
  Check
} from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDate } from '@src/shared/lib'
import { useViewMode } from '@src/shared/context/viewModeContext'
import { 
  StarredItem as ApiStarredItem, 
  getStarredItems, 
  removeStarredItem 
} from '@src/shared/api/starred'
import { useUserStore } from '@entities/user'
import { useRouter } from 'next/navigation'
import { useTheme } from '@src/shared/context/themeContext'
import { useLanguage } from '@src/shared/context/languageContext'

interface StarredItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: number;
  lastModified: Date;
  extension?: string;
  _originalFileName: string;
  _originalBucketName?: string;
}

type SortOption = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc' | 'type-asc' | 'type-desc';
type FilterOption = 'all' | 'files' | 'folders';

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
  else return (bytes / 1073741824).toFixed(1) + ' GB';
};

const getFileColor = (extension?: string): string => {
  const extensionMap: Record<string, string> = {
    'pdf': '#F43F5E',
    'doc': '#3B82F6',
    'docx': '#3B82F6',
    'xls': '#10B981',
    'xlsx': '#10B981',
    'ppt': '#F59E0B',
    'pptx': '#F59E0B',
    'jpg': '#8B5CF6',
    'jpeg': '#8B5CF6',
    'png': '#8B5CF6',
    'txt': '#6B7280',
    'zip': '#64748B',
    'rar': '#64748B'
  };
  
  if (!extension) return '#6B7280';
  return extensionMap[extension.toLowerCase()] || '#6B7280';
};

const getFileIcon = (type: 'folder' | 'file', extension?: string) => {
  if (type === 'folder') {
    return <Folder size={22} className="relative z-10 transform transition-transform group-hover/icon:scale-110" />;
  }
  
  return <File size={22} className="relative z-10 transform transition-transform group-hover/icon:scale-110" />;
};

const getExtension = (fileName: string): string | undefined => {
  const parts = fileName.split('.');
  if (parts.length > 1) {
    return parts[parts.length - 1].toLowerCase();
  }
  return undefined;
};

const StarredPage = () => {
  const [rawStarredItems, setRawStarredItems] = useState<ApiStarredItem[]>([]);
  const [starredItems, setStarredItems] = useState<StarredItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<StarredItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  
  const { starredPageView, setStarredPageView, isMounted } = useViewMode();
  const { user } = useUserStore();
  const router = useRouter();
  const { theme, isMounted: isThemeMounted } = useTheme();
  const isDark = isThemeMounted && theme === 'dark';
  const { t } = useLanguage();
  const effectiveUserId = user?.id;

  const mapApiItemToStarredItem = (apiItem: ApiStarredItem, effectiveUserId?: string): StarredItem => {
    let displayName = apiItem.fileName;
    if (apiItem.type === 'folder' && effectiveUserId && apiItem.fileName.startsWith(effectiveUserId + '-')) {
      displayName = apiItem.fileName.substring(effectiveUserId.length + 1);
    }

    return {
      id: apiItem.id,
      name: displayName,
      type: apiItem.type,
      lastModified: new Date(apiItem.createdAt),
      extension: apiItem.type === 'file' ? getExtension(apiItem.fileName) : undefined,
      size: apiItem.type === 'file' ? Math.floor(Math.random() * 10000000) : undefined,
      _originalFileName: apiItem.fileName,
      _originalBucketName: apiItem.bucketName
    };
  };

  const handleItemClick = (item: StarredItem) => {
    if (item.type === 'folder') {
      router.push(`${routes.buckets}/${item._originalFileName}`);
    } else if (item.type === 'file') {
      if (item._originalBucketName && item._originalFileName) {
        router.push(`${routes.buckets}/${item._originalBucketName}/${item._originalFileName}`);
      } else {
        console.error("Missing original bucket/file name for navigation:", item);
      }
    } else {
      console.error("Unknown item type, cannot navigate:", item);
    }
  };
  
  useEffect(() => {
    const fetchStarredItems = async () => {
      setLoading(true);
      try {
        if (!user?.id) {
          console.error('Пользователь не аутентифицирован');
          return;
        }
        
        const userId = user.id;
        const apiItems = await getStarredItems({ userId });
        setRawStarredItems(apiItems);
        const mappedItems = apiItems.map(apiItem => mapApiItemToStarredItem(apiItem, userId));
        setStarredItems(mappedItems);
      } catch (error) {
        console.error("Ошибка при загрузке избранных элементов:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStarredItems();
  }, [user?.id]);
  
  useEffect(() => {
    let result = [...starredItems];
    
    if (searchQuery) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    switch (filterOption) {
      case 'files':
        result = result.filter(item => item.type === 'file');
        break;
      case 'folders':
        result = result.filter(item => item.type === 'folder');
        break;
      default:
        break;
    }
    
    switch (sortOption) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'date-asc':
        result.sort((a, b) => a.lastModified.getTime() - b.lastModified.getTime());
        break;
      case 'date-desc':
        result.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
        break;
      case 'type-asc':
        result.sort((a, b) => {
          if (a.type === b.type) return a.name.localeCompare(b.name);
          return a.type === 'folder' ? -1 : 1;
        });
        break;
      case 'type-desc':
        result.sort((a, b) => {
          if (a.type === b.type) return a.name.localeCompare(b.name);
          return a.type === 'folder' ? 1 : -1;
        });
        break;
    }
    
    setFilteredItems(result);
  }, [starredItems, searchQuery, filterOption, sortOption]);
  
  // Закрытие выпадающих меню при клике вне их области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const removeFromStarred = async (id: string) => {
    try {
      if (!user?.id) {
        console.error('Пользователь не аутентифицирован');
        return;
      }
      
      const userId = user.id;
      const success = await removeStarredItem({ id, userId });
      
      if (success) {
        setStarredItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error("Ошибка при удалении из избранного:", error);
    }
  };
  
  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case 'name-asc': return t('name_asc');
      case 'name-desc': return t('name_desc');
      case 'date-asc': return t('date_asc');
      case 'date-desc': return t('date_desc');
      case 'type-asc': return t('type_asc');
      case 'type-desc': return t('type_desc');
      default: return t('sort');
    }
  };

  const getFilterLabel = (option: FilterOption): string => {
    switch (option) {
      case 'all': return t('all_items');
      case 'files': return t('files_only');
      case 'folders': return t('folders_only');
      default: return t('filter');
    }
  };

  return (
    <main className="min-h-screen overflow-hidden">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div 
          className={`absolute top-[-15%] left-[-10%] w-[800px] h-[800px] ${isDark 
            ? 'bg-gradient-to-br from-[#1E293B]/60 via-[#334155]/40 to-[#1E293B]/60' 
            : 'bg-gradient-to-br from-blue-100/60 via-blue-50/40 to-blue-100/60'
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
            ? 'bg-gradient-to-bl from-[#F59E0B]/10 via-[#FBBF24]/5 to-transparent' 
            : 'bg-gradient-to-bl from-amber-200/30 via-amber-100/20 to-transparent'
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
              <h1 className={`text-4xl font-bold ${isDark 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400' 
                : 'text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600'
              } theme-transition`}>
                {t('starred_items')}
              </h1>
              <div className={`absolute top-0 left-0 w-full h-full ${isDark 
                ? 'bg-gradient-to-r from-[#F59E0B]/10 to-transparent' 
                : 'bg-gradient-to-r from-amber-400/10 to-transparent'
              } blur-xl opacity-70 animate-pulse-slow theme-transition`}></div>
              
              <div className="flex items-center ml-4">
                <span className="bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-white text-sm font-medium px-3 py-1.5 rounded-full shadow-lg shadow-[#F59E0B]/20 flex items-center">
                  <span className="mr-1">{filteredItems.length}</span>
                  <Star className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </div>

            <div className="flex items-center mt-4 md:mt-0 space-x-4 w-full md:w-auto justify-end">
              <div className="relative flex-grow md:flex-grow-0 mr-2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'} theme-transition`} />
                </div>
                <input 
                  type="search" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`block w-full md:w-60 p-2 pl-10 h-10 text-sm ${isDark 
                    ? 'bg-[#1E293B]/60 hover:bg-[#1E293B]/80 focus:bg-[#1E293B] border-gray-700/50 text-white focus:ring-[#F59E0B]/50 focus:border-[#F59E0B]/50' 
                    : 'bg-white/60 hover:bg-white/80 focus:bg-white border-gray-300/50 text-gray-700 focus:ring-amber-500/50 focus:border-amber-500/50'
                  } border rounded-lg transition-all duration-200 theme-transition`} 
                  placeholder={t('search_starred')} 
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`absolute inset-y-0 right-3 flex items-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              <div className="flex items-center space-x-2 mr-2">
                <button 
                  onClick={() => setStarredPageView('grid')} 
                  className={`p-2 rounded-md transition-all duration-300 ${isMounted && starredPageView === 'grid' 
                    ? 'bg-[#F59E0B] text-white' 
                    : isDark 
                      ? 'bg-[#1E293B]/70 hover:bg-[#1E293B] text-gray-300 hover:text-white border-gray-700/30 hover:border-[#F59E0B]/40' 
                      : 'bg-white/70 hover:bg-white text-gray-600 hover:text-gray-800 border-gray-200/70 hover:border-amber-500/40'
                  } border theme-transition`}
                  title={t('grid_view')}
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setStarredPageView('list')} 
                  className={`p-2 rounded-md transition-all duration-300 ${isMounted && starredPageView === 'list' 
                    ? 'bg-[#F59E0B] text-white' 
                    : isDark 
                      ? 'bg-[#1E293B]/70 hover:bg-[#1E293B] text-gray-300 hover:text-white border-gray-700/30 hover:border-[#F59E0B]/40' 
                      : 'bg-white/70 hover:bg-white text-gray-600 hover:text-gray-800 border-gray-200/70 hover:border-amber-500/40'
                  } border theme-transition`}
                  title={t('list_view')}
                >
                  <List size={18} />
                </button>
              </div>
              
              <div className="relative" ref={filterDropdownRef}>
                <button 
                  onClick={() => {
                    setShowFilterDropdown(!showFilterDropdown);
                    setShowSortDropdown(false);
                  }}
                  className={`${isDark 
                    ? 'bg-[#1E293B]/70 hover:bg-[#1E293B] text-gray-300 hover:text-white border-gray-700/30 hover:border-[#F59E0B]/40 hover:shadow-[#F59E0B]/5' 
                    : 'bg-white/70 hover:bg-white text-gray-600 hover:text-gray-800 border-gray-200 hover:border-amber-500/40 hover:shadow-amber-500/5'
                  } h-11 px-5 rounded-lg text-sm font-medium flex items-center transition-all duration-300 border hover:shadow-md group theme-transition ${filterOption !== 'all' ? (isDark ? 'border-[#F59E0B]/50' : 'border-amber-500/50') : ''}`}
                >
                  <SlidersHorizontal size={16} className={`mr-2 ${isDark 
                    ? (filterOption !== 'all' ? 'text-[#F59E0B]' : 'group-hover:text-[#F59E0B]') 
                    : (filterOption !== 'all' ? 'text-amber-500' : 'group-hover:text-amber-500')
                  } transition-colors duration-300 theme-transition`} />
                  <span>{getFilterLabel(filterOption)}</span>
                  <ChevronDown size={16} className="ml-2" />
                </button>
                
                {showFilterDropdown && (
                  <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg ${isDark 
                    ? 'bg-[#1F2937] border border-gray-700' 
                    : 'bg-white border border-gray-200'
                  } z-[999] theme-transition`}>
                    <div className="py-1 rounded-lg overflow-hidden">
                      {(['all', 'files', 'folders'] as FilterOption[]).map(option => (
                        <button
                          key={option}
                          onClick={() => {
                            setFilterOption(option);
                            setShowFilterDropdown(false);
                          }}
                          className={`flex items-center w-full px-4 py-2 text-sm ${
                            option === filterOption
                              ? isDark
                                ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                                : 'bg-amber-50 text-amber-700'
                              : isDark
                                ? 'text-gray-300 hover:bg-gray-800'
                                : 'text-gray-700 hover:bg-gray-100'
                          } theme-transition`}
                        >
                          {option === filterOption && <Check size={16} className="mr-2" />}
                          <span className={option === filterOption ? "font-medium" : ""}>{getFilterLabel(option)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative" ref={sortDropdownRef}>
                <button 
                  onClick={() => {
                    setShowSortDropdown(!showSortDropdown);
                    setShowFilterDropdown(false);
                  }}
                  className={`${isDark 
                    ? 'bg-[#1E293B]/70 hover:bg-[#1E293B] text-gray-300 hover:text-white border-gray-700/30 hover:border-[#F59E0B]/40 hover:shadow-[#F59E0B]/5' 
                    : 'bg-white/70 hover:bg-white text-gray-600 hover:text-gray-800 border-gray-200 hover:border-amber-500/40 hover:shadow-amber-500/5'
                  } h-11 px-5 rounded-lg text-sm font-medium flex items-center transition-all duration-300 border hover:shadow-md group theme-transition ${sortOption !== 'name-asc' ? (isDark ? 'border-[#F59E0B]/50' : 'border-amber-500/50') : ''}`}
                >
                  <ArrowDownUp size={16} className={`mr-2 ${isDark 
                    ? (sortOption !== 'name-asc' ? 'text-[#F59E0B]' : 'group-hover:text-[#F59E0B]') 
                    : (sortOption !== 'name-asc' ? 'text-amber-500' : 'group-hover:text-amber-500')
                  } transition-colors duration-300 theme-transition`} />
                  <span>{getSortLabel(sortOption)}</span>
                  <ChevronDown size={16} className="ml-2" />
                </button>
                
                {showSortDropdown && (
                  <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg ${isDark 
                    ? 'bg-[#1F2937] border border-gray-700' 
                    : 'bg-white border border-gray-200'
                  } z-[999] theme-transition`}>
                    <div className="py-1 rounded-lg overflow-hidden">
                      {(['name-asc', 'name-desc', 'date-asc', 'date-desc', 'type-asc', 'type-desc'] as SortOption[]).map(option => (
                        <button
                          key={option}
                          onClick={() => {
                            setSortOption(option);
                            setShowSortDropdown(false);
                          }}
                          className={`flex items-center w-full px-4 py-2 text-sm ${
                            option === sortOption
                              ? isDark
                                ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                                : 'bg-amber-50 text-amber-700'
                              : isDark
                                ? 'text-gray-300 hover:bg-gray-800'
                                : 'text-gray-700 hover:bg-gray-100'
                          } theme-transition`}
                        >
                          {option === sortOption && <Check size={16} className="mr-2" />}
                          <span className={option === sortOption ? "font-medium" : ""}>{getSortLabel(option)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <div className="relative">
                <div className={`w-16 h-16 border-4 ${isDark 
                  ? 'border-[#1E293B] border-t-[#F59E0B]' 
                  : 'border-gray-200 border-t-amber-500'
                } rounded-full animate-spin theme-transition`}></div>
                <div className={`absolute inset-0 w-16 h-16 border-4 border-transparent ${isDark 
                  ? 'border-t-[#FBBF24]/30' 
                  : 'border-t-amber-300/50'
                } rounded-full animate-spin theme-transition`} style={{ animationDuration: '1.5s' }}></div>
              </div>
              <p className={`mt-6 ${isDark ? 'text-gray-400' : 'text-gray-500'} text-lg animate-pulse theme-transition`}>
                {t('loading_starred')}
              </p>
            </div>
          ) : filteredItems.length > 0 ? (
            starredPageView === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in animation-delay-200 perspective-1000">
                {filteredItems.map((item, index) => (
                  <motion.div 
                    key={item.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`group ${isDark 
                      ? 'bg-gradient-to-br from-[#1F2937]/90 to-[#1F2937]/70 border-gray-800/60 hover:border-[#F59E0B]/40 hover:shadow-[#F59E0B]/10' 
                      : 'bg-gradient-to-br from-white/90 to-white/70 border-gray-200 hover:border-amber-500/40 hover:shadow-amber-500/10'
                    } border rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 backdrop-blur-sm transform-gpu hover:translate-y-[-5px] relative theme-transition`}
                  >
                    <div className={`absolute inset-0 w-full h-full ${isDark 
                      ? 'bg-gradient-to-br from-[#F59E0B]/5 via-transparent to-[#FBBF24]/5' 
                      : 'bg-gradient-to-br from-amber-400/5 via-transparent to-amber-300/5'
                    } opacity-0 group-hover:opacity-100 transition-opacity duration-700 theme-transition`}></div>
                    
                    <div className={`absolute -inset-0.5 ${isDark 
                      ? 'bg-gradient-to-r from-[#F59E0B]/0 via-[#F59E0B]/20 to-[#F59E0B]/0' 
                      : 'bg-gradient-to-r from-amber-500/0 via-amber-500/20 to-amber-500/0'
                    } rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-700 animate-gradient-x theme-transition`}></div>
                    
                    <div className="p-6 flex flex-col h-full relative">
                      <div className={`absolute -right-20 -top-20 w-52 h-52 ${isDark 
                        ? 'bg-gradient-to-br from-[#F59E0B]/10 to-transparent' 
                        : 'bg-gradient-to-br from-amber-400/10 to-transparent'
                      } rounded-full blur-xl group-hover:scale-150 transition-transform duration-1000 opacity-0 group-hover:opacity-100 theme-transition`}></div>
                      
                      <div className="flex justify-center items-center mb-5 relative z-10">
                        <div className="relative group/icon transform transition-all duration-300 group-hover:rotate-2 group-hover:scale-105">
                          <div className="absolute -inset-1 bg-gradient-to-r from-[#F59E0B]/60 to-[#FBBF24]/60 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                          
                          <div className={`relative rounded-lg p-5 text-white shadow-lg ${item.type === 'folder' 
                            ? 'bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] shadow-[#F59E0B]/30 group-hover/icon:shadow-[#F59E0B]/60' 
                            : 'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] shadow-[#3B82F6]/30 group-hover/icon:shadow-[#3B82F6]/60'
                          } cursor-pointer transform transition-all duration-300 group-hover/icon:shadow-xl`}>
                            {getFileIcon(item.type, item.extension)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center mb-auto flex-grow relative z-10">
                        <div className="flex-grow">
                          <Button 
                            variant="link"
                            className="p-0 text-left w-full h-auto"
                            onClick={(e) => { e.stopPropagation(); handleItemClick(item); }}
                          >
                            <div className={`w-full truncate ${isDark ? 'text-white group-hover/title:text-amber-400' : 'text-gray-800 group-hover/title:text-amber-600'} cursor-pointer transition-colors duration-300 theme-transition`}>{item.name}</div>
                          </Button>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFromStarred(item.id); }}
                        className={`absolute top-3 right-3 p-3 ${isDark 
                          ? 'bg-[#111827]/60 hover:bg-[#111827]/90 border-gray-800/40 hover:border-amber-500/30 hover:shadow-amber-500/10 text-amber-400 hover:text-amber-300' 
                          : 'bg-gray-50/60 hover:bg-gray-50/90 border-gray-200/40 hover:border-amber-500/30 hover:shadow-amber-500/10 text-amber-500 hover:text-amber-600'
                        } rounded-full transition-all duration-300 border hover:shadow-md flex items-center justify-center z-30 cursor-pointer theme-transition`}
                        title={t('remove_from_starred')}
                      >
                        <StarOff size={20} />
                      </button>
                      
                      <div className={`mt-6 pt-4 ${isDark ? 'border-gray-700/50' : 'border-gray-200/70'} border-t flex items-center justify-between ${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm relative z-10 theme-transition`}>
                        <div className="flex items-center">
                          <Clock size={16} className={`mr-1.5 ${
                            item.type === 'folder' 
                              ? (isDark ? 'text-[#F59E0B]' : 'text-amber-500') 
                              : (isDark ? 'text-[#3B82F6]' : 'text-blue-500')
                          } theme-transition`} />
                          <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} theme-transition`}>
                            {formatDate(item.lastModified)}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-2"></div>
                          <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} theme-transition`}>
                            {item.type === 'folder' ? 'Папка' : formatFileSize(item.size || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="animate-fade-in animation-delay-200">
                <div className={`${isDark 
                  ? 'bg-[#1F2937]/80 border-gray-800/60' 
                  : 'bg-white/80 border-gray-200'
                } border rounded-xl overflow-hidden backdrop-blur-sm mb-4 theme-transition`}>
                  <div className={`grid grid-cols-12 py-3 px-6 ${isDark 
                    ? 'border-gray-800/60 text-gray-400' 
                    : 'border-gray-200 text-gray-500'
                  } border-b text-sm font-medium theme-transition`}>
                    <div className="col-span-5 md:col-span-6">{t('name')}</div>
                    <div className="col-span-3 md:col-span-3 text-center">{t('type')}</div>
                    <div className="col-span-3 md:col-span-2 text-center">{t('last_modified')}</div>
                    <div className="col-span-1 md:col-span-1 text-right"></div>
                  </div>
                  
                  {filteredItems.map((item, index) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`grid grid-cols-12 py-4 px-6 ${isDark 
                        ? 'border-gray-800/40 hover:bg-[#1F2937]' 
                        : 'border-gray-200/40 hover:bg-gray-50'
                      } border-b transition-colors duration-200 relative group theme-transition`}
                    >
                      <div className="col-span-5 md:col-span-6 flex items-center">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${item.type === 'folder' ? (isDark ? 'bg-gradient-to-r from-[#3B82F6]/20 to-[#60A5FA]/20 text-blue-300' : 'bg-gradient-to-r from-blue-500/10 to-blue-400/10 text-blue-600') : (isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500')} flex items-center justify-center mr-4 shadow-md group-hover:shadow-lg transition-shadow duration-300 theme-transition`}>
                          {item.type === 'folder' 
                            ? <Folder size={24} className="drop-shadow-md" /> 
                            : <File size={24} className="drop-shadow-md" />}
                        </div>
                        <div 
                          className={`truncate font-medium cursor-pointer ${isDark ? 'text-white group-hover:text-blue-400' : 'text-gray-800 group-hover:text-blue-600'} transition-colors duration-300 theme-transition`}
                          onClick={(e) => { e.stopPropagation(); handleItemClick(item); }}
                        >
                          {item.name}
                        </div>
                      </div>
                      
                      <div className="col-span-3 md:col-span-3 flex items-center justify-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.type === 'folder'
                            ? isDark
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                              : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                            : isDark
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' 
                              : 'bg-blue-500/10 text-blue-700 border-blue-500/20'
                        } border theme-transition`}>
                          {item.type === 'folder' ? 'Папка' : item.extension?.toUpperCase() || 'Файл'}
                        </span>
                      </div>
                      
                      <div className="col-span-3 md:col-span-2 flex items-center justify-center text-sm">
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} theme-transition`}>
                          {formatDate(item.lastModified)}
                        </span>
                      </div>
                      
                      <div className="col-span-1 md:col-span-1 flex items-center justify-end">
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFromStarred(item.id); }}
                          className={`p-2 rounded-full ${isDark 
                            ? 'text-amber-400 hover:text-amber-300 hover:bg-[#111827]/70' 
                            : 'text-amber-500 hover:text-amber-600 hover:bg-gray-100/70'
                          } transition-all duration-300 theme-transition`}
                          title={t('remove_from_starred')}
                        >
                          <StarOff size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          ) : searchQuery || filterOption !== 'all' ? (
            <div className="flex flex-col items-center justify-center h-[65vh] animate-fade-in animation-delay-400 text-center">
              <div className="relative group perspective-800">
                <div className={`absolute inset-0 ${isDark 
                  ? 'bg-gradient-to-r from-[#F59E0B]/20 to-[#FBBF24]/20' 
                  : 'bg-gradient-to-r from-amber-500/20 to-amber-400/10'
                } rounded-full blur-xl opacity-80 animate-pulse-slow theme-transition`}></div>
                <div className={`relative z-10 p-8 rounded-full ${isDark 
                  ? 'bg-gradient-to-br from-[#1E293B] to-[#111827] border-gray-700/40' 
                  : 'bg-gradient-to-br from-white to-gray-50 border-gray-200/70'
                } border shadow-2xl transform transition-transform duration-700 group-hover:rotate-3 group-hover:scale-110 theme-transition`}>
                  <SlidersHorizontal size={64} className={`${isDark ? 'text-gray-500' : 'text-gray-400'} theme-transition`} />
                </div>
                <div className={`absolute -inset-0.5 ${isDark 
                  ? 'bg-gradient-to-r from-[#F59E0B]/0 via-[#F59E0B]/20 to-[#F59E0B]/0' 
                  : 'bg-gradient-to-r from-amber-500/0 via-amber-500/20 to-amber-500/0'
                } rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-gradient-x theme-transition`}></div>
              </div>
              
              <h2 className={`text-4xl font-bold ${isDark 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400' 
                : 'text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600'
              } mt-8 mb-3 theme-transition`}>
                {t('no_starred_items')}
              </h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6 text-center max-w-md text-lg theme-transition`}>
                {t('no_matching_starred_files')}
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className={`${isDark 
                      ? 'bg-[#1E293B]/80 hover:bg-[#1E293B] text-gray-300 hover:text-white border-gray-700/30' 
                      : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-gray-200'
                    } px-4 py-2 rounded-lg border transition-all duration-300 flex items-center`}
                  >
                    <X size={16} className="mr-2" />
                    <span>{t('clear_search')}</span>
                  </button>
                )}
                
                {filterOption !== 'all' && (
                  <button 
                    onClick={() => setFilterOption('all')}
                    className={`${isDark 
                      ? 'bg-[#1E293B]/80 hover:bg-[#1E293B] text-gray-300 hover:text-white border-gray-700/30' 
                      : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-gray-200'
                    } px-4 py-2 rounded-lg border transition-all duration-300 flex items-center`}
                  >
                    <SlidersHorizontal size={16} className="mr-2" />
                    <span>{t('reset_filters')}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[65vh] animate-fade-in animation-delay-400 text-center">
              <div className="relative group perspective-800">
                <div className={`absolute inset-0 ${isDark 
                  ? 'bg-gradient-to-r from-[#F59E0B]/20 to-[#FBBF24]/20' 
                  : 'bg-gradient-to-r from-amber-500/20 to-amber-400/10'
                } rounded-full blur-xl opacity-80 animate-pulse-slow theme-transition`}></div>
                <div className={`relative z-10 p-8 rounded-full ${isDark 
                  ? 'bg-gradient-to-br from-[#1E293B] to-[#111827] border-gray-700/40' 
                  : 'bg-gradient-to-br from-white to-gray-50 border-gray-200/70'
                } border shadow-2xl transform transition-transform duration-700 group-hover:rotate-3 group-hover:scale-110 theme-transition`}>
                  <Star size={64} className={`${isDark ? 'text-gray-500' : 'text-gray-400'} theme-transition`} />
                </div>
                <div className={`absolute -inset-0.5 ${isDark 
                  ? 'bg-gradient-to-r from-[#F59E0B]/0 via-[#F59E0B]/20 to-[#F59E0B]/0' 
                  : 'bg-gradient-to-r from-amber-500/0 via-amber-500/20 to-amber-500/0'
                } rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-gradient-x theme-transition`}></div>
              </div>
              
              <h2 className={`text-4xl font-bold ${isDark 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400' 
                : 'text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600'
              } mt-8 mb-3 theme-transition`}>
                {t('no_starred_items')}
              </h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-10 text-center max-w-md text-lg theme-transition`}>
                {t('files_will_appear_here_starred')}
              </p>
              
              <div className="group">
                <Button
                  variant="default"
                  onClick={() => router.push(routes.buckets)}
                  className={`bg-gradient-to-r ${isDark 
                    ? 'from-[#F59E0B] to-[#FBBF24] hover:from-[#F59E0B]/90 hover:to-[#FBBF24]/90 shadow-amber-500/20' 
                    : 'from-amber-500 to-amber-400 hover:from-amber-500/90 hover:to-amber-400/90 shadow-amber-500/10'
                  } text-white h-12 px-8 rounded-xl text-base font-medium transition-all duration-500 shadow-xl flex items-center transform hover:scale-105 theme-transition`}
                >
                  <PlusCircle size={18} className="mr-2" />
                  <span>{t('go_to_files')}</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </Box>
    </main>
  );
};

export default StarredPage;