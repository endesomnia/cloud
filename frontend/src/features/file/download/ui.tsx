import React from 'react'
import { Trash } from 'lucide-react'
import { cn } from '@src/shared/lib'
import { Button } from '@src/shared/ui'
import { SetStateAction, Dispatch } from 'react'
import { getFileByBucketAndName } from '@src/shared/api'
import { toast } from 'sonner'

interface Props {
  bucketName: string
  filename: string
  setRefetch: Dispatch<SetStateAction<number>>
  classes?: string
}

export const FileDownloadButton = ({ bucketName, classes, setRefetch, filename }: Props) => {
  const handleDownloadFile = async () => {
    try {
      const fileData = await getFileByBucketAndName({ bucketname: bucketName, filename })
      if (fileData) {
        const url = window.URL.createObjectURL(new Blob([fileData]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        // @ts-ignore
        link.parentNode.removeChild(link) || true
        window.URL.revokeObjectURL(url)
      } else {
        toast('Failed to download file.')
      }
    } catch (error) {
      console.error('Error downloading file:', error)
      toast('Error downloading file.')
    }
  }

  return (
    <Button onClick={handleDownloadFile} className={cn('', classes)}>
      <span className="flex">
        <Trash className="mr-2" size={20} /> Download File
      </span>
    </Button>
  )
}
