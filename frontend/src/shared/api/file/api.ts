import { api } from '@shared/api/instance'
import { fileUrlPrefix, moveFileUrlPrefix, renameFileUrlPrefix } from '@src/shared/constant'

export interface FileObj {
  name: string
  lastModified: Date
  etag: string
  size: number
}

export interface UploadFileResponse {
  message: string
  fileName: string
  placedOn: string
  error?: Error
}

export interface UploadFile {
  bucketname: string
  file: File
  userId?: string
}

export interface DeleteFileByBucketAndName {
  bucketname: string
  filename: string
  userId?: string
}

export interface GetFilesByBucket {
  bucketname: string
}

export interface MoveFile {
  sourceBucket: string
  targetBucket: string
  filename: string
}

export interface RenameFile {
  bucketname: string
  oldFileName: string
  newFileName: string
}

// Function to get files by bucket name
export const getFilesByBucket = async ({ bucketname }: GetFilesByBucket): Promise<FileObj[]> => {
  try {
    const response = await api.get<FileObj[]>(`${fileUrlPrefix}/${bucketname}`)
    return response.data
  } catch (error: any) {
    console.error('Ошибка при получении файлов:', error)
    return []
  }
}

// Function to get a file by bucket and file name
export const getFileByBucketAndName = async ({
  bucketname,
  filename,
  userId
}: {
  bucketname: string
  filename: string
  userId?: string
}): Promise<Blob | undefined> => {
  try {
    const url = userId 
      ? `${fileUrlPrefix}/${bucketname}/${filename}?userId=${userId}`
      : `${fileUrlPrefix}/${bucketname}/${filename}`
      
    const response = await api.get(url, {
      responseType: 'blob', // Important: set responseType to 'blob'
    })
    return response.data
  } catch (error: any) {
    console.error('Ошибка при получении файла:', error)
    return undefined
  }
}

// Function to upload a file
export const uploadFile = async ({ bucketname, file, userId }: UploadFile): Promise<any> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const url = userId 
      ? `${fileUrlPrefix}/${bucketname}?userId=${userId}`
      : `${fileUrlPrefix}/${bucketname}`
    
    const response = await api.post<UploadFileResponse>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error: any) {
    console.error('Ошибка при загрузке файла:', error)
    return { message: undefined, error: error }
  }
}

// Function to move file to new bucket
export const moveFile = async ({ sourceBucket, targetBucket, filename }: MoveFile): Promise<any> => {
  try {
    const response = await api.post<any>(`${moveFileUrlPrefix}/${sourceBucket}/${filename}`, {
      targetBucket: targetBucket,
    })
    return response.data
  } catch (error: any) {
    console.error('Ошибка при перемещении файла:', error)
    return { message: undefined, error: error }
  }
}

// Function to rename file
export const renameFile = async ({ bucketname, oldFileName, newFileName }: RenameFile): Promise<any> => {
  try {
    const response = await api.post<any>(`${renameFileUrlPrefix}/${bucketname}/${oldFileName}`, {
      newFilename: newFileName,
    })
    return response.data
  } catch (error: any) {
    console.error('Ошибка при переименовании файла:', error)
    return { message: undefined, error: error }
  }
}

// Function to delete a file by bucket and file name
export const deleteFileByBucketAndName = async ({ bucketname, filename, userId }: DeleteFileByBucketAndName): Promise<any> => {
  try {
    const url = userId 
      ? `${fileUrlPrefix}/${bucketname}/${filename}?userId=${userId}`
      : `${fileUrlPrefix}/${bucketname}/${filename}`
      
    const response = await api.delete<any>(url)
    return response.data
  } catch (error: any) {
    console.error('Ошибка при удалении файла:', error)
    return { message: undefined, error: error }
  }
}
