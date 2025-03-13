import { Trash } from 'lucide-react'
import { cn } from '@src/shared/lib'
import { Button } from '@src/shared/ui'
import { deleteBucket, deleteFileByBucketAndName } from '@src/shared/api'
import { toast } from 'sonner'
import { SetStateAction, Dispatch } from 'react'

interface Props {
  bucketName: string
  filename: string
  setRefetch: Dispatch<SetStateAction<number>>
  classes?: string
}

export const FileDeleteButton = ({ bucketName, classes, setRefetch, filename }: Props) => {
  const handleDeleteFile = async (bucketname: string) => {
    try {
      const response = await deleteFileByBucketAndName({ bucketname: bucketName, filename: filename })
      if (response.error) {
        toast(response.error.message)
      } else {
        toast(response.message)
        setRefetch((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Failed to delete File:', error)
    }
  }

  return (
    <Button onClick={() => handleDeleteFile(bucketName)} className={cn('', classes)}>
      <span className="flex">
        <Trash className="mr-2" size={20} /> Delete File
      </span>
    </Button>
  )
}
