import { useState } from 'react'
import { toast } from 'sonner'
import { useModalStore } from '@src/shared/modal'
import { Box, Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@shared/ui'
import { Trash2, AlertTriangle, Check, Trash } from 'lucide-react'
import { deleteFileByBucketAndName } from '@src/shared/api'
import { useUserStore } from '@entities/user'
import { cn } from '@src/shared/lib'
import { SetStateAction, Dispatch } from 'react'
import { useTheme } from '@src/shared/context/themeContext'
import { useLanguage } from '@src/shared/context/languageContext'
import { getDisplayFileName } from '@src/shared/lib/utils'

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
  const effectiveUserId = user?.id
  
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
        userId: effectiveUserId
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
    <Dialog open={modalIsOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`sm:max-w-lg ${isDark 
          ? 'bg-gradient-to-b from-[#0A0F1A] to-[#111827] border-gray-800/60' 
          : 'bg-white border-gray-200/80'
        } border shadow-2xl rounded-lg theme-transition`}>
        <DialogHeader className="pt-6 px-6">
          <div className="flex items-start">
            <div className="mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/10 sm:mx-0 sm:h-10 sm:w-10">
              <AlertTriangle className="h-6 w-6 text-red-500" aria-hidden="true" />
            </div>
            <div className="mt-0 text-left">
              <DialogTitle className={`text-lg font-semibold leading-6 ${isDark ? 'text-white' : 'text-gray-900'} theme-transition`}>
                {t('delete_file_confirm')}
              </DialogTitle>
              <div className="mt-2">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} theme-transition`}>
                  {t('delete_file_confirmation_p1')} <strong className={`${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{getDisplayFileName(fileName, effectiveUserId)}</strong> {t('delete_file_confirmation_p2')}
                </p>
                <p className={`mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} theme-transition`}>
                  {t('action_cannot_be_undone')}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className={`px-6 py-4 mt-4 rounded-b-lg ${isDark ? 'bg-slate-800/30' : 'bg-gray-50/70'} sm:flex sm:flex-row-reverse theme-transition`}>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={loading || success} 
            className={`w-full sm:ml-3 sm:w-auto ${isDark ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`}>
            {loading ? t('deleting') : success ? <Check size={18} className="text-white" /> : t('delete_button')}
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={loading || success} 
            className={`mt-3 w-full sm:mt-0 sm:w-auto ${isDark ? 'border-gray-600 hover:bg-slate-700' : 'border-gray-300 hover:bg-gray-100'}`}>           
            {t('cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
