import { api } from '@shared/api/instance'
import { fileUrlPrefix, moveFileUrlPrefix, renameFileUrlPrefix } from '@src/shared/constant'

export interface FileObj {
  name: string
  lastModified: Date
  etag: string
  size: number
}

interface GetFilesByBucket {
  bucketname: string
}

interface GetFileByBucketAndName {
  bucketname: string
  filename: string
}

interface UploadFile {
  bucketname: string
  file: Blob
}

interface MoveFile {
  bucketname: string
  targetBucket: string
  filename: string
}

interface RenameFile {
  bucketname: string
  filename: string
  newFilename: string
}

interface DeleteFileByBucketAndName {
  bucketname: string
  filename: string
}
interface UploadFileResponse {}
interface MoveFileResponse {}
interface DeleteFileResponse {}

// Function to get files by bucket name
export const getFilesByBucket = async ({ bucketname }: GetFilesByBucket): Promise<FileObj[]> => {
  try {
    const response = await api.get<FileObj[]>(`/${fileUrlPrefix}/${bucketname}`)
    return response.data
  } catch (error: any) {
    console.error('Failed to fetch files:', error)
    return []
  }
}

// Function to get a file by bucket and file name
export const getFileByBucketAndName = async ({
  bucketname,
  filename,
}: {
  bucketname: string
  filename: string
}): Promise<Blob | undefined> => {
  try {
    const response = await api.get(`/${fileUrlPrefix}/${bucketname}/${filename}`, {
      responseType: 'blob', // Important: set responseType to 'blob'
    })
    return response.data
  } catch (error: any) {
    console.error('Failed to fetch file:', error)
    return undefined
  }
}

// Function to upload a file
export const uploadFile = async ({ bucketname, file }: UploadFile): Promise<any> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post<UploadFileResponse>(`/${fileUrlPrefix}/${bucketname}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error: any) {
    console.error('Failed to upload file:', error)
    return { message: undefined, error: error }
  }
}

// Function to move a file
export const moveFile = async ({ bucketname, targetBucket, filename }: MoveFile): Promise<any> => {
  try {
    const response = await api.post<any>(`/${moveFileUrlPrefix}/${bucketname}/${filename}`, {
      targetBucket,
    })
    return response.data
  } catch (error: any) {
    console.error('Failed to move file:', error)
    return { message: undefined, error: error }
  }
}

// Function to move a file
export const renameFile = async ({ bucketname, filename, newFilename }: RenameFile): Promise<any> => {
  try {
    const response = await api.post<any>(`/${renameFileUrlPrefix}/${bucketname}/${filename}`, {
      newFilename: newFilename,
    })
    return response.data
  } catch (error: any) {
    console.error('Failed to move file:', error)
    return { message: undefined, error: error }
  }
}

// Function to delete a file by bucket and file name
export const deleteFileByBucketAndName = async ({ bucketname, filename }: DeleteFileByBucketAndName): Promise<any> => {
  try {
    const response = await api.delete<any>(`/${fileUrlPrefix}/${bucketname}/${filename}`)
    return response.data
  } catch (error: any) {
    console.error('Failed to delete file:', error)
    return { message: undefined, error: error }
  }
}
