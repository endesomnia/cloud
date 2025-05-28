'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { getFilesByBucket } from '@src/shared/api'
import { formatDate, formatFileSize } from '@src/shared/lib'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuTrigger } from '@shared/ui'
import {
  ArrowLeft,
  Upload,
  FolderOpen,
  File,
  Clock,
  HardDrive,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ArrowDownUp,
  Search,
  X,
  ChevronDown,
  Check,
  Star,
  StarOff
} from 'lucide-react'
import { Box } from '@shared/ui'
import { routes } from '@shared/constant'
import { motion } from 'framer-motion'
import { useViewMode } from '@src/shared/context/viewModeContext'
import { FileUploadButton, FileUploadForm } from '@src/features/file/upload'
import { FileRenameForm } from '@src/features/file/rename'
import { FileDownloadButton } from '@src/features/file/download' 
import { FileMoveButton, FileMoveForm } from '@src/features/file/move'
import { FileDeleteButton, FileDeleteForm } from '@src/features/file/delete/ui'
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

interface Props {
  params: { bucketName: string }
}

interface FileObj {
  name: string
  lastModified: Date
  etag: string
  size: number
}

type SortOption = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc' | 'size-asc' | 'size-desc';
type FilterOption = 'all' | 'large' | 'medium' | 'small';

