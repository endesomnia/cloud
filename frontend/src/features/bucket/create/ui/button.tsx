import { CirclePlus } from 'lucide-react'
import { cn } from '@src/shared/lib'
import { Button } from '@src/shared/ui'
import { useModalStore } from '@src/shared/modal'

interface Props {
  classes?: string
}

export const BucketCreateButton = ({ classes }: Props) => {
  const { onOpen } = useModalStore()

  return (
    <Button onClick={() => onOpen('bucketCreate')} className={cn('', classes)}>
      <span className="flex">
        <CirclePlus className="mr-3" size={30} /> Create Folder
      </span>
    </Button>
  )
}
