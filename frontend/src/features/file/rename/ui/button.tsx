import { Pen } from 'lucide-react'
import { cn } from '@src/shared/lib'
import { Button } from '@src/shared/ui'
import { useModalStore } from '@src/shared/modal'

interface Props {
  classes?: string
}

export const FileRenameButton = ({ classes }: Props) => {
  const { onOpen } = useModalStore()

  return (
    <Button onClick={() => onOpen('fileRename')} className={cn('', classes)}>
      <span className="flex">
        <Pen className="mr-2" size={20} /> Rename File
      </span>
    </Button>
  )
}
