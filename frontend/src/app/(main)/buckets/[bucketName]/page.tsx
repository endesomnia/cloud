'use client'

import { Box, Button } from '@shared/ui'
import { FileDeleteButton } from '@src/features/file/delete'
import { FileDownloadButton } from '@src/features/file/download'
import { FileMoveButton, FileMoveForm } from '@src/features/file/move'
import { FileRenameButton, FileRenameForm } from '@src/features/file/rename'
import { FileUploadButton, FileUploadForm } from '@src/features/file/upload'
import { FileObj, getFilesByBucket } from '@src/shared/api'
import { routes } from '@src/shared/constant'
import { formatDate } from '@src/shared/lib'
import { useCallback, useEffect, useState } from 'react'

interface Props {
  params: { bucketName: string }
}

const Page = ({ params }: Props) => {
  const [files, setFiles] = useState<FileObj[]>([])
  const [refetchIndex, setRefetchIndex] = useState(0)

  useEffect(() => {
    const fetchBuckets = async () => {
      const filesObjs = await getFilesByBucket({ bucketname: params.bucketName })
      if (Array.isArray(filesObjs)) {
        setFiles(filesObjs)
      } else {
        console.error('Expected bucketsData to be an array, received:', filesObjs)
        setFiles([])
      }
    }

    fetchBuckets()
  }, [refetchIndex])

  return (
    <Box>
      <Box className="flex justify-between w-1/2">
        <h1 className="text-3xl justify-start m-5">
          Files list in Folder <span className="text-gray-800 font-bold">{params.bucketName}</span>
        </h1>
        <FileUploadButton classes="text-xl p-4 my-2 mb-0" />
        <FileUploadForm setRefetch={setRefetchIndex} bucketName={params.bucketName} />
      </Box>
      {files.length > 0 ? (
        <ul>
          {files.map((file: FileObj, index) => (
            <li key={index} className="m-5 p-2 border border-gray-700 flex justify-between rounded-md">
              <Box>
                <Box className="text-xl p-2 m-3 flex flex-col items-start">
                  <div>
                    <span className="text-gray-500">Name:</span>{' '}
                    <span className="text-gray-800 font-bold">{file.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Size:</span>{' '}
                    <span className="text-gray-800 font-bold">{file.size}kb</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Modified:</span>{' '}
                    <span className="text-gray-800 font-bold">{formatDate(file.lastModified)}</span>
                  </div>
                </Box>
              </Box>
              <Box className="flex justify-center items-center">
                <FileRenameButton />
                <FileRenameForm bucketName={params.bucketName} filename={file.name} setRefetch={setRefetchIndex} />
                <FileDownloadButton bucketName={params.bucketName} filename={file.name} setRefetch={setRefetchIndex} />
                <FileMoveButton />
                <FileMoveForm bucketName={params.bucketName} fileName={file.name} setRefetch={setRefetchIndex} />
                <FileDeleteButton
                  setRefetch={setRefetchIndex}
                  filename={file.name}
                  bucketName={params.bucketName}
                  classes="m-2"
                />
              </Box>
            </li>
          ))}
        </ul>
      ) : (
        <Box className="flex justify-center items-center h-full">
          <span className="text-gray-800 font-bold text-7xl">Files not found.</span>
        </Box>
      )}
    </Box>
  )
}

export default Page
