import React, { Dispatch, SetStateAction, useState } from 'react'
import { moveFile, uploadFile } from '@src/shared/api'
import { Box, Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input } from '@shared/ui'
import { useModalStore } from '@src/shared/modal'
import { SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { Label } from '@src/shared/ui/label'
import { useFileMoveFormModel } from '../model'

interface fileMoveForm {
  targetBucket: string
}

interface Props {
  setRefetch: Dispatch<SetStateAction<number>>
  bucketName: string
  fileName: string
}

export const FileMoveForm = ({ setRefetch, bucketName, fileName }: Props) => {
  const { handleSubmit, register, reset } = useFileMoveFormModel()
  const { isOpen, onClose, type } = useModalStore()

  const modalIsOpen = isOpen && type == 'fileMove'

  const onSubmit: SubmitHandler<fileMoveForm> = async (data) => {
    try {
      const response = await moveFile({
        bucketname: bucketName,
        filename: fileName,
        targetBucket: data.targetBucket,
      })
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
            <DialogTitle className="mb-4">Move File</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-2 w-full h-full">
              <Box className="mb-4">
                <Input placeholder="Target Folder name" {...register('targetBucket')} className="p-4" />
              </Box>

              <Box className="flex justify-center mt-4">
                <Button type="submit" variant="ghost" className="cursor-pointer hover:cursor-pointer">
                  Move File
                </Button>
              </Box>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
