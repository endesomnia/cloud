'use client'

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { moveFile, renameFile, uploadFile } from '@src/shared/api'
import { Box, Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input } from '@shared/ui'
import { useModalStore } from '@src/shared/modal'
import { SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { useFileRenameFormModel } from '../model'

export interface fileRenameForm {
  newFilename: string
}

interface Props {
  setRefetch: Dispatch<SetStateAction<number>>
  bucketName: string
  filename: string
}

export const FileRenameForm = ({ setRefetch, bucketName, filename }: Props) => {
  const { handleSubmit, register, reset } = useFileRenameFormModel()
  const { isOpen, onClose, type } = useModalStore()
  const [fname, setFname] = useState<string>(filename)

  useEffect(() => {
    setFname(filename)
  }, [filename])

  console.log(bucketName, fname)

  const modalIsOpen = isOpen && type === 'fileRename'

  const onSubmit: SubmitHandler<fileRenameForm> = async (data) => {
    console.log(bucketName, filename, data.newFilename)
    const response = await renameFile({
      bucketname: bucketName,
      filename: filename,
      newFilename: data.newFilename,
    })
    if (response.error) {
      toast(response.error.name)
    } else {
      toast(response.message)
      setRefetch((prev) => prev + 1)
      reset()
      onClose()
    }
  }

  return (
    <Box className="absolute w-full flex justify-center">
      <Dialog open={modalIsOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Rename File</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-2 w-full h-full">
              <Box className="mb-4">
                <Input placeholder="New File Name" {...register('newFilename')} className="p-4" />
              </Box>

              <Box className="flex justify-center mt-4">
                <Button type="submit" variant="ghost" className="cursor-pointer hover:cursor-pointer">
                  Rename File
                </Button>
              </Box>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
