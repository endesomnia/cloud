import React, { Dispatch, SetStateAction, useState } from 'react'
import { uploadFile } from '@src/shared/api'
import { Box, Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input } from '@shared/ui'
import { useFileUploadFormModel } from '../model'
import { useModalStore } from '@src/shared/modal'
import { SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { Label } from '@src/shared/ui/label'

interface fileUploadForm {
  bucketname: string
}

interface Props {
  setRefetch: Dispatch<SetStateAction<number>>
  bucketName: string
}

export const FileUploadForm = ({ setRefetch, bucketName }: Props) => {
  const [file, setFile] = useState(null)

  const { handleSubmit, register, reset } = useFileUploadFormModel()
  const { isOpen, onClose, type } = useModalStore()

  const modalIsOpen = isOpen && type == 'fileUpload'

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0])
  }

  const onSubmit: SubmitHandler<fileUploadForm> = async (data) => {
    if (!file) {
      toast('Please select a file')
      return
    }
    try {
      const response = await uploadFile({ bucketname: bucketName, file })
      if (response.error) {
        toast(response.error.name)
      } else {
        toast(response.message)
        setRefetch((prev) => prev + 1)
        reset()
        onClose()
      }
    } catch (err: any) {
      console.error('Error uploading file:', err)
    }
  }

  return (
    <Box className="absolute w-full flex justify-center">
      <Dialog open={modalIsOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Upload File</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-2 w-full h-[300px]">
              <Box className="h-full">
                <Label htmlFor="file" className="hover:cursor-pointe">
                  File
                </Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="w-full h-1/2 text-center hover:cursor-pointer"
                />
              </Box>
              <Box className="flex justify-center mt-4">
                <Button type="submit" variant="ghost" className="cursor-pointer hover:cursor-pointer">
                  Upload File
                </Button>
              </Box>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
