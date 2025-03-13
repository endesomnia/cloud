import axios from 'axios'
import { api } from '@shared/api/instance'
import { bucketUrlPrefix } from '@src/shared/constant'
import { strict } from 'assert'

export interface Bucket {
  name: string
  creationDate: Date
}

export interface CreateBucket {
  bucketname: string
  accessM: 'public' | 'private'
}
export interface DeleteBucket {
  bucketname: string
}

export interface CreateBucketResponse {
  message: string | undefined
  bucketName: string | undefined
  error: undefined | string
}

export interface DeleteBucketResponse {
  message: string | undefined
  error: undefined | string
}

// Function to fetch buckets
export const listBuckets = async (): Promise<Bucket[]> => {
  try {
    const response = await api.get<Bucket[]>(`/${bucketUrlPrefix}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch buckets:', error)
    return []
  }
}

// Function to create a bucket
export const createBucket = async ({ bucketname, accessM }: CreateBucket): Promise<any> => {
  try {
    const response = await api.post<any>(`/${bucketUrlPrefix}/${bucketname}`, {
      bucketname: bucketname,
      access: accessM,
    })
    return response.data
  } catch (error: any) {
    console.error('Failed to create bucket:', error)
    return { message: undefined, bucketName: undefined, error: error }
  }
}

// Function to delete a bucket
export const deleteBucket = async ({ bucketname }: DeleteBucket): Promise<any> => {
  try {
    const response = await api.delete<any>(`/${bucketUrlPrefix}/${bucketname}`)
    return response.data
  } catch (error: any) {
    console.error('Failed to delete bucket:', error)
    return { message: undefined, error: error }
  }
}
