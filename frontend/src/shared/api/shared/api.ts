import { api } from '@shared/api/instance'
import { sharedUrlPrefix } from '@src/shared/constant'

export interface SharedFile {
  id: string
  createdAt: string
  bucketName: string
  fileName: string
  sharedById: string
  sharedToId: string
  sharedBy?: {
    id: string
    name: string
    email: string
  }
  sharedTo?: {
    id: string
    name: string
    email: string
  }
}

interface GetSharedWithUserParams {
  userId: string
}

interface GetSharedByUserParams {
  userId: string
}

interface ShareFileParams {
  bucketName: string
  fileName: string
  sharedById: string
  sharedToId: string
}

interface RemoveShareParams {
  id: string
  userId: string
}

interface IsFileSharedWithUserParams {
  bucketName: string
  fileName: string
  userId: string
}

export const getSharedWithUser = async ({ userId }: GetSharedWithUserParams): Promise<SharedFile[]> => {
  try {
    const response = await api.get<SharedFile[]>(`${sharedUrlPrefix}/to/${userId}`)
    return response.data
  } catch (error: any) {
    console.error('Ошибка при получении файлов, доступных пользователю:', error)
    return []
  }
}

export const getSharedByUser = async ({ userId }: GetSharedByUserParams): Promise<SharedFile[]> => {
  try {
    const response = await api.get<SharedFile[]>(`${sharedUrlPrefix}/by/${userId}`)
    return response.data
  } catch (error: any) {
    console.error('Ошибка при получении файлов, предоставленных пользователем:', error)
    return []
  }
}

export const shareFile = async ({
  bucketName,
  fileName,
  sharedById,
  sharedToId,
}: ShareFileParams): Promise<SharedFile | undefined> => {
  try {
    const response = await api.post<SharedFile>(`${sharedUrlPrefix}`, {
      bucketName,
      fileName,
      sharedById,
      sharedToId,
    })
    return response.data
  } catch (error: any) {
    console.error('Ошибка при предоставлении доступа к файлу:', error)
    return undefined
  }
}

export const removeShare = async ({ id, userId }: RemoveShareParams): Promise<boolean> => {
  try {
    await api.delete(`${sharedUrlPrefix}/${id}/${userId}`)
    return true
  } catch (error: any) {
    console.error('Ошибка при отмене доступа к файлу:', error)
    return false
  }
}

export const isFileSharedWithUser = async ({
  bucketName,
  fileName,
  userId,
}: IsFileSharedWithUserParams): Promise<boolean> => {
  try {
    const response = await api.get<{ isShared: boolean }>(
      `${sharedUrlPrefix}/check/${bucketName}/${fileName}/${userId}`
    )
    return response.data.isShared
  } catch (error: any) {
    console.error('Ошибка при проверке доступа к файлу:', error)
    return false
  }
} 