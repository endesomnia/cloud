import { useState } from 'react'
import { toast } from 'sonner'
import { useModalStore } from '@src/shared/modal'
import { Box, Button, Dialog, DialogContent } from '@shared/ui'
import { Trash2, AlertTriangle, Check, Trash } from 'lucide-react'
import { deleteFileByBucketAndName } from '@src/shared/api'
import { useUserStore } from '@entities/user'
import { cn } from '@src/shared/lib'
import { SetStateAction, Dispatch } from 'react'
import { useTheme } from '@src/shared/context/themeContext'
import { useLanguage } from '@src/shared/context/languageContext'

interface FileDeleteData {
  bucketName: string;
  fileName: string;
  onComplete?: () => void;
}

export const FileDeleteButton = ({ 
  fileName,
  classes, 
  buttonClassName, 
  iconOnly = false 
}: {
  fileName: string;
  classes?: string;
  buttonClassName?: string;
  iconOnly?: boolean;
}) => {
  const { onOpen } = useModalStore();
  const { t } = useLanguage();

  const modalType = `deleteDialog-${fileName}`;

  return (
    <Button 
      onClick={() => onOpen(modalType)}
      className={cn(buttonClassName || classes)}
      title={t('delete_file')}
    >
      {iconOnly ? (
        <Trash size={18} />
      ) : (
        <span className="flex items-center">
          <Trash2 className="mr-2" size={20} /> {t('delete_button')}
        </span>
      )}
    </Button>
  );
};

interface Props {
  bucketName: string;
  fileName: string;
  setRefetch: Dispatch<SetStateAction<number>>;
}

export const FileDeleteForm = ({ bucketName, fileName, setRefetch}: Props) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { isOpen, onClose, type } = useModalStore()
  const user = useUserStore((state) => state.user)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { t } = useLanguage()
  
  const modalType = `deleteDialog-${fileName}`;
  const modalIsOpen = isOpen && type === modalType;

  const handleDelete = async () => {
    if (!bucketName || !fileName) {
      toast.error(t('missing_data_for_delete'), {
        position: 'top-center',
        style: isDark 
          ? { background: '#1E293B', border: '1px solid rgba(239, 68, 68, 0.5)', color: 'white' }
          : { background: 'white', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#1F2937', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }
      })
      return
    }

    setLoading(true)
    
    try {
      const response = await deleteFileByBucketAndName({ 
        bucketname: bucketName, 
        filename: fileName,
        userId: user?.id
      })
      
      if (response.error) {
        toast.error(t('error_deleting_file'), {
          position: 'top-center',
          style: isDark 
            ? { background: '#1E293B', border: '1px solid rgba(239, 68, 68, 0.5)', color: 'white' }
            : { background: 'white', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#1F2937', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }
        })
        console.error(response.error)
      } else {
        setSuccess(true)
        toast.success(t('file_deleted_successfully'), {
          position: 'top-center',
          style: isDark 
            ? { background: '#1E293B', border: '1px solid rgba(59, 130, 246, 0.5)', color: 'white' }
            : { background: 'white', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#1F2937', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }
        })
        
        setRefetch((prev: number) => prev + 1)
        
        setTimeout(() => {
          onClose()
          setSuccess(false)
        }, 1000)
      }
    } catch (error) {
      console.error('Error deleting file:', error)
      toast.error(t('error_deleting_file'), {
        position: 'top-center',
        style: isDark 
          ? { background: '#1E293B', border: '1px solid rgba(239, 68, 68, 0.5)', color: 'white' }
          : { background: 'white', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#1F2937', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className="absolute w-full flex justify-center">
      <Dialog open={modalIsOpen} onOpenChange={(open) => {
        if (!open) onClose();
      }}>
        <DialogContent className={`${isDark 
          ? 'bg-gradient-to-b from-[#0A0F1A] to-[#111827] border-gray-800/60' 
          : 'bg-white border-gray-200'
        } border shadow-2xl overflow-visible max-w-sm w-[90vw] theme-transition`}>
          <div className="flex flex-col items-center py-6">
            {success ? (
              <div className={`${isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/5'} p-4 rounded-full mb-4 theme-transition`}>
                <Check size={40} className="text-emerald-500" />
              </div>
            ) : (
              <div className={`${isDark ? 'bg-red-500/10' : 'bg-red-500/5'} p-4 rounded-full mb-4 theme-transition`}>
                <AlertTriangle size={40} className="text-red-500" />
              </div>
            )}
            
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2 theme-transition`}>
              {success ? t('file_deleted') : t('delete_file_confirm')}
            </h3>
            
            {!success && (
              <>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-center mb-6 theme-transition`}>
                  {t('delete_file_confirmation')} <span className={`${isDark ? 'text-white' : 'text-gray-900'} theme-transition`}>{fileName}</span>? {t('action_cannot_be_undone')}
                </p>
                
                <div className="flex gap-3 w-full">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className={`flex-1 bg-transparent ${isDark 
                      ? 'border-gray-700 hover:bg-[#1E293B] hover:border-gray-600' 
                      : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 hover:text-gray-900'
                    } transition-all duration-300 theme-transition`}
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={loading}
                    className={`flex-1 ${isDark 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-red-500 hover:bg-red-600'
                    } transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-95 theme-transition`}
                  >
                    {loading ? (
                      <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Trash2 size={16} /> {t('delete_button')}
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
