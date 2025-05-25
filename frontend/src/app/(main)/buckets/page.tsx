'use client'

import { useRouter } from 'next/navigation'
import { Box, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuTrigger } from '@shared/ui'
import { listBucketsWithSize, BucketWithSize } from '@src/shared/api'
import { routes } from '@src/shared/constant'
import { useEffect, useState, useRef, useCallback } from 'react'
import { BucketDeleteButton } from '@src/features/bucket/delete'
import { BucketCreateButton, BucketCreateForm } from '@src/features/bucket/create'
import { formatDate, formatFileSize } from '@src/shared/lib'
import { 
  SlidersHorizontal, 
  ArrowDownUp, 
  Sparkles, 
  FolderOpen, 
  Clock, 
  CloudOff, 
  LayoutGrid, 
  List, 
  CheckCircle, 
  X, 
  ChevronDown, 
  Check,
  Star, 
  StarOff 
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useViewMode } from '@src/shared/context/viewModeContext'
import { useTheme } from '@src/shared/context/themeContext'
import { useLanguage } from '@src/shared/context/languageContext'
import { 
  getStarredItems, 
  addStarredItem, 
  removeStarredItem, 
  StarredItem as ApiStarredItem 
} from '@src/shared/api/starred'
import { useUserStore } from '@entities/user'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

type SortOption = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc' | 'size-asc' | 'size-desc';
type FilterOption = 'all' | 'empty' | 'non-empty';

