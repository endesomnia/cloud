import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
} from '@src/shared/ui'
import { createBucket } from '@src/shared/api'
import { toast } from 'sonner'
import { SetStateAction, Dispatch, useState, useEffect } from 'react'
import { useModalStore } from '@src/shared/modal'
import { useBucketFormModel } from '../model'
import { FolderPlus, Lock, Check, Sparkles, Server, Globe } from 'lucide-react'
import { useTheme } from '@src/shared/context/themeContext'
import { useLanguage } from '@src/shared/context/languageContext'
import { useSession } from 'next-auth/react'
import { getSessionUser } from '@src/entities/session/user'
import { useUserStore } from '@src/entities/user'

interface Props {
  setRefetch: Dispatch<SetStateAction<number>>
}

interface BucketForm {
  name: string
}

export const BucketCreateForm = ({ setRefetch }: Props) => {
  const { handleSubmit, register, reset, accessMode, setAccessMode, errors, isSubmitting } = useBucketFormModel()
  const { isOpen, onClose, type } = useModalStore()
  const [isNameFocused, setIsNameFocused] = useState(false)
  const [nameValue, setNameValue] = useState('')
  const [animateSuccess, setAnimateSuccess] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { t } = useLanguage()
  const { user } = useUserStore();
  
  const modalIsOpen = isOpen && type === 'bucketCreate'
  
  const userIdPrefixLength = user?.id ? user.id.length + 1 : 0;
  const maxLengthMessage = t('bucket_name_max_length_prefix') + (63 - userIdPrefixLength) + t('bucket_name_max_length_suffix');

  useEffect(() => {
    if (!modalIsOpen) {
      setTimeout(() => {
        setAnimateSuccess(false)
      }, 300)
    }
  }, [modalIsOpen])

  const onSubmitForm = async (data: BucketForm) => {    
    const trimmedName = data.name?.trim();
    
    if (!trimmedName) {
      toast.error(t('error'), {
        description: t('bucket_name_empty'),
        position: 'top-center',
        style: { 
          background: isDark ? '#1E293B' : '#ffffff', 
          border: '1px solid rgba(59, 130, 246, 0.5)', 
          color: isDark ? 'white' : '#111827'
        },
      });
      return;
    }

    const userId = user!!.id

    try {
      const response = await createBucket({ bucketname: trimmedName, accessM: accessMode, userId });
      
      if (response.error) {
        let descriptionMessage: string;
        const errorPayload = response.error as any;

        if (typeof errorPayload === 'object' && errorPayload !== null) {
          if (typeof errorPayload.message === 'string' && errorPayload.message.trim() !== '') {
            descriptionMessage = errorPayload.message;
          } else if (typeof errorPayload.name === 'string' && errorPayload.name.trim() !== '') {
            descriptionMessage = errorPayload.name;
          } else {
            descriptionMessage = JSON.stringify(errorPayload);
          }
        } else if (typeof errorPayload === 'string') {
          descriptionMessage = errorPayload;
        } else {
          descriptionMessage = String(errorPayload);
        }

        toast.error(t('bucket_creation_error'), {
          description: descriptionMessage,
          position: 'top-center',
          style: { 
            background: isDark ? '#1E293B' : '#ffffff', 
            border: '1px solid rgba(59, 130, 246, 0.5)', 
            color: isDark ? 'white' : '#111827'
          },
        });
      } else {
        setAnimateSuccess(true);
        toast.success(t('bucket_created'), {
          description: t('bucket_created_description').replace('{name}', trimmedName),
          position: 'top-center',
          style: { 
            background: isDark ? '#1E293B' : '#ffffff', 
            border: '1px solid rgba(59, 130, 246, 0.5)', 
            color: isDark ? 'white' : '#111827'
          },
        });
        
        setRefetch((prev) => prev + 1);
        reset();
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      console.error('Ошибка при создании папки:', error);
      toast.error(t('bucket_creation_error'), {
        position: 'top-center',
        style: { 
          background: isDark ? '#1E293B' : '#ffffff', 
          border: '1px solid rgba(59, 130, 246, 0.5)', 
          color: isDark ? 'white' : '#111827'
        },
      });
    }
  };

  return (
    <Box className="absolute w-full flex justify-center">
      <Dialog open={modalIsOpen} onOpenChange={onClose}>
        <DialogContent className={`${isDark 
          ? 'bg-gradient-to-b from-[#0A0F1A] to-[#111827] border-gray-800/60' 
          : 'bg-gradient-to-b from-white to-gray-50 border-gray-200/60'
        } border shadow-2xl overflow-visible
          before:absolute before:inset-0 ${isDark 
            ? 'before:bg-gradient-to-r before:from-[#3B82F6]/0 before:via-[#3B82F6]/5 before:to-[#3B82F6]/0' 
            : 'before:bg-gradient-to-r before:from-[#3B82F6]/0 before:via-[#3B82F6]/10 before:to-[#3B82F6]/0'
          } before:rounded-md
          perspective-800 max-w-md sm:max-w-lg w-[90vw] p-0 theme-transition`}>
          
          <div className="absolute -top-0.5 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent rounded-t-md"></div>
          
          <div className={`absolute -z-10 top-[20%] right-[10%] w-[200px] h-[200px] ${isDark ? 'bg-[#3B82F6]/5' : 'bg-[#3B82F6]/10'} rounded-full blur-3xl opacity-60 theme-transition`}></div>
          <div className={`absolute -z-10 bottom-[10%] left-[20%] w-[180px] h-[180px] ${isDark ? 'bg-[#60A5FA]/5' : 'bg-[#60A5FA]/10'} rounded-full blur-3xl opacity-50 theme-transition`}></div>
          
          <div className={`absolute inset-0 ${isDark 
            ? "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" 
            : "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10"
          } rounded-md theme-transition`}></div>
          
          <DialogHeader className="pt-7 pb-5 px-8">
            <div className="flex flex-col mb-6">
              <div className="flex items-center">
                <div className="relative mr-3 bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] p-2.5 rounded-md shadow-md shadow-[#3B82F6]/20 group animate-float transform-gpu">
                  <FolderPlus size={24} className="text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>
                </div>
                <DialogTitle className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${isDark 
                  ? 'from-white to-gray-400'
                  : 'from-gray-900 to-gray-600'
                } theme-transition`}>
                  {t('bucket_creation')}
                </DialogTitle>
              </div>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm ml-14 mt-1 theme-transition`}>{t('create_bucket_description')}</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmitForm)} className="w-full space-y-7">
              <div>
                <div className={`relative transition-all duration-300 ${isNameFocused ? 'scale-[1.02]' : 'scale-100'}`}>
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-[#3B82F6]/40 via-[#60A5FA]/40 to-[#3B82F6]/40 rounded-lg blur-sm transition-opacity duration-300 ${isNameFocused ? 'opacity-100' : 'opacity-0'}`}></div>
                  
                  <div className={`relative ${isDark 
                    ? 'bg-[#1E293B]/80 border-gray-700/50' 
                    : 'bg-white/80 border-gray-200'
                  } backdrop-blur-sm rounded-lg border transition-all duration-300 theme-transition`}>
                    <label className={`absolute left-4 top-3 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'} font-medium theme-transition`}>{t('bucket_name')}</label>
                    
                    <Input 
                      {...register('name', { 
                        required: t('bucket_name_required'),
                        minLength: {
                          value: 3,
                          message: t('bucket_name_min_length')
                        },
                        maxLength: {
                          value: 63 - userIdPrefixLength,
                          message: maxLengthMessage
                        },
                        pattern: {
                          value: /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/,
                          message: t('bucket_name_invalid_chars')
                        }
                      })}
                      placeholder={t('bucket_name_placeholder')}
                      className={`bg-transparent border-none shadow-none focus:ring-0 pt-10 pb-3 px-4 ${isDark 
                        ? 'text-white placeholder:text-gray-500' 
                        : 'text-gray-900 placeholder:text-gray-400'
                      } text-base w-full h-16 theme-transition`}
                      onFocus={() => setIsNameFocused(true)}
                      onBlur={() => setIsNameFocused(false)}
                      onChange={(e) => {
                        setNameValue(e.target.value);
                        register('name').onChange(e);
                      }}
                      autoFocus
                    />
                    
                    <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-[#3B82F6] transition-opacity duration-300 ${nameValue ? 'opacity-100' : 'opacity-0'}`}>
                      <Check size={20} className="animate-pulse-slow" />
                    </div>
                  </div>
                </div>
                
                <div className="h-6 mt-2">
                  {errors.name && (
                    <p className="text-sm text-red-400">{errors.name.message}</p>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0A0F1A] via-[#3B82F6]/20 to-[#0A0F1A] rounded-lg blur-sm"></div>
                
                <div className={`relative ${isDark 
                  ? 'bg-[#1E293B]/60 border-gray-700/50' 
                  : 'bg-white/60 border-gray-200'
                } backdrop-blur-sm rounded-lg border p-5 theme-transition`}>
                  <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-4 flex items-center theme-transition`}>
                    <Server size={16} className="mr-2 text-[#3B82F6]" />
                    {t('access_mode')}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setAccessMode('private')}
                      className={`relative overflow-hidden group flex flex-col items-center justify-center py-4 px-2 rounded-lg border transition-all duration-300 ${
                        accessMode === 'private' 
                          ? 'bg-[#3B82F6]/10 border-[#3B82F6]/40 shadow-md shadow-[#3B82F6]/10' 
                          : isDark
                            ? 'bg-[#1F2937]/40 border-gray-700/50 hover:border-gray-700'
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      } theme-transition`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ${accessMode === 'private' ? '' : 'opacity-0'}`}></div>
                      <div className={`p-2.5 rounded-full ${
                        accessMode === 'private' 
                          ? 'bg-gradient-to-r from-[#3B82F6]/80 to-[#60A5FA]/80 text-white' 
                          : isDark 
                            ? 'bg-gray-800 text-gray-500'
                            : 'bg-gray-200 text-gray-500'
                      } mb-2.5 theme-transition`}>
                        <Lock size={20} />
                      </div>
                      <span className={`text-sm font-medium ${
                        accessMode === 'private' 
                          ? 'text-white' 
                          : isDark ? 'text-gray-400' : 'text-gray-600'
                      } theme-transition`}>
                        {t('private')}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mt-1 text-center theme-transition`}>{t('only_for_you')}</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setAccessMode('public')}
                      className={`relative overflow-hidden group flex flex-col items-center justify-center py-4 px-2 rounded-lg border transition-all duration-300 ${
                        accessMode === 'public' 
                          ? 'bg-[#3B82F6]/10 border-[#3B82F6]/40 shadow-md shadow-[#3B82F6]/10' 
                          : isDark
                            ? 'bg-[#1F2937]/40 border-gray-700/50 hover:border-gray-700'
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      } theme-transition`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ${accessMode === 'public' ? '' : 'opacity-0'}`}></div>
                      <div className={`p-2.5 rounded-full ${
                        accessMode === 'public' 
                          ? 'bg-gradient-to-r from-[#3B82F6]/80 to-[#60A5FA]/80 text-white' 
                          : isDark 
                            ? 'bg-gray-800 text-gray-500'
                            : 'bg-gray-200 text-gray-500'
                      } mb-2.5 theme-transition`}>
                        <Globe size={20} />
                      </div>
                      <span className={`text-sm font-medium ${
                        accessMode === 'public' 
                          ? 'text-white' 
                          : isDark ? 'text-gray-400' : 'text-gray-600'
                      } theme-transition`}>
                        {t('public')}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mt-1 text-center theme-transition`}>{t('accessible_by_link')}</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 pb-4 flex justify-end">
                {animateSuccess ? (
                  <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 text-white h-12 px-6 rounded-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center">
                    <span className="flex items-center">
                      <Check size={20} className="mr-2" />
                      {t('created')}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer"></div>
                  </div>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      relative overflow-hidden bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] hover:from-[#2563EB] hover:to-[#3B82F6] 
                      text-white h-12 px-6 rounded-lg shadow-lg shadow-blue-500/20 flex items-center group
                      transition-all duration-300 transform hover:scale-[1.02] active:scale-95
                    `}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        <span>{t('creating')}</span>
                      </div>
                    ) : (
                      <span className="flex items-center">
                        <Sparkles size={18} className="mr-2 group-hover:animate-pulse" />
                        <span className="transform group-hover:translate-x-0.5 transition-transform duration-300">{t('create_folder')}</span>
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </Button>
                )}
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
