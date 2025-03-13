import { Trash } from 'lucide-react'
import { cn } from '@src/shared/lib'
import { Button } from '@src/shared/ui'
import { deleteBucket } from '@src/shared/api'
import { toast } from 'sonner'
import { SetStateAction, Dispatch } from 'react'

interface Props {
  bucketName: string
  setRefetch: Dispatch<SetStateAction<number>>
  classes?: string
}

export const BucketDeleteButton = ({ bucketName, classes, setRefetch }: Props) => {
  const handleDeleteBucket = async (bucketname: string) => {
    try {
      const response = await deleteBucket({ bucketname })
      if (response.error) {
        toast(response.error.message)
      } else {
        toast('Delete Folder sucess')
        setRefetch((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Failed to delete Foler:', error)
    }
  }

  return (
    <Button onClick={() => handleDeleteBucket(bucketName)} className={cn('', classes)}>
      <span className="flex">
        <Trash className="mr-2" size={20} /> Delete Folder
      </span>
    </Button>
  )
}