const Page = () => {
  const [buckets, setBuckets] = useState<BucketWithSize[]>([])
  const [filteredBuckets, setFilteredBuckets] = useState<BucketWithSize[]>([])
  const [refetchIndex, setRefetchIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('name-asc')
  const [filterOption, setFilterOption] = useState<FilterOption>('all')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const filterDropdownRef = useRef<HTMLDivElement>(null)
  const sortDropdownRef = useRef<HTMLDivElement>(null)
  const [starredItems, setStarredItems] = useState<Map<string, ApiStarredItem>>(new Map());
  
  const { bucketsPageView, setBucketsPageView, isMounted } = useViewMode()
  const router = useRouter()
  const { theme, isMounted: isThemeMounted } = useTheme();
  const isDark = isThemeMounted && theme === 'dark';
  const { t } = useLanguage();
  const { user } = useUserStore();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const fetchData = useCallback(async () => {
    const effectiveUserId = userId || user?.id;
    if (!effectiveUserId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [bucketsData, starredData] = await Promise.all([
        listBucketsWithSize(effectiveUserId),
        getStarredItems({ userId: effectiveUserId })
      ]);

      if (Array.isArray(bucketsData)) {
        setBuckets(bucketsData);
      } else {
        console.error('Expected bucketsData to be an array, received:', bucketsData);
        setBuckets([]);
      }

      if (Array.isArray(starredData)) {
        const starredMap = new Map<string, ApiStarredItem>();
        starredData.forEach(item => {
          if (item.type === 'folder') {
            starredMap.set(item.bucketName, item);
          }
        });
        setStarredItems(starredMap);
      } else {
        setStarredItems(new Map());
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setBuckets([]);
      setStarredItems(new Map());
      toast.error(t('error_loading_data'));
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, userId, t]);

  useEffect(() => {
    const effectiveUserId = userId || user?.id;
    if (effectiveUserId) {
      fetchData();
    }
  }, [refetchIndex, user?.id, userId, fetchData]);

  useEffect(() => {
    let result = [...buckets];
    
    if (searchQuery) {
      result = result.filter(bucket => 
        bucket.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    switch (filterOption) {
      case 'empty':
        result = result.filter(bucket => bucket.filesCount === 0);
        break;
      case 'non-empty':
        result = result.filter(bucket => bucket.filesCount > 0);
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
        result.sort((a, b) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime());
        break;
      case 'date-desc':
        result.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
        break;
      case 'size-asc':
        result.sort((a, b) => a.size - b.size);
        break;
      case 'size-desc':
        result.sort((a, b) => b.size - a.size);
        break;
    }
    
    setFilteredBuckets(result);
  }, [buckets, searchQuery, filterOption, sortOption]);

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

  const redirectTo = (url: string) => {
    router.push(url)
  }

  const isBucketStarred = useCallback((bucketName: string) => {
    return starredItems.has(bucketName);
  }, [starredItems]);

  const toggleStar = useCallback(async (bucketName: string) => {
    if (!user?.id) {
      toast.error(t('auth_required'));
      return;
    }

    const isStarred = isBucketStarred(bucketName);
    const starredItem = starredItems.get(bucketName);

    const optimisticStarredItems = new Map(starredItems);
    if (isStarred && starredItem) {
      optimisticStarredItems.delete(bucketName);
    } else {
      const tempStarredItem: ApiStarredItem = {
        id: 'temp-' + Date.now(),
        userId: user.id,
        bucketName: bucketName,
        fileName: bucketName,
        type: 'folder',
        createdAt: new Date().toISOString(),
      };
      optimisticStarredItems.set(bucketName, tempStarredItem);
    }
    setStarredItems(optimisticStarredItems);

    try {
      if (isStarred && starredItem) {
        const success = await removeStarredItem({ id: starredItem.id, userId: user.id });
        if (!success) {
          throw new Error(t('error_removing_from_starred'));
        }
        toast.success(t('removed_from_starred'));
      } else {
        const newItem = await addStarredItem({
          userId: user.id,
          bucketName: bucketName,
          fileName: bucketName,
          type: 'folder',
        });
        if (!newItem) {
          throw new Error(t('error_adding_to_starred'));
        }
        setStarredItems(prev => new Map(prev).set(bucketName, newItem));
        toast.success(t('added_to_starred'));
      }
    } catch (error: any) {      
      toast.error(error.message || t('error_updating_starred'));
      setStarredItems(starredItems);
    }
  }, [user?.id, starredItems, isBucketStarred, t, fetchData]);

  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case 'name-asc': return t('name_asc');
      case 'name-desc': return t('name_desc');
      case 'date-asc': return t('date_asc');
      case 'date-desc': return t('date_desc');
      case 'size-asc': return t('size_asc');
      case 'size-desc': return t('size_desc');
      default: return t('sort');
    }
  };

  const getFilterLabel = (option: FilterOption): string => {
    switch (option) {
      case 'all': return t('all_buckets');
      case 'empty': return t('empty_buckets');
      case 'non-empty': return t('non_empty_buckets');
      default: return t('filters');
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
            ? 'bg-gradient-to-bl from-[#3B82F6]/10 via-[#60A5FA]/5 to-transparent' 
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

      <Box className="w-full px-6 md:px-10 lg:px-16 py-10 relative z-10">
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 animate-fade-in">
            <div className="flex items-center relative">
              <h1 className={`text-5xl font-bold ${isDark 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400' 
                : 'text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600'
              } theme-transition`}>
                {t('your_buckets')}
              </h1>
              <div className={`absolute top-0 left-0 w-full h-full ${isDark 
                ? 'bg-gradient-to-r from-[#3B82F6]/10 to-transparent' 
                : 'bg-gradient-to-r from-blue-400/10 to-transparent'
              } blur-xl opacity-70 animate-pulse-slow theme-transition`}></div>
              
              <div className="flex items-center ml-4">
                <span className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white text-sm font-medium px-3 py-1.5 rounded-full shadow-lg shadow-[#3B82F6]/20 flex items-center">
                  <span className="mr-1">{filteredBuckets.length}</span>
                  <Sparkles className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </div>

            <div className="flex items-center mt-4 md:mt-0 space-x-4">
              <div className="flex items-center space-x-2 mr-2">
                <button 
                  onClick={() => setBucketsPageView('grid')} 
                  className={`p-2 rounded-md transition-all duration-300 ${isMounted && bucketsPageView === 'grid' 
                    ? 'bg-[#3B82F6] text-white' 
                    : isDark 
                      ? 'bg-[#1E293B]/70 hover:bg-[#1E293B] text-gray-300 hover:text-white border-gray-700/30 hover:border-[#3B82F6]/40' 
                      : 'bg-white/70 hover:bg-white text-gray-600 hover:text-gray-800 border-gray-200/70 hover:border-blue-500/40'
                  } border theme-transition`}
                  title={t('grid_view')}
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setBucketsPageView('list')} 
                  className={`p-2 rounded-md transition-all duration-300 ${isMounted && bucketsPageView === 'list' 
                    ? 'bg-[#3B82F6] text-white' 
                    : isDark 
                      ? 'bg-[#1E293B]/70 hover:bg-[#1E293B] text-gray-300 hover:text-white border-gray-700/30 hover:border-[#3B82F6]/40' 
                      : 'bg-white/70 hover:bg-white text-gray-600 hover:text-gray-800 border-gray-200/70 hover:border-blue-500/40'
                  } border theme-transition`}
                  title={t('list_view')}
                >
                  <List size={18} />
                </button>
              </div>
              
              <div className="relative" ref={filterDropdownRef}>
                <DropdownMenu open={showFilterDropdown} onOpenChange={setShowFilterDropdown}>
                  <DropdownMenuTrigger asChild>
                    <button 
                      onClick={() => {
                        setShowFilterDropdown(!showFilterDropdown);
                        setShowSortDropdown(false);
                      }}
                      className={`${isDark 
                        ? 'bg-[#1E293B]/70 hover:bg-[#1E293B] text-gray-300 hover:text-white border-gray-700/30 hover:border-[#3B82F6]/40 hover:shadow-[#3B82F6]/5' 
                        : 'bg-white/70 hover:bg-white text-gray-600 hover:text-gray-800 border-gray-200 hover:border-blue-500/40 hover:shadow-blue-500/5'
                      } h-11 px-5 rounded-lg text-sm font-medium flex items-center transition-all duration-300 border hover:shadow-md group theme-transition ${filterOption !== 'all' ? (isDark ? 'border-[#3B82F6]/50' : 'border-blue-500/50') : ''}`}
                    >
                      <SlidersHorizontal size={16} className={`mr-2 ${isDark 
                        ? (filterOption !== 'all' ? 'text-[#3B82F6]' : 'group-hover:text-[#3B82F6]') 
                        : (filterOption !== 'all' ? 'text-blue-500' : 'group-hover:text-blue-500')
                      } transition-colors duration-300 theme-transition`} />
                      <span>{getFilterLabel(filterOption)}</span>
                      <ChevronDown size={16} className="ml-2" />
                    </button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuPortal>
                    <DropdownMenuContent 
                      className={`w-56 rounded-lg shadow-lg ${isDark 
                        ? 'bg-[#1F2937] border border-gray-700' 
                        : 'bg-white border border-gray-200'
                      } theme-transition`}
                    >
                      <div className="py-1 rounded-lg overflow-hidden">
                        {(['all', 'empty', 'non-empty'] as FilterOption[]).map(option => (
                          <DropdownMenuItem
                            key={option}
                            onClick={() => {
                              setFilterOption(option);
                              setShowFilterDropdown(false);
                            }}
                            className={`flex items-center w-full px-4 py-2 text-sm ${
                              option === filterOption
                                ? isDark
                                  ? 'bg-[#3B82F6]/10 text-[#3B82F6]'
                                  : 'bg-blue-50 text-blue-700'
                                : isDark
                                  ? 'text-gray-300 hover:bg-gray-800'
                                  : 'text-gray-700 hover:bg-gray-100'
                            } theme-transition`}
                          >
                            {option === filterOption && <Check size={16} className="mr-2" />}
                            <span className={option === filterOption ? "font-medium" : ""}>{getFilterLabel(option)}</span>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenuPortal>
                </DropdownMenu>
              </div>
              
              <div className="relative" ref={sortDropdownRef}>
                <DropdownMenu open={showSortDropdown} onOpenChange={setShowSortDropdown}>
                  <DropdownMenuTrigger asChild>
                    <button 
                      onClick={() => {
                        setShowSortDropdown(!showSortDropdown);
                        setShowFilterDropdown(false);
                      }}
                      className={`${isDark 
                        ? 'bg-[#1E293B]/70 hover:bg-[#1E293B] text-gray-300 hover:text-white border-gray-700/30 hover:border-[#3B82F6]/40 hover:shadow-[#3B82F6]/5' 
                        : 'bg-white/70 hover:bg-white text-gray-600 hover:text-gray-800 border-gray-200 hover:border-blue-500/40 hover:shadow-blue-500/5'
                      } h-11 px-5 rounded-lg text-sm font-medium flex items-center transition-all duration-300 border hover:shadow-md group theme-transition ${sortOption !== 'name-asc' ? (isDark ? 'border-[#3B82F6]/50' : 'border-blue-500/50') : ''}`}
                    >
                      <ArrowDownUp size={16} className={`mr-2 ${isDark 
                        ? (sortOption !== 'name-asc' ? 'text-[#3B82F6]' : 'group-hover:text-[#3B82F6]') 
                        : (sortOption !== 'name-asc' ? 'text-blue-500' : 'group-hover:text-blue-500')
                      } transition-colors duration-300 theme-transition`} />
                      <span>{getSortLabel(sortOption)}</span>
                      <ChevronDown size={16} className="ml-2" />
                    </button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuPortal>
                    <DropdownMenuContent 
                      className={`w-56 rounded-lg shadow-lg ${isDark 
                        ? 'bg-[#1F2937] border border-gray-700' 
                        : 'bg-white border border-gray-200'
                      } theme-transition`}
                    >
                      <div className="py-1 rounded-lg overflow-hidden">
                        {(['name-asc', 'name-desc', 'date-asc', 'date-desc', 'size-asc', 'size-desc'] as SortOption[]).map(option => (
                          <DropdownMenuItem
                            key={option}
                            onClick={() => {
                              setSortOption(option);
                              setShowSortDropdown(false);
                            }}
                            className={`flex items-center w-full px-4 py-2 text-sm ${
                              option === sortOption
                                ? isDark
                                  ? 'bg-[#3B82F6]/10 text-[#3B82F6]'
                                  : 'bg-blue-50 text-blue-700'
                                : isDark
                                  ? 'text-gray-300 hover:bg-gray-800'
                                  : 'text-gray-700 hover:bg-gray-100'
                            } theme-transition`}
                          >
                            {option === sortOption && <Check size={16} className="mr-2" />}
                            <span className={option === sortOption ? "font-medium" : ""}>{getSortLabel(option)}</span>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenuPortal>
                </DropdownMenu>
              </div>
              
              <BucketCreateButton classes={`bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] hover:from-[#2563EB] hover:to-[#3B82F6] text-white h-11 px-5 rounded-lg text-sm font-medium transition-all duration-300 shadow-md ${isDark ? 'shadow-blue-500/20' : 'shadow-blue-500/10'} flex items-center group relative overflow-hidden theme-transition`} />
            </div>
            <BucketCreateForm setRefetch={setRefetchIndex}></BucketCreateForm>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <div className="relative">
                <div className={`w-16 h-16 border-4 ${isDark 
                  ? 'border-[#1E293B] border-t-[#3B82F6]' 
                  : 'border-gray-200 border-t-blue-500'
                } rounded-full animate-spin theme-transition`}></div>
                <div className={`absolute inset-0 w-16 h-16 border-4 border-transparent ${isDark 
                  ? 'border-t-[#60A5FA]/30' 
                  : 'border-t-blue-300/50'
                } rounded-full animate-spin theme-transition`} style={{ animationDuration: '1.5s' }}></div>
              </div>
              <p className={`mt-6 ${isDark ? 'text-gray-400' : 'text-gray-500'} text-lg animate-pulse theme-transition`}>
                {t('loading_buckets')}...
              </p>
            </div>
          ) : filteredBuckets.length > 0 ? (
            bucketsPageView === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in animation-delay-200 perspective-1000">
                {filteredBuckets.map((bucket, index) => (
                  <div 
                    key={bucket.name} 
                    className={`group ${isDark 
                      ? 'bg-gradient-to-br from-[#1F2937]/90 to-[#1F2937]/70 border-gray-800/60 hover:border-[#3B82F6]/40 hover:shadow-[#3B82F6]/10' 
                      : 'bg-gradient-to-br from-white/90 to-white/70 border-gray-200 hover:border-blue-500/40 hover:shadow-blue-500/10'
                    } border rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 backdrop-blur-sm transform-gpu hover:translate-y-[-5px] relative theme-transition`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`absolute inset-0 w-full h-full ${isDark 
                      ? 'bg-gradient-to-br from-[#3B82F6]/5 via-transparent to-[#60A5FA]/5' 
                      : 'bg-gradient-to-br from-blue-400/5 via-transparent to-blue-300/5'
                    } opacity-0 group-hover:opacity-100 transition-opacity duration-700 theme-transition`}></div>
                    
                    <div className={`absolute -inset-0.5 ${isDark 
                      ? 'bg-gradient-to-r from-[#3B82F6]/0 via-[#3B82F6]/20 to-[#3B82F6]/0' 
                      : 'bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0'
                    } rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-700 animate-gradient-x theme-transition`}></div>
                    
                    <div className="p-6 flex flex-col h-full relative">
                      <div className={`absolute -right-20 -top-20 w-52 h-52 ${isDark 
                        ? 'bg-gradient-to-br from-[#3B82F6]/10 to-transparent' 
                        : 'bg-gradient-to-br from-blue-400/10 to-transparent'
                      } rounded-full blur-xl group-hover:scale-150 transition-transform duration-1000 opacity-0 group-hover:opacity-100 theme-transition`}></div>
                      
                      <div className="flex justify-between items-start mb-5 relative z-10">
                        <div 
                          className="relative group/icon transform transition-all duration-300 group-hover:rotate-2 group-hover:scale-105"
                          onClick={() => redirectTo(`${routes.buckets}/${bucket.name}`)}
                        >
                          <div className="absolute -inset-1 bg-gradient-to-r from-[#3B82F6]/60 to-[#60A5FA]/60 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                          
                          <div className="relative bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-lg p-4 text-white shadow-lg shadow-[#3B82F6]/20 cursor-pointer transform transition-all duration-300 group-hover/icon:shadow-[#3B82F6]/40 group-hover/icon:shadow-xl">
                            <FolderOpen size={24} className="relative z-10 transform transition-transform group-hover/icon:scale-110" />
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 z-20">
                          <button
                            onClick={(e) => { 
                              e.stopPropagation();
                              toggleStar(bucket.name); 
                            }}
                            className={`p-2 rounded-full transition-all duration-300 ${isDark 
                              ? 'text-gray-400 hover:text-yellow-400 hover:bg-gray-700' 
                              : 'text-gray-500 hover:text-yellow-500 hover:bg-gray-100'
                            } ${isBucketStarred(bucket.name) ? (isDark ? 'text-yellow-400' : 'text-yellow-500') : ''}`}
                            title={isBucketStarred(bucket.name) ? t('remove_from_starred') : t('add_to_starred')}
                          >
                            {isBucketStarred(bucket.name) ? <StarOff size={18} /> : <Star size={18} />}
                          </button>
                          <BucketDeleteButton bucketName={bucket.name} setRefetch={setRefetchIndex}></BucketDeleteButton>
                        </div>
                      </div>
                      
                      <Button
                        variant="link"
                        className={`text-xl ${isDark ? 'text-white hover:text-[#3B82F6]' : 'text-gray-800 hover:text-blue-600'} transition-all duration-300 text-left p-0 flex-grow relative z-10 group/title theme-transition`}
                        onClick={() => redirectTo(`${routes.buckets}/${bucket.name}`)}
                      >
                        <div className="overflow-hidden">
                          <h3 className={`font-semibold text-xl mb-2 truncate transform transition-all duration-300 group-hover/title:translate-x-1 ${isDark 
                            ? 'group-hover/title:text-[#3B82F6]' 
                            : 'group-hover/title:text-blue-600'
                          } theme-transition`}>
                            {bucket.name}
                          </h3>
                        </div>
                      </Button>
                      
                      <div className={`mt-6 pt-4 ${isDark ? 'border-gray-700/50' : 'border-gray-200/70'} border-t flex items-center justify-between ${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm relative z-10 theme-transition`}>
                        <div className="flex items-center">
                          <Clock size={16} className={`mr-1.5 ${isDark ? 'text-[#3B82F6]' : 'text-blue-500'} theme-transition`} />
                          <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} theme-transition`}>
                            {formatDate(bucket.creationDate)}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <CheckCircle size={16} className="text-green-400 mr-2" />
                          <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} theme-transition`}>
                            {t('available')}
                          </span>
                        </div>
                      </div>
                      
                      <div className={`mt-3 flex text-xs justify-between ${isDark ? 'text-gray-500' : 'text-gray-400'} theme-transition`}>
                        <span>{bucket.filesCount} файл(ов)</span>
                        <span>{formatFileSize(bucket.size)}</span>
                      </div>
                    </div>
                  </div>
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
                    <div className="col-span-5 md:col-span-5">{t('name')}</div>
                    <div className="col-span-2 md:col-span-2 text-center">{t('status')}</div>
                    <div className="col-span-2 md:col-span-2 text-center">{t('files')}</div>
                    <div className="col-span-2 md:col-span-2 text-center">{t('creation_date')}</div>
                    <div className="col-span-1 md:col-span-1 text-right">{t('actions')}</div>
                  </div>
                  
                  {filteredBuckets.map((bucket, index) => (
                    <motion.div 
                      key={bucket.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`grid grid-cols-12 py-4 px-6 ${isDark 
                        ? 'border-gray-800/40 hover:bg-[#1F2937]' 
                        : 'border-gray-200/40 hover:bg-gray-50'
                      } border-b transition-colors duration-200 relative group theme-transition`}
                    >
                      <div className="col-span-5 md:col-span-5 flex items-center">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${isDark 
                          ? 'bg-gradient-to-r from-[#3B82F6]/20 to-[#60A5FA]/20 text-blue-300' 
                          : 'bg-gradient-to-r from-blue-500/10 to-blue-400/10 text-blue-600'
                        } flex items-center justify-center mr-3 theme-transition`}>
                          <FolderOpen size={24} className="drop-shadow-md" />
                        </div>
                        <div 
                          className={`truncate font-medium ${isDark 
                            ? 'text-white hover:text-[#3B82F6]' 
                            : 'text-gray-800 hover:text-blue-600'
                          } transition-colors duration-300 cursor-pointer theme-transition`}
                          onClick={() => redirectTo(`${routes.buckets}/${bucket.name}`)}
                        >
                          {bucket.name}
                        </div>
                      </div>
                      
                      <div className="col-span-2 md:col-span-2 flex items-center justify-center">
                        <span className="flex items-center">
                          <CheckCircle size={16} className="text-green-400 mr-2" />
                          <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} theme-transition`}>
                            {t('available')}
                          </span>
                        </span>
                      </div>
                      
                      <div className="col-span-2 md:col-span-2 flex items-center justify-center">
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm theme-transition`}>
                          {bucket.filesCount} / {formatFileSize(bucket.size)}
                        </span>
                      </div>
                      
                      <div className="col-span-2 md:col-span-2 flex items-center justify-center">
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm theme-transition`}>
                          {formatDate(bucket.creationDate)}
                        </span>
                      </div>
                      
                      <div className="col-span-1 md:col-span-1 flex items-center justify-end space-x-1">
                        <button
                          onClick={(e) => { 
                            e.stopPropagation();
                            toggleStar(bucket.name);
                          }}
                          className={`p-2 rounded-full transition-all duration-300 ${isDark 
                            ? 'text-gray-400 hover:text-yellow-400 hover:bg-gray-700' 
                            : 'text-gray-500 hover:text-yellow-500 hover:bg-gray-100'
                          } ${isBucketStarred(bucket.name) ? (isDark ? 'text-yellow-400' : 'text-yellow-500') : ''}`}
                          title={isBucketStarred(bucket.name) ? t('remove_from_starred') : t('add_to_starred')}
                        >
                          {isBucketStarred(bucket.name) ? <StarOff size={16} /> : <Star size={16} />}
                        </button>
                        <BucketDeleteButton 
                          bucketName={bucket.name} 
                          setRefetch={setRefetchIndex} 
                          classes={`p-2 rounded-full ${isDark 
                            ? 'text-gray-300 hover:text-red-300 hover:bg-[#111827]/70' 
                            : 'text-gray-500 hover:text-red-500 hover:bg-gray-100/70'
                          } transition-all duration-300 theme-transition`}
                          iconOnly={true}
                        />
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
                  ? 'bg-gradient-to-r from-[#3B82F6]/20 to-[#60A5FA]/20' 
                  : 'bg-gradient-to-r from-blue-500/20 to-blue-400/10'
                } rounded-full blur-xl opacity-80 animate-pulse-slow theme-transition`}></div>
                <div className={`relative z-10 p-8 rounded-full ${isDark 
                  ? 'bg-gradient-to-br from-[#1E293B] to-[#111827] border-gray-700/40' 
                  : 'bg-gradient-to-br from-white to-gray-50 border-gray-200/70'
                } border shadow-2xl transform transition-transform duration-700 group-hover:rotate-3 group-hover:scale-110 theme-transition`}>
                  <SlidersHorizontal size={64} className={`${isDark ? 'text-gray-500' : 'text-gray-400'} theme-transition`} />
                </div>
                <div className={`absolute -inset-0.5 ${isDark 
                  ? 'bg-gradient-to-r from-[#3B82F6]/0 via-[#3B82F6]/20 to-[#3B82F6]/0' 
                  : 'bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0'
                } rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-gradient-x theme-transition`}></div>
              </div>
              
              <h2 className={`text-4xl font-bold ${isDark 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400' 
                : 'text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600'
              } mt-8 mb-3 theme-transition`}>
                {t('buckets_not_found')}
              </h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6 text-center max-w-md text-lg theme-transition`}>
                {t('no_matching_buckets')}
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
                  ? 'bg-gradient-to-r from-[#3B82F6]/20 to-[#60A5FA]/20' 
                  : 'bg-gradient-to-r from-blue-500/20 to-blue-400/10'
                } rounded-full blur-xl opacity-80 animate-pulse-slow theme-transition`}></div>
                <div className={`relative z-10 p-8 rounded-full ${isDark 
                  ? 'bg-gradient-to-br from-[#1E293B] to-[#111827] border-gray-700/40' 
                  : 'bg-gradient-to-br from-white to-gray-50 border-gray-200/70'
                } border shadow-2xl transform transition-transform duration-700 group-hover:rotate-3 group-hover:scale-110 theme-transition`}>
                  <CloudOff size={64} className={`${isDark ? 'text-gray-500' : 'text-gray-400'} theme-transition`} />
                </div>
                <div className={`absolute -inset-0.5 ${isDark 
                  ? 'bg-gradient-to-r from-[#3B82F6]/0 via-[#3B82F6]/20 to-[#3B82F6]/0' 
                  : 'bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0'
                } rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-gradient-x theme-transition`}></div>
              </div>
              
              <h2 className={`text-4xl font-bold ${isDark 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400' 
                : 'text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600'
              } mt-8 mb-3 theme-transition`}>
                {t('buckets_not_found')}
              </h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-10 text-center max-w-md text-lg theme-transition`}>
                {t('create_first_bucket')}
              </p>
              
              <div className="group">
                <BucketCreateButton classes={`bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] hover:from-[#2563EB] hover:to-[#3B82F6] text-white h-12 px-8 rounded-xl text-base font-medium transition-all duration-500 shadow-xl ${isDark ? 'shadow-blue-500/20' : 'shadow-blue-500/10'} flex items-center transform hover:scale-105 theme-transition`} />
              </div>
            </div>
          )}
        </div>
      </Box>
    </main>
  )
}

export default Page
