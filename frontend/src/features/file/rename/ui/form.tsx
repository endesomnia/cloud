'use client'

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { renameFile } from '@src/shared/api'
import { Box, Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input } from '@shared/ui'
import { useModalStore } from '@src/shared/modal'
import { SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { useFileRenameFormModel } from '../model'
import { Tag, Check, FileText } from 'lucide-react'
import { useTheme } from '@src/shared/context/themeContext'
import { useLanguage } from '@src/shared/context/languageContext'

export interface fileRenameForm {
  newFilename: string
}

interface Props {
  setRefetch: Dispatch<SetStateAction<number>>
  bucketName: string
  filename: string
}

export const FileRenameForm = ({ setRefetch, bucketName, filename }: Props) => {
  const { handleSubmit, register, reset } = useFileRenameFormModel()
  const { isOpen, onClose, type } = useModalStore()
  const [fname, setFname] = useState<string>(filename)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [animateSuccess, setAnimateSuccess] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { t } = useLanguage()

  useEffect(() => {
    setFname(filename)
  }, [filename])

  const modalIsOpen = isOpen && type === 'fileRename'

  const onSubmit: SubmitHandler<fileRenameForm> = async (data) => {
    if (!data.newFilename.trim()) {
      toast.error(t('specify_new_name'), {
        position: 'top-center',
        style: { 
          background: isDark ? '#1E293B' : '#ffffff',
          border: '1px solid rgba(16, 185, 129, 0.5)', 
          color: isDark ? 'white' : '#111827'
        },
      })
      return
    }
    
    try {
      setAnimateSuccess(true)
      const response = await renameFile({
        bucketname: bucketName,
        oldFileName: filename,
        newFileName: data.newFilename.trim(),
      })
      
      if (response.error) {
        toast.error(t('error_renaming'), {
          description: response.error.name,
          position: 'top-center',
          style: { 
            background: isDark ? '#1E293B' : '#ffffff',
            border: '1px solid rgba(16, 185, 129, 0.5)', 
            color: isDark ? 'white' : '#111827'
          },
        })
        setAnimateSuccess(false)
      } else {
        toast.success(t('renamed'), {
          description: response.message,
          position: 'top-center',
          style: { 
            background: isDark ? '#1E293B' : '#ffffff',
            border: '1px solid rgba(16, 185, 129, 0.5)', 
            color: isDark ? 'white' : '#111827'
          },
        })
        
        setRefetch((prev) => prev + 1)
        setTimeout(() => {
          reset()
          onClose()
          setAnimateSuccess(false)
        }, 1000)
      }
    } catch (error) {
      console.error('Error renaming file:', error)
      setAnimateSuccess(false)
      toast.error(t('error_renaming'), {
        position: 'top-center',
        style: { 
          background: isDark ? '#1E293B' : '#ffffff',
          border: '1px solid rgba(16, 185, 129, 0.5)', 
          color: isDark ? 'white' : '#111827'
        },
      })
    }
  }

  return (
    <Box className="absolute w-full flex justify-center">
      <Dialog open={modalIsOpen} onOpenChange={onClose}>
        <DialogContent className={`${isDark 
          ? 'bg-gradient-to-b from-[#0A0F1A] to-[#111827] border-gray-800/60' 
          : 'bg-gradient-to-b from-white to-gray-50 border-gray-200/60'
        } border shadow-2xl overflow-visible
          before:absolute before:inset-0 ${isDark 
            ? 'before:bg-gradient-to-r before:from-[#10B981]/0 before:via-[#10B981]/5 before:to-[#10B981]/0' 
            : 'before:bg-gradient-to-r before:from-[#10B981]/0 before:via-[#10B981]/10 before:to-[#10B981]/0'
          } before:rounded-md
          perspective-800 max-w-md sm:max-w-lg w-[90vw] p-0 theme-transition`}>
          
          <div className="absolute -top-0.5 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#10B981] to-transparent rounded-t-md"></div>
          
          <div className={`absolute -z-10 top-[20%] right-[10%] w-[200px] h-[200px] ${isDark ? 'bg-[#10B981]/5' : 'bg-[#10B981]/10'} rounded-full blur-3xl opacity-60 theme-transition`}></div>
          <div className={`absolute -z-10 bottom-[10%] left-[20%] w-[180px] h-[180px] ${isDark ? 'bg-[#059669]/5' : 'bg-[#059669]/10'} rounded-full blur-3xl opacity-50 theme-transition`}></div>
          
          <div className={`absolute inset-0 ${isDark 
            ? "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" 
            : "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10"
          } rounded-md theme-transition`}></div>
          
          <DialogHeader className="pt-7 pb-5 px-8">
            <div className="flex flex-col mb-6">
              <div className="flex items-center">
                <div className="relative mr-3 bg-gradient-to-br from-[#10B981] to-[#059669] p-2.5 rounded-md shadow-md shadow-[#10B981]/20 group animate-float transform-gpu">
                  <Tag size={24} className="text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>
                </div>
                <DialogTitle className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${isDark 
                  ? 'from-white to-gray-400'
                  : 'from-gray-900 to-gray-600'
                } theme-transition`}>
                  {t('renaming_file')}
                </DialogTitle>
              </div>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm ml-14 mt-1 theme-transition`}>
                {t('renaming_file_in').replace('{filename}', filename).replace('{bucketName}', bucketName)}
              </p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-7">
              <div>
                <div className={`relative transition-all duration-300 ${isInputFocused ? 'scale-[1.02]' : 'scale-100'}`}>
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-[#10B981]/40 via-[#059669]/40 to-[#10B981]/40 rounded-lg blur-sm transition-opacity duration-300 ${isInputFocused ? 'opacity-100' : 'opacity-0'}`}></div>
                  
                  <div className={`relative ${isDark 
                    ? 'bg-[#1E293B]/80 border-gray-700/50' 
                    : 'bg-white/80 border-gray-200'
                  } backdrop-blur-sm rounded-lg border transition-all duration-300 theme-transition`}>
                    <label className={`absolute left-4 top-3 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'} font-medium theme-transition`}>{t('new_filename')}</label>
                    
                    <div className="flex items-center">
                      <div className="pl-4 pt-10 pb-3">
                        <FileText size={20} className="text-[#10B981]" />
                      </div>
                    
                      <Input 
                        {...register('newFilename')} 
                        placeholder={t('enter_new_filename')}
                        className={`bg-transparent border-none shadow-none focus:ring-0 pt-10 pb-3 px-2 ${isDark 
                          ? 'text-white placeholder:text-gray-500' 
                          : 'text-gray-900 placeholder:text-gray-400'
                        } text-base w-full h-16 theme-transition`}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        autoFocus
                      />
                    </div>
                  </div>
                </div>
                
                <div className="h-6 mt-2">
                  {/* Место для отображения ошибок при необходимости */}
                </div>
              </div>
              
              <div className="pt-2 pb-4 flex justify-end">
                {animateSuccess ? (
                  <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 text-white h-12 px-6 rounded-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center">
                    <span className="flex items-center">
                      <Check size={20} className="mr-2" />
                      {t('renamed')}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer"></div>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className={`
                      relative overflow-hidden bg-gradient-to-r from-[#10B981] to-[#059669] 
                      hover:from-[#059669] hover:to-[#047857] 
                      text-white h-12 px-6 rounded-lg shadow-lg shadow-emerald-500/20 flex items-center group
                      transition-all duration-300 transform hover:scale-[1.02] active:scale-95
                    `}
                  >
                    <span className="flex items-center">
                      <Tag size={18} className="mr-2 group-hover:animate-pulse" />
                      <span className="transform group-hover:translate-x-0.5 transition-transform duration-300">{t('rename_file')}</span>
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
