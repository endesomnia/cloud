import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { uploadFile } from '@src/shared/api'
import { Box, Button, Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui'
import { useFileUploadFormModel } from '../model'
import { useModalStore } from '@src/shared/modal'
import { SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { Upload, FileUp, Check, UploadCloud } from 'lucide-react'
import { useUserStore } from '@entities/user'
import { useTheme } from '@src/shared/context/themeContext'
import { useLanguage } from '@src/shared/context/languageContext'
import { getDisplayBucketName } from '@src/shared/lib/utils'

interface fileUploadForm {
  bucketname: string
}

interface Props {
  setRefetch: Dispatch<SetStateAction<number>>
  onUploadComplete?: () => void
  bucketName: string
}

export const FileUploadForm = ({ setRefetch, bucketName, onUploadComplete }: Props) => {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [animateSuccess, setAnimateSuccess] = useState(false)

  const { handleSubmit, register, reset } = useFileUploadFormModel()
  const { isOpen, onClose, type, data } = useModalStore()
  const user = useUserStore((state) => state.user)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { t } = useLanguage()
  const effectiveUserId = user?.id

  const modalIsOpen = isOpen && type === 'fileUpload'
  const currentFolder = data?.currentFolder || ''

  useEffect(() => {
    if (!isOpen) {
      setFile(null)
    }
  }, [isOpen])

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0])
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const onSubmit: SubmitHandler<fileUploadForm> = async (formData) => {
    if (!file) {
      toast.error(t('select_file_to_upload'), {
        position: 'top-center',
        style: { 
          background: isDark ? '#1E293B' : '#ffffff', 
          border: '1px solid rgba(59, 130, 246, 0.5)', 
          color: isDark ? 'white' : '#111827'
        },
      })
      return
    }
    
    if (!bucketName) {
      toast.error(t('missing_bucket_name'), {
        position: 'top-center',
        style: { 
          background: isDark ? '#1E293B' : '#ffffff', 
          border: '1px solid rgba(59, 130, 246, 0.5)', 
          color: isDark ? 'white' : '#111827'
        },
      })
      return
    }

    try {
      setAnimateSuccess(true)
      
      const fileName = currentFolder 
        ? `${currentFolder}${currentFolder.endsWith('/') ? '' : '/'}${file.name}`
        : file.name;
      
      const fileToUpload = new File([file], fileName, { type: file.type });
      
      const response = await uploadFile({ 
        bucketname: bucketName, 
        file: fileToUpload,
        userId: user?.id
      });
      
      if (response.error) {
        toast.error(t('error_uploading_file'), {
          description: response.error.name,
          position: 'top-center',
          style: { 
            background: isDark ? '#1E293B' : '#ffffff', 
            border: '1px solid rgba(59, 130, 246, 0.5)', 
            color: isDark ? 'white' : '#111827'
          },
        })
        console.error('Ошибка загрузки:', response.error);
        setAnimateSuccess(false)
      } else {
        toast.success(t('file_uploaded'), {
          description: response.message,
          position: 'top-center',
          style: { 
            background: isDark ? '#1E293B' : '#ffffff', 
            border: '1px solid rgba(59, 130, 246, 0.5)', 
            color: isDark ? 'white' : '#111827'
          },
        })
        
        if (onUploadComplete) {
          onUploadComplete();
          setRefetch((prev: number) => prev + 1)
        }
        
        setTimeout(() => {
          reset()
          setFile(null)
          onClose()
          setAnimateSuccess(false)
        }, 1000)
      }
    } catch (err: any) {
      console.error('Error uploading file:', err)
      setAnimateSuccess(false)
      toast.error(t('error_uploading_file'), {
        position: 'top-center',
        style: { 
          background: isDark ? '#1E293B' : '#ffffff', 
          border: '1px solid rgba(59, 130, 246, 0.5)', 
          color: isDark ? 'white' : '#111827'
        },
      })
    }
  }

  return (
    <Box className="absolute w-full flex justify-center">
      <Dialog open={modalIsOpen} onOpenChange={(open) => {
        if (!open) {
          onClose();
          setFile(null);
        }
      }}>
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
                  <Upload size={24} className="text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>
                </div>
                <DialogTitle className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${isDark 
                  ? 'from-white to-gray-400'
                  : 'from-gray-900 to-gray-600'
                } theme-transition`}>
                  {t('upload_file')}
                </DialogTitle>
              </div>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm ml-14 mt-1 theme-transition`}>
                {t('upload_file_to')} {currentFolder 
                  ? `${getDisplayBucketName(bucketName, effectiveUserId)}/${currentFolder}` 
                  : getDisplayBucketName(bucketName, effectiveUserId)}
              </p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-7">
              <div 
                className={`relative transition-all duration-300 border-2 border-dashed ${
                  dragActive 
                    ? 'border-[#3B82F6] bg-[#3B82F6]/5 scale-[1.02]' 
                    : isDark 
                      ? 'border-gray-700 bg-[#1E293B]/60' 
                      : 'border-gray-300 bg-white/80'
                } rounded-xl p-6 h-48 flex flex-col items-center justify-center cursor-pointer overflow-hidden theme-transition`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                
                {file ? (
                  <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <div className="bg-[#3B82F6]/10 p-3 rounded-full">
                      <FileUp size={30} className="text-[#3B82F6]" />
                    </div>
                    <div className="flex flex-col">
                      <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium theme-transition`}>{file.name}</span>
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm theme-transition`}>{(file.size / 1024).toFixed(2)} KB</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-[#3B82F6]/0 via-[#3B82F6]/20 to-[#3B82F6]/0 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500 animate-pulse-slow"></div>
                      <div className={`${isDark ? 'bg-[#1F2937]' : 'bg-gray-100'} p-3 rounded-full relative theme-transition`}>
                        <UploadCloud size={30} className={`${isDark ? 'text-gray-400' : 'text-gray-500'} theme-transition`} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium theme-transition`}>{t('drag_file_or_click')}</h3>
                      <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm theme-transition`}>{t('max_file_size')} 50 MB</p>
                    </div>
                  </div>
                )}
                
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent -translate-x-full animate-shimmer transition-all duration-1000 ${dragActive ? 'opacity-100' : 'opacity-0'}`}></div>
              </div>
              
              <div className="pt-2 pb-4 flex justify-end">
                {animateSuccess ? (
                  <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 text-white h-12 px-6 rounded-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center">
                    <span className="flex items-center">
                      <Check size={20} className="mr-2" />
                      {t('uploaded')}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer"></div>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={!file}
                    className={`
                      relative overflow-hidden bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] 
                      hover:from-[#2563EB] hover:to-[#3B82F6] 
                      text-white h-12 px-6 rounded-lg shadow-lg shadow-blue-500/20 flex items-center group
                      transition-all duration-300 transform hover:scale-[1.02] active:scale-95
                      ${!file ? 'opacity-70 cursor-not-allowed' : 'opacity-100 cursor-pointer'}
                    `}
                  >
                    <span className="flex items-center">
                      <FileUp size={18} className="mr-2 group-hover:animate-bounce" />
                      <span className="transform group-hover:translate-x-0.5 transition-transform duration-300">{t('upload_file')}</span>
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
