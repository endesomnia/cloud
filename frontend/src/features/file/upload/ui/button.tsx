import { CirclePlus } from 'lucide-react'
import { cn } from '@src/shared/lib'
import { Button } from '@src/shared/ui'
import { deleteBucket } from '@src/shared/api'
import { toast } from 'sonner'
import { SetStateAction, Dispatch } from 'react'
import { useModalStore } from '@src/shared/modal'

interface Props {
  classes?: string
}

export const FileUploadButton = ({ classes }: Props) => {
  const { onOpen } = useModalStore()

  return (
    <Button onClick={() => onOpen('fileUpload')} className={cn('', classes)}>
      <span className="flex">
        <CirclePlus className="mr-3" size={30} /> Upload File
      </span>
    </Button>
  )
}
