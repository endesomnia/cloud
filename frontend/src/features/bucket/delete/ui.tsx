import { Trash, AlertTriangle } from 'lucide-react'
import { cn } from '@src/shared/lib'
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@src/shared/ui'
import { deleteBucket, getFilesByBucket, deleteFileByBucketAndName } from '@src/shared/api'
import { toast } from 'sonner'
import { SetStateAction, Dispatch, useState } from 'react'
import { useLanguage } from '@src/shared/context/languageContext'
import { useSession } from 'next-auth/react'
import { useModalStore } from '@src/shared/modal'
import { useTheme } from '@src/shared/context/themeContext'
import { getDisplayBucketName } from '@src/shared/lib/utils'
import { useUserStore } from '@entities/user'
import type { FileObj } from '@src/shared/api/file/api'

interface Props {
  bucketName: string
  setRefetch: Dispatch<SetStateAction<number>>
  classes?: string
  buttonClassName?: string
  iconOnly?: boolean
}

export const BucketDeleteButton = ({ 
  bucketName, 
  classes, 
  setRefetch, 
  buttonClassName, 
  iconOnly = false 
}: Props) => {
  const { t } = useLanguage()
  const { onOpen } = useModalStore()
  const { data: session } = useSession()
  const storeUser = useUserStore((state) => state.user)
  const effectiveUserId = session?.user?.id || storeUser?.id
  const modalType = `deleteBucketDialog-${bucketName}`

  return (
    <Button 
      onClick={() => onOpen(modalType)}
      className={cn('', buttonClassName || classes)}
      title={t('delete_bucket') + (iconOnly ? '' : ` ${getDisplayBucketName(bucketName, effectiveUserId)}`)}
    >
      {iconOnly ? (
        <Trash size={18} />
      ) : (
        <span className="flex items-center">
          <Trash className="mr-2" size={20} /> {t('delete_bucket')} {getDisplayBucketName(bucketName, effectiveUserId)}
        </span>
      )}
    </Button>
  )
}

interface BucketDeleteFormProps {
  bucketName: string;
  setRefetch: Dispatch<SetStateAction<number>>;
}

export const BucketDeleteForm = ({ bucketName, setRefetch }: BucketDeleteFormProps) => {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const storeUser = useUserStore((state) => state.user)
  const effectiveUserId = session?.user?.id || storeUser?.id
  const { isOpen, onClose, type } = useModalStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { theme } = useTheme(); 
  const isDark = theme === 'dark';

  const modalType = `deleteBucketDialog-${bucketName}`;
  const modalIsOpen = isOpen && type === modalType;

  const handleDeleteBucket = async () => {
    setLoading(true);
    try {
      let files: FileObj[] = [];
      try {
        files = await getFilesByBucket({ bucketname: bucketName, userId: effectiveUserId });
      } catch (e: any) {
        if (e?.message?.includes('bucket does not exist')) {
          files = [];
        } else {
          throw e;
        }
      }
      for (const file of files) {
        try {
          await deleteFileByBucketAndName({
            bucketname: bucketName,
            filename: file.name,
            userId: effectiveUserId
          });
        } catch (e: any) {
          if (e?.message?.includes('bucket does not exist')) continue;
          console.error('Ошибка при удалении файла:', file.name, e);
          throw e;
        }
      }
      const response = await deleteBucket({ bucketname: bucketName, userId: effectiveUserId ?? '' });
      if (response.error) {
        toast.error(response.error.message || t('error_deleting_bucket'));
      } else {
        setSuccess(true);
        toast.success(t('bucket_deleted_successfully'));
        setRefetch((prev) => prev + 1);
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to delete bucket:', error);
      toast.error(t('error_deleting_bucket'));
    } finally {
      setLoading(false);
    }
  };

  if (!modalIsOpen) {
    return null;
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
                {t('delete_bucket_confirmation_title')}
              </DialogTitle>
              <div className="mt-2">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} theme-transition`}>
                  {t('delete_bucket_confirmation_message_p1')} <strong className={`${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{getDisplayBucketName(bucketName, effectiveUserId)}</strong>? {t('delete_bucket_confirmation_message_p2')}
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
            onClick={handleDeleteBucket} 
            disabled={loading} 
            className={`w-full sm:ml-3 sm:w-auto ${isDark ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`}>
            {loading ? t('deleting') : t('delete_bucket')}
          </Button>
          <Button 
            variant="outline"
            onClick={onClose} 
            disabled={loading} 
            className={`mt-3 w-full sm:mt-0 sm:w-auto ${isDark ? 'border-gray-600 hover:bg-slate-700' : 'border-gray-300 hover:bg-gray-100'}`}>           
            {t('cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
