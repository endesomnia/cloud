import React, { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react'
import { moveFile, listBuckets, Bucket } from '@src/shared/api'
import { Box, Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input } from '@shared/ui'
import { useModalStore } from '@src/shared/modal'
import { SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { useFileMoveFormModel } from '../model'
import { ArrowRightLeft, Check, FolderTree, AlertCircle, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTheme } from '@src/shared/context/themeContext'
import { useLanguage } from '@src/shared/context/languageContext'

interface FileMoveForm {
  targetBucket: string
}

interface Props {
  setRefetch: Dispatch<SetStateAction<number>>
  bucketName: string
  fileName: string
}

export const FileMoveForm = ({ setRefetch, bucketName, fileName }: Props) => {
  const { handleSubmit, register, reset, setValue } = useFileMoveFormModel()
  const { isOpen, onClose, type } = useModalStore()
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [animateSuccess, setAnimateSuccess] = useState(false)
  const [buckets, setBuckets] = useState<Bucket[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [filteredBuckets, setFilteredBuckets] = useState<Bucket[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { t } = useLanguage()
  const { data: session } = useSession()
  
  const modalIsOpen = isOpen && type === 'fileMove'
  
  useEffect(() => {
    if (modalIsOpen) {
      const fetchBuckets = async () => {
        if (!session?.user?.id) return;
        try {
          const bucketsData = await listBuckets(session.user.id)
          const filteredData = bucketsData.filter(bucket => bucket.name !== bucketName)
          setBuckets(filteredData)
        } catch (error) {
          console.error('Ошибка при загрузке списка папок:', error)
        }
      }
      
      fetchBuckets()
    }
  }, [modalIsOpen, bucketName, session?.user?.id])
  
  useEffect(() => {
    if (inputValue) {
      setValue('targetBucket', inputValue);
    }
  }, [inputValue, setValue]);
  
  useEffect(() => {
    if (modalIsOpen) {
      setInputValue('')
      setFilteredBuckets([])
      setShowSuggestions(false)
      setValidationError(null)
    }
  }, [modalIsOpen])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    
    if (value.trim()) {
      const filtered = buckets.filter(bucket => 
        bucket.name.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredBuckets(filtered)
      setShowSuggestions(true)
    } else {
      setFilteredBuckets([])
      setShowSuggestions(false)
    }
    
    setValidationError(null)
  }
  
  const selectBucket = (bucketName: string) => {
    setInputValue(bucketName)
    setValue('targetBucket', bucketName)
    setShowSuggestions(false)
    setValidationError(null)
  }

  const onSubmit: SubmitHandler<FileMoveForm> = async (data) => {
    setValidationError(null)
    setIsLoading(true)
    
    const targetBucketName = inputValue.trim() || data.targetBucket?.trim()
    
    if (!targetBucketName) {
      setValidationError(t("please_specify_bucket_name"))
      setIsLoading(false)
      return
    }
    
    if (targetBucketName === bucketName) {
      setValidationError(t("file_already_in_this_bucket"))
      setIsLoading(false)
      return
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === targetBucketName)
    
    if (!bucketExists && targetBucketName !== "") {
      const createNewFolder = window.confirm(`Папка "${targetBucketName}" не существует. Создать новую папку?`)
      
      if (!createNewFolder) {
        setIsLoading(false)
        return
      }
    }
    
    try {
      const res = await moveFile({
        sourceBucket: bucketName,
        targetBucket: targetBucketName,
        filename: fileName,
        userId: session?.user?.id ?? '',
      })
      
      if (res.error) {
        toast.error(res.error || t("error_moving_file"))
        setIsLoading(false)
        return
      }
      
      toast.success(t("moved_successfully"))
      setRefetch((prev: number) => prev + 1)
      reset()
      setInputValue('')
      onClose()
    } catch (error) {
      console.error('Ошибка при перемещении файла:', error)
      toast.error(t("error_moving_file"))
    } finally {
      setIsLoading(false)
    }
  }

  const clearInput = () => {
    setInputValue('')
    setValue('targetBucket', '')
    setFilteredBuckets([])
    setShowSuggestions(false)
    setValidationError(null)
    
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <Box className="absolute w-full flex justify-center">
      <Dialog open={modalIsOpen} onOpenChange={onClose}>
        <DialogContent className={`${isDark 
          ? 'bg-gradient-to-b from-[#0A0F1A] to-[#111827] border-gray-800/60' 
          : 'bg-white border-gray-200'
        } border shadow-2xl overflow-visible
          before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#4F46E5]/0 before:via-[#4F46E5]/5 to-[#4F46E5]/0 before:rounded-md
          perspective-800 max-w-md sm:max-w-lg w-[90vw] p-0 theme-transition`}>
          
          <div className="absolute -top-0.5 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#4F46E5] to-transparent rounded-t-md"></div>
          
          <div className={`absolute -z-10 top-[20%] right-[10%] w-[200px] h-[200px] ${isDark 
            ? 'bg-[#4F46E5]/5' 
            : 'bg-[#4F46E5]/5'
          } rounded-full blur-3xl opacity-40 theme-transition`}></div>
          <div className={`absolute -z-10 bottom-[10%] left-[20%] w-[180px] h-[180px] ${isDark 
            ? 'bg-[#7C3AED]/5' 
            : 'bg-[#7C3AED]/5'
          } rounded-full blur-3xl opacity-40 theme-transition`}></div>
          
          <div className={`absolute inset-0 ${isDark 
            ? "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" 
            : "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"
          } opacity-20 rounded-md theme-transition`}></div>
          
          <DialogHeader className="pt-7 pb-5 px-8">
            <div className="flex flex-col mb-6">
              <div className="flex items-center">
                <div className={`relative mr-3 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] p-2.5 rounded-md shadow-md ${isDark 
                  ? 'shadow-[#4F46E5]/20' 
                  : 'shadow-[#4F46E5]/30'
                } group animate-float transform-gpu theme-transition`}>
                  <ArrowRightLeft size={24} className="text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>
                </div>
                <DialogTitle className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${isDark 
                  ? 'from-white to-gray-400' 
                  : 'from-gray-900 to-gray-600'
                } theme-transition`}>
                  {t("move_file")}
                </DialogTitle>
              </div>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm ml-14 mt-1 theme-transition`}>
                {t("move_file_description")} {fileName} {t("from_bucket")} {bucketName}
              </p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-7">
              <div>
                <div className={`relative transition-all duration-300 ${isInputFocused ? 'scale-[1.02]' : 'scale-100'}`}>
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-[#4F46E5]/40 via-[#7C3AED]/40 to-[#4F46E5]/40 rounded-lg blur-sm transition-opacity duration-300 ${isInputFocused ? 'opacity-100' : 'opacity-0'}`}></div>
                  
                  <div className={`relative ${isDark 
                    ? 'bg-[#1E293B]/80 border-gray-700/50' 
                    : 'bg-white border-gray-300'
                  } backdrop-blur-sm rounded-lg border transition-all duration-300 theme-transition`}>
                    <label className={`absolute left-4 top-3 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'} font-medium theme-transition`}>{t("select_bucket")}</label>
                    
                    <div className="flex items-center relative">
                      <div className="pl-4 pt-10 pb-3">
                        <FolderTree size={20} className="text-[#4F46E5]" />
                      </div>
                    
                      <Input 
                        {...register('targetBucket')}
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder={t("select_bucket_first")}
                        className={`bg-transparent border-none shadow-none focus:ring-0 pt-10 pb-3 px-2 ${isDark 
                          ? 'text-white placeholder:text-gray-500' 
                          : 'text-gray-900 placeholder:text-gray-400'
                        } text-base w-full h-16 theme-transition`}
                        onFocus={() => {
                          setIsInputFocused(true)
                          if (buckets.length > 0) {
                            setFilteredBuckets(buckets)
                            setShowSuggestions(true)
                          }
                        }}
                        onBlur={() => {
                          setIsInputFocused(false)
                          setTimeout(() => {
                            setShowSuggestions(false)
                          }, 200)
                        }}
                        ref={inputRef}
                        autoFocus
                      />
                      
                      {inputValue && (
                        <button
                          type="button"
                          onClick={clearInput}
                          className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark 
                            ? 'text-gray-400 hover:text-white' 
                            : 'text-gray-400 hover:text-gray-900'
                          } transition-colors theme-transition`}
                        >
                          <X size={16} />
                        </button>
                      )}
                      
                      {showSuggestions && filteredBuckets.length > 0 && (
                        <div className={`absolute top-full left-0 w-full z-150 mt-1 ${isDark 
                          ? 'bg-[#1E293B] border-gray-700/50' 
                          : 'bg-white border-gray-200'
                        } border rounded-lg shadow-xl max-h-60 overflow-auto theme-transition`}>
                          {filteredBuckets.map((bucket) => (
                            <div 
                              key={bucket.name}
                              className={`flex items-center px-4 py-3 ${isDark 
                                ? 'hover:bg-[#2D3748]' 
                                : 'hover:bg-gray-50'
                              } cursor-pointer transition-colors theme-transition`}
                              onMouseDown={() => selectBucket(bucket.name)}
                            >
                              <FolderTree size={16} className="text-[#4F46E5] mr-2" />
                              <span className={`${isDark ? 'text-white' : 'text-gray-900'} theme-transition`}>{bucket.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {showSuggestions && buckets.length > 0 && filteredBuckets.length === 0 && (
                        <div className={`absolute top-full left-0 w-full z-50 mt-1 ${isDark 
                          ? 'bg-[#1E293B] border-gray-700/50' 
                          : 'bg-white border-gray-200'
                        } border rounded-lg shadow-xl theme-transition`}>
                          <div className="flex items-center px-4 py-3 text-gray-400">
                            <AlertCircle size={16} className="mr-2" />
                            <span>{t("no_buckets")}</span>
                          </div>
                        </div>
                      )}
                      
                      {!showSuggestions && buckets.length === 0 && (
                        <div className={`absolute top-full left-0 w-full z-50 mt-1 ${isDark 
                          ? 'bg-[#1E293B] border-gray-700/50' 
                          : 'bg-white border-gray-200'
                        } border rounded-lg shadow-xl theme-transition`}>
                          <div className="flex items-center px-4 py-3 text-gray-400">
                            <AlertCircle size={16} className="mr-2" />
                            <span>{t("no_buckets")}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="h-6 mt-2">
                  {validationError && (
                    <div className="flex items-center text-red-400 text-sm">
                      <AlertCircle size={14} className="mr-1" />
                      <span>{validationError}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-2 pb-4 flex justify-end">
                {animateSuccess ? (
                  <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 text-white h-12 px-6 rounded-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center">
                    <span className="flex items-center">
                      <Check size={20} className="mr-2" />
                      {t("moved")}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer"></div>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className={`
                      relative overflow-hidden bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] 
                      hover:from-[#4338CA] hover:to-[#6D28D9] 
                      text-white h-12 px-6 rounded-lg shadow-lg ${isDark 
                        ? 'shadow-indigo-500/20' 
                        : 'shadow-indigo-400/30'
                      } flex items-center group
                      transition-all duration-300 transform hover:scale-[1.02] active:scale-95 theme-transition
                    `}
                  >
                    <span className="flex items-center">
                      <ArrowRightLeft size={18} className="mr-2 group-hover:animate-pulse" />
                      <span className="transform group-hover:translate-x-0.5 transition-transform duration-300">{t("move_file_button")}</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </button>
                )}
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
