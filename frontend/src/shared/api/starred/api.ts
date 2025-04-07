import { api } from '@shared/api/instance'
import { starredUrlPrefix } from '@src/shared/constant'

export interface StarredItem {
  id: string
  createdAt: string
  bucketName: string
  fileName: string
  type: 'file' | 'folder'
  userId: string
}

interface GetStarredItemsParams {
  userId: string
}

interface AddStarredItemParams {
  userId: string
  bucketName: string
  fileName: string
  type: 'file' | 'folder'
}

interface RemoveStarredItemParams {
  id: string
  userId: string
}

interface IsItemStarredParams {
  userId: string
  bucketName: string
  fileName: string
}

export const getStarredItems = async ({ userId }: GetStarredItemsParams): Promise<StarredItem[]> => {
  try {
    const response = await api.get<StarredItem[]>(`${starredUrlPrefix}/${userId}`)
    return response.data
  } catch (error: any) {
    console.error('Ошибка при получении избранных элементов:', error)
    return []
  }
}

export const addStarredItem = async ({
  userId,
  bucketName,
  fileName,
  type,
}: AddStarredItemParams): Promise<StarredItem | undefined> => {
  try {
    const response = await api.post<StarredItem>(`${starredUrlPrefix}`, {
      userId,
      bucketName,
      fileName,
      type,
    })
    return response.data
  } catch (error: any) {
    console.error('Ошибка при добавлении элемента в избранное:', error)
    return undefined
  }
}

export const removeStarredItem = async ({
  id,
  userId,
}: RemoveStarredItemParams): Promise<boolean> => {
  try {
    await api.delete(`${starredUrlPrefix}/${id}/${userId}`)
    return true
  } catch (error: any) {
    console.error('Ошибка при удалении элемента из избранного:', error)
    return false
  }
}

export const isItemStarred = async ({
  userId,
  bucketName,
  fileName,
}: IsItemStarredParams): Promise<boolean> => {
  try {
    const response = await api.get<{ isStarred: boolean }>(
      `${starredUrlPrefix}/${userId}/${bucketName}/${fileName}`
    )
    return response.data.isStarred
  } catch (error: any) {
    console.error('Ошибка при проверке наличия элемента в избранном:', error)
    return false
  }
} 