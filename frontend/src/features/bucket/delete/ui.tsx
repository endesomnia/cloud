import { Trash } from 'lucide-react'
import { cn } from '@src/shared/lib'
import { Button } from '@src/shared/ui'
import { deleteBucket } from '@src/shared/api'
import { toast } from 'sonner'
import { SetStateAction, Dispatch } from 'react'
import { useLanguage } from '@src/shared/context/languageContext'

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

  const handleDeleteBucket = async (bucketname: string) => {
    try {
      const response = await deleteBucket({ bucketname })
      if (response.error) {
        toast(response.error.message)
      } else {
        toast(t('bucket_deleted_successfully'))
        setRefetch((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Failed to delete Folder:', error)
    }
  }

  return (
    <Button 
      onClick={() => handleDeleteBucket(bucketName)} 
      className={cn('', buttonClassName || classes)}
      title={t('delete_bucket')}
    >
      {iconOnly ? (
        <Trash size={18} />
      ) : (
        <span className="flex items-center">
          <Trash className="mr-2" size={20} /> {t('delete_bucket')}
        </span>
      )}
    </Button>
  )
}