const Page = ({ params }: Props) => {
  const [files, setFiles] = useState<FileObj[]>([])
  const [filteredFiles, setFilteredFiles] = useState<FileObj[]>([])
  const [refetchIndex, setRefetchIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [currentFolder, setCurrentFolder] = useState("")
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('name-asc')
  const [filterOption, setFilterOption] = useState<FilterOption>('all')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const filterDropdownRef = useRef<HTMLDivElement>(null)
  const sortDropdownRef = useRef<HTMLDivElement>(null)
  const [starredItems, setStarredItems] = useState<Map<string, ApiStarredItem>>(new Map());
  
  const { bucketFilesPageView, setBucketFilesPageView, isMounted } = useViewMode()
  const router = useRouter()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { t } = useLanguage()
  const { user } = useUserStore();
  const effectiveUserId = user?.id;
  const searchParams = useSearchParams();
  const highlight = searchParams.get('highlight');
  const [highlightedFile, setHighlightedFile] = useState<string | null>(null);
  const [hasHighlighted, setHasHighlighted] = useState(false);
  const fileRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const pathname = usePathname();

  const fetchData = useCallback(async () => {
    if (!effectiveUserId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [filesData, starredData] = await Promise.all([
        getFilesByBucket({ bucketname: params.bucketName }),
        getStarredItems({ userId: effectiveUserId })
      ]);

      if (Array.isArray(filesData)) {
        setFiles(filesData);
      } else {
        console.error('Expected filesData to be an array, received:', filesData);
        setFiles([]);
      }

      if (Array.isArray(starredData)) {
        const starredMap = new Map<string, ApiStarredItem>();
        starredData.forEach(item => {
          if (item.bucketName === params.bucketName) {
             starredMap.set(`${item.bucketName}/${item.fileName}`, item);
          }
        });
        setStarredItems(starredMap);
      } else {
        setStarredItems(new Map());
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setFiles([]);
      setStarredItems(new Map());
      toast.error(t('error_loading_data'));
    } finally {
      setIsLoading(false);
    }
  }, [effectiveUserId, params.bucketName, t]);

  useEffect(() => {
    if (effectiveUserId) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchIndex, effectiveUserId, fetchData]);

  useEffect(() => {
    let result = [...files];
    
    if (searchQuery) {
      result = result.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    switch (filterOption) {
      case 'small':
        result = result.filter(file => file.size < 100000); // меньше 100 KB
        break;
      case 'medium':
        result = result.filter(file => file.size >= 100000 && file.size < 1000000); // от 100 KB до 1 MB
        break;
      case 'large':
        result = result.filter(file => file.size >= 1000000); // более 1 MB
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
        result.sort((a, b) => new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime());
        break;
      case 'date-desc':
        result.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
        break;
      case 'size-asc':
        result.sort((a, b) => a.size - b.size);
        break;
      case 'size-desc':
        result.sort((a, b) => b.size - a.size);
        break;
    }
    
    setFilteredFiles(result);
  }, [files, searchQuery, filterOption, sortOption]);

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

  useEffect(() => {
    if (highlight && files.some(f => f.name === highlight) && !hasHighlighted) {
      setHighlightedFile(highlight);
      setHasHighlighted(true);

      setTimeout(() => {
        setHighlightedFile(null);
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        params.delete('highlight');
        router.replace(
          `${pathname}${params.toString() ? `?${params.toString()}` : ''}`,
          { scroll: false }
        );
      }, 3000);

      setTimeout(() => {
        const ref = fileRefs.current[highlight];
        if (ref) {
          ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
    if (!highlight && hasHighlighted) {
      setHasHighlighted(false);
    }
  }, [highlight, files, router, searchParams, pathname, hasHighlighted]);

  const setRefetch = (value: any) => {
    setRefetchIndex(prev => prev + 1)
  }
  
  const isFileStarred = useCallback((fileName: string) => {
    const key = `${params.bucketName}/${fileName}`;
    return starredItems.has(key);
  }, [starredItems, params.bucketName]);

  const toggleStar = useCallback(async (fileName: string) => {
    if (!effectiveUserId) {
      toast.error(t('auth_required'));
      return;
    }

    const key = `${params.bucketName}/${fileName}`;
    const isStarred = isFileStarred(fileName);
    const starredItem = starredItems.get(key);

    const optimisticStarredItems = new Map(starredItems);
    if (isStarred && starredItem) {
      optimisticStarredItems.delete(key);
    } else {
      const tempStarredItem: ApiStarredItem = {
        id: 'temp-' + Date.now(),
        userId: effectiveUserId,
        bucketName: params.bucketName,
        fileName: fileName,
        type: 'file',
        createdAt: new Date().toISOString(),
      };
      optimisticStarredItems.set(key, tempStarredItem);
    }
    setStarredItems(optimisticStarredItems);

    try {
      if (isStarred && starredItem) {
        const success = await removeStarredItem({ id: starredItem.id, userId: effectiveUserId });
        if (!success) {
          throw new Error(t('error_removing_from_starred'));
        }
        toast.success(t('removed_from_starred'));
      } else {
        const newItem = await addStarredItem({
          userId: effectiveUserId,
          bucketName: params.bucketName,
          fileName: fileName,
          type: 'file',
        });
        if (!newItem) {
          throw new Error(t('error_adding_to_starred'));
        }
        setStarredItems(prev => new Map(prev).set(key, newItem));
        toast.success(t('added_to_starred'));
      }
    } catch (error: any) {
      toast.error(error.message || t('error_updating_starred'));
      setStarredItems(starredItems);
    }
  }, [effectiveUserId, starredItems, params.bucketName, isFileStarred, t]);

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
      case 'all': return t('all_files');
      case 'small': return t('small_files');
      case 'medium': return t('medium_files');
      case 'large': return t('large_files');
      default: return t('filters');
    }
  };

  const getDisplayBucketName = (bucketFullName: string): string => {
    if (effectiveUserId && bucketFullName.startsWith(effectiveUserId + '-')) {
      return bucketFullName.substring(effectiveUserId.length + 1);
    }
    return bucketFullName;
  };

  const getDisplayFileName = (fullName: string): string => {
    if (effectiveUserId && fullName.startsWith(effectiveUserId + '_')) {
      return fullName.substring(effectiveUserId.length + 1);
    }
    return fullName;
  };

  return (
    <main className={`min-h-screen overflow-hidden ${!isDark && 'bg-gray-50'} theme-transition`}>
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
              <button 
                onClick={() => router.push(routes.buckets)}
                className={`mr-4 p-2 rounded-lg ${isDark 
                  ? 'bg-[#1E293B]/70 hover:bg-[#1E293B] text-gray-300 hover:text-white border-gray-700/30 hover:border-[#3B82F6]/40' 
                  : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-gray-200 hover:border-blue-500/40'
                } transition-all duration-300 border hover:shadow-md hover:shadow-[#3B82F6]/5 group theme-transition`}
              >
                <ArrowLeft size={20} className={`${isDark 
                  ? 'group-hover:text-[#3B82F6]' 
                  : 'group-hover:text-blue-500'
                } transition-colors duration-300 theme-transition`} />
              </button>
              
              <div className="flex items-center">
                <div className="relative mr-3 bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] p-2.5 rounded-md shadow-md shadow-[#3B82F6]/20 group animate-float transform-gpu">
                  <FolderOpen size={24} className="text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>
                </div>
                <div>
                  <h1 className={`text-3xl md:text-4xl font-bold ${isDark 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300' 
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600'
                  } theme-transition truncate max-w-md md:max-w-lg lg:max-w-2xl`}>
                    {getDisplayBucketName(params.bucketName)}
                  </h1>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm mt-1 theme-transition`}>{t('files_in_folder')}</p>
                </div>
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
                    ? 'bg-[#1E293B]/60 hover:bg-[#1E293B]/80 focus:bg-[#1E293B] border-gray-700/50 text-white focus:ring-[#3B82F6]/50 focus:border-[#3B82F6]/50' 
                    : 'bg-white/60 hover:bg-white/80 focus:bg-white border-gray-300 text-gray-700 focus:ring-blue-500/50 focus:border-blue-500/50'
                  } border rounded-lg transition-all duration-200 theme-transition`} 
                  placeholder={`${t('search')}...`} 
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
                  onClick={() => setBucketFilesPageView('grid')} 
                  className={`p-2 rounded-md transition-all duration-300 ${isMounted && bucketFilesPageView === 'grid' 
                    ? 'bg-[#3B82F6] text-white' 
                    : isDark
                      ? 'bg-[#1E293B]/70 hover:bg-[#1E293B] text-gray-300 hover:text-white border-gray-700/30 hover:border-[#3B82F6]/40' 
                      : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-gray-200 hover:border-blue-500/40'
                  } border theme-transition`}
                  title={t('grid_view')}
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setBucketFilesPageView('list')} 
                  className={`p-2 rounded-md transition-all duration-300 ${isMounted && bucketFilesPageView === 'list' 
                    ? 'bg-[#3B82F6] text-white' 
                    : isDark
                      ? 'bg-[#1E293B]/70 hover:bg-[#1E293B] text-gray-300 hover:text-white border-gray-700/30 hover:border-[#3B82F6]/40' 
                      : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-gray-200 hover:border-blue-500/40'
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
                        : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-gray-200 hover:border-blue-500/40 hover:shadow-blue-500/5'
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
                        {(['all', 'small', 'medium', 'large'] as FilterOption[]).map(option => (
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
                        : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-gray-200 hover:border-blue-500/40 hover:shadow-blue-500/5'
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
              
              <FileUploadButton classes={`${isDark 
                ? 'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] hover:from-[#2563EB] hover:to-[#3B82F6]' 
                : 'bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB]'
              } text-white h-11 px-5 rounded-lg text-sm font-medium transition-all duration-300 shadow-md shadow-blue-500/20 flex items-center group theme-transition`}/>
              <FileUploadForm bucketName={params.bucketName} setRefetch={setRefetch} onUploadComplete={fetchData} />
            </div>
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
          ) : filteredFiles.length > 0 ? (
            bucketFilesPageView === 'grid' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in animation-delay-200">
                {filteredFiles.map((file, index) => (
                  <div 
                    key={index}
                    ref={el => { fileRefs.current[file.name] = el; }}
                    className={`group ${isDark 
                      ? 'bg-gradient-to-br from-[#1F2937]/90 to-[#1F2937]/70 border-gray-800/60 hover:border-[#3B82F6]/40 hover:shadow-[#3B82F6]/10' 
                      : 'bg-gradient-to-br from-white/90 to-white/70 border-gray-200 hover:border-blue-500/40 hover:shadow-blue-500/10'
                    } border rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 backdrop-blur-sm transform-gpu hover:translate-y-[-5px] relative theme-transition${highlightedFile && highlightedFile === file.name ? ' ring-4 ring-blue-400/80 z-20' : ''}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`absolute inset-0 w-full h-full ${isDark 
                      ? 'bg-gradient-to-br from-[#3B82F6]/5 via-transparent to-[#60A5FA]/5' 
                      : 'bg-gradient-to-br from-blue-500/5 via-transparent to-blue-400/5'
                    } opacity-0 group-hover:opacity-100 transition-opacity duration-700 theme-transition`}></div>
                    
                    <div className={`absolute -inset-0.5 ${isDark 
                      ? 'bg-gradient-to-r from-[#3B82F6]/0 via-[#3B82F6]/20 to-[#3B82F6]/0' 
                      : 'bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0'
                    } rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-700 animate-gradient-x theme-transition`}></div>
                    
                    <div className="p-8 flex flex-col h-full relative">
                      <div className={`absolute -right-20 -top-20 w-52 h-52 ${isDark 
                        ? 'bg-gradient-to-br from-[#3B82F6]/10 to-transparent' 
                        : 'bg-gradient-to-br from-blue-400/10 to-transparent'
                      } rounded-full blur-xl group-hover:scale-150 transition-transform duration-1000 opacity-0 group-hover:opacity-100 theme-transition`}></div>
                      
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="relative group/icon transform transition-all duration-300 group-hover:rotate-2 group-hover:scale-105">
                          <div className="absolute -inset-1 bg-gradient-to-r from-[#3B82F6]/60 to-[#60A5FA]/60 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                          <div className="relative bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-lg p-4 text-white shadow-lg shadow-[#3B82F6]/20 transform transition-all duration-300 group-hover/icon:shadow-[#3B82F6]/40 group-hover/icon:shadow-xl">
                            <File size={28} className="relative z-10 transform transition-transform group-hover/icon:scale-110" />
                          </div>
                        </div>
                        
                        <div className="flex items-center flex-wrap gap-2 justify-end pl-2">
                          <button
                            onClick={(e) => { 
                              e.stopPropagation();
                              toggleStar(file.name);
                            }}
                            className={`p-2 rounded-full transition-all duration-300 ${isDark 
                              ? 'text-gray-400 hover:text-yellow-400 hover:bg-gray-700' 
                              : 'text-gray-500 hover:text-yellow-500 hover:bg-gray-100'
                            } ${isFileStarred(file.name) ? (isDark ? 'text-yellow-400' : 'text-yellow-500') : ''}`}
                            title={isFileStarred(file.name) ? t('remove_from_starred') : t('add_to_starred')}
                          >
                            {isFileStarred(file.name) ? <StarOff size={18} /> : <Star size={18} />}
                          </button>
                          <FileRenameForm bucketName={params.bucketName} filename={file.name} setRefetch={setRefetch} />
                          <FileDownloadButton bucketName={params.bucketName} filename={file.name} setRefetch={setRefetch} />
                          <FileMoveButton />
                          <FileMoveForm bucketName={params.bucketName} fileName={file.name} setRefetch={setRefetch} />
                          <FileDeleteButton fileName={file.name} />
                          <FileDeleteForm bucketName={params.bucketName} fileName={file.name} setRefetch={setRefetch} />
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className={`font-semibold text-2xl mb-4 truncate ${isDark 
                          ? 'text-white group-hover:text-[#3B82F6]' 
                          : 'text-gray-800 group-hover:text-blue-600'
                        } transition-colors duration-300 theme-transition`}>
                          {getDisplayFileName(file.name)}
                        </h3>
                        
                        <div className={`space-y-3 text-base ${isDark ? 'text-gray-400' : 'text-gray-500'} theme-transition`}>
                          <div className="flex items-center">
                            <HardDrive size={18} className={`mr-3 ${isDark ? 'text-[#3B82F6]' : 'text-blue-500'} theme-transition`} />
                            <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} theme-transition`}>{formatFileSize(file.size)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock size={18} className={`mr-3 ${isDark ? 'text-[#3B82F6]' : 'text-blue-500'} theme-transition`} />
                            <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} theme-transition`}>{formatDate(file.lastModified)}</span>
                          </div>
                        </div>
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
                    ? 'border-b border-gray-800/60 text-gray-400' 
                    : 'border-b border-gray-200 text-gray-500'
                  } text-sm font-medium theme-transition`}>
                    <div className="col-span-4 md:col-span-5">{t('name')}</div>
                    <div className="col-span-3 md:col-span-2 text-center">{t('size')}</div>
                    <div className="col-span-3 md:col-span-3 text-center">{t('last_modified')}</div>
                    <div className="col-span-2 md:col-span-2 text-right">{t('actions')}</div>
                  </div>
                  
                  {filteredFiles.map((file, index) => (
                    <motion.div 
                      key={index}
                      ref={el => { fileRefs.current[file.name] = el; }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`grid grid-cols-12 py-4 px-6 ${isDark 
                        ? 'border-b border-gray-800/40 hover:bg-[#1F2937]' 
                        : 'border-b border-gray-200/40 hover:bg-gray-50'
                      } transition-colors duration-200 relative group theme-transition${highlightedFile && highlightedFile === file.name ? ' ring-4 ring-blue-400/80 z-20' : ''}`}
                    >
                      <div className="col-span-4 md:col-span-5 flex items-center">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${isDark 
                          ? 'bg-gradient-to-r from-[#3B82F6]/20 to-[#60A5FA]/20 text-blue-300' 
                          : 'bg-gradient-to-r from-blue-500/10 to-blue-400/10 text-blue-600'
                        } flex items-center justify-center mr-3 theme-transition`}>
                          <File size={24} className="drop-shadow-md" />
                        </div>
                        <div className={`truncate font-medium ${isDark 
                          ? 'text-white hover:text-[#3B82F6]' 
                          : 'text-gray-800 hover:text-blue-600'
                        } transition-colors duration-300 theme-transition`}>
                          {getDisplayFileName(file.name)}
                        </div>
                      </div>
                      
                      <div className={`col-span-3 md:col-span-2 flex items-center justify-center text-sm ${isDark 
                        ? 'text-gray-300' 
                        : 'text-gray-600'
                      } theme-transition`}>
                        {formatFileSize(file.size)}
                      </div>
                      
                      <div className={`col-span-3 md:col-span-3 flex items-center justify-center text-sm ${isDark 
                        ? 'text-gray-300' 
                        : 'text-gray-600'
                      } theme-transition`}>
                        {formatDate(file.lastModified)}
                      </div>
                      
                      <div className="col-span-2 md:col-span-2 flex items-center justify-end space-x-2">
                        <button
                          onClick={(e) => { 
                            e.stopPropagation();
                            toggleStar(file.name);
                          }}
                          className={`p-2 rounded-full transition-all duration-300 ${isDark 
                            ? 'text-gray-400 hover:text-yellow-400 hover:bg-gray-700' 
                            : 'text-gray-500 hover:text-yellow-500 hover:bg-gray-100'
                          } ${isFileStarred(file.name) ? (isDark ? 'text-yellow-400' : 'text-yellow-500') : ''}`}
                          title={isFileStarred(file.name) ? t('remove_from_starred') : t('add_to_starred')}
                        >
                          {isFileStarred(file.name) ? <StarOff size={16} /> : <Star size={16} />}
                        </button>
                        <FileDownloadButton 
                          bucketName={params.bucketName} 
                          filename={file.name} 
                          setRefetch={setRefetch} 
                          buttonClassName={`p-2 rounded-full ${isDark 
                            ? 'text-gray-300 hover:text-blue-300 hover:bg-[#111827]/70' 
                            : 'text-gray-500 hover:text-blue-500 hover:bg-gray-100'
                          } transition-all duration-300 theme-transition`} 
                          iconOnly={true} 
                        />
                        <FileDeleteButton
                          fileName={file.name}
                          buttonClassName={`p-2 rounded-full ${isDark 
                            ? 'text-gray-300 hover:text-red-300 hover:bg-[#111827]/70' 
                            : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'
                          } transition-all duration-300 theme-transition`}
                          iconOnly={true}
                        />
                        <FileDeleteForm bucketName={params.bucketName} fileName={file.name} setRefetch={setRefetch} />
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
                  : 'bg-gradient-to-r from-blue-500/20 to-blue-400/20'
                } rounded-full blur-xl opacity-80 animate-pulse-slow theme-transition`}></div>
                <div className={`relative z-10 p-8 rounded-full ${isDark 
                  ? 'bg-gradient-to-br from-[#1E293B] to-[#111827] border-gray-700/40' 
                  : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
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
                {t('files_not_found')}
              </h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6 text-center max-w-md text-lg theme-transition`}>
                {t('no_matching_files')}
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
                  : 'bg-gradient-to-r from-blue-500/20 to-blue-400/20'
                } rounded-full blur-xl opacity-80 animate-pulse-slow theme-transition`}></div>
                <div className={`relative z-10 p-8 rounded-full ${isDark 
                  ? 'bg-gradient-to-br from-[#1E293B] to-[#111827] border-gray-700/40' 
                  : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                } border shadow-2xl transform transition-transform duration-700 group-hover:rotate-3 group-hover:scale-110 theme-transition`}>
                  <Upload size={64} className={`${isDark ? 'text-gray-500' : 'text-gray-400'} theme-transition`} />
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
                {t('files_not_found')}
              </h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-10 text-center max-w-md text-lg theme-transition`}>
                {t('no_files_in_bucket')}
              </p>
              <p className={`${isDark ? 'text-gray-400/70' : 'text-gray-500/70'} mb-10 text-center max-w-md text-base theme-transition`}>
                {t('upload_your_first_file')}
              </p>
              
              <div className="group">
                <FileUploadButton classes={`${isDark 
                  ? 'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] hover:from-[#2563EB] hover:to-[#3B82F6]' 
                  : 'bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB]'
                } text-white h-12 px-8 rounded-xl text-base font-medium transition-all duration-500 shadow-xl shadow-blue-500/20 flex items-center transform hover:scale-105 theme-transition`}/>
              </div>
            </div>
          )}
        </div>
      </Box>
    </main>
  )
}

export default Page
