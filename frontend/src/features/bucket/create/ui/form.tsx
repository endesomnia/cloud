import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@src/shared/ui'
import { createBucket } from '@src/shared/api'
import { toast } from 'sonner'
import { SetStateAction, Dispatch } from 'react'
import { useModalStore } from '@src/shared/modal'
import { useBucketFormModel } from '../model'
import { SubmitHandler } from 'react-hook-form'

interface Props {
  setRefetch: Dispatch<SetStateAction<number>>
}

interface BucketForm {
  name: string
}

export const BucketCreateForm = ({ setRefetch }: Props) => {
  const { handleSubmit, register, reset, accessMode, setAccessMode } = useBucketFormModel()
  const { isOpen, onClose, type } = useModalStore()

  const modalIsOpen = isOpen && type == 'bucketCreate'

  const onSubmit: SubmitHandler<BucketForm> = async (data) => {
    try {
      const response = await createBucket({ bucketname: data.name, accessM: accessMode })
      if (response.error) {
        toast(response.error.name)
      } else {
        toast('Folder created sucess !')
        setRefetch((prev) => prev + 1)
        reset()
        onClose()
      }
    } catch (error) {}
  }

  return (
    <Box className="absolute w-full flex justify-center">
      <Dialog open={modalIsOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Create Folder</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full ">
              <Box className="mb-3">
                <Input placeholder="Folder name" {...register('name')} />
              </Box>

              <Box className="flex justify-between items-center">
                <Box>
                  <Select
                    onValueChange={(v) => {
                      if (v === 'public') {
                        setAccessMode('public')
                      } else {
                        setAccessMode('private')
                      }
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Create public folder?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Access Mode via link</SelectLabel>
                        <SelectItem value="public">
                          <span>public</span>
                        </SelectItem>
                        <SelectItem value="private">
                          <span>private</span>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Box>
                <Box>
                  <Button type="submit" variant="ghost">
                    Create Folder
                  </Button>
                </Box>
              </Box>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
