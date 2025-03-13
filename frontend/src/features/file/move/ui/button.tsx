import { Move } from 'lucide-react'
import { cn } from '@src/shared/lib'
import { Button } from '@src/shared/ui'
import { useModalStore } from '@src/shared/modal'

interface Props {
  classes?: string
}

export const FileMoveButton = ({ classes }: Props) => {
  const { onOpen } = useModalStore()

  return (
    <Button onClick={() => onOpen('fileMove')} className={cn('', classes)}>
      <span className="flex">
        <Move className="mr-2" size={20} /> Move File
      </span>
    </Button>
  )
}
