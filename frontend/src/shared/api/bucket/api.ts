import axios from 'axios'
import { api } from '@shared/api/instance'
import { bucketUrlPrefix } from '@src/shared/constant'
import { strict } from 'assert'
import { getFilesByBucket } from '../file/api'

export interface Bucket {
  name: string
  creationDate: Date
}

export interface BucketWithSize extends Bucket {
  size: number
  filesCount: number
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
    const response = await api.get<Bucket[]>(`${bucketUrlPrefix}`)
    return response.data
  } catch (error) {
    console.error('Ошибка при получении корзин:', error)
    return []
  }
}

// Function to fetch buckets with size information
export const listBucketsWithSize = async (): Promise<BucketWithSize[]> => {
  try {
    // Получаем список папок
    const bucketsResponse = await api.get<Bucket[]>(`${bucketUrlPrefix}`);
    const buckets = bucketsResponse.data;
    
    // Для каждой папки получаем информацию о размере
    const bucketsWithSize = await Promise.all(
      buckets.map(async (bucket) => {
        const bucketSize = await getBucketSize(bucket.name);
        return {
          ...bucket,
          size: bucketSize.totalSize,
          filesCount: bucketSize.filesCount
        };
      })
    );
    
    return bucketsWithSize;
  } catch (error) {
    console.error('Ошибка при получении корзин с размерами:', error);
    return [];
  }
};

// Function to get bucket size
export const getBucketSize = async (bucketName: string): Promise<{ totalSize: number, filesCount: number }> => {
  try {
    const files = await getFilesByBucket({ bucketname: bucketName });
    
    // Считаем общий размер всех файлов в байтах
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    
    return {
      totalSize,
      filesCount: files.length
    };
  } catch (error) {
    console.error(`Ошибка при получении размера корзины ${bucketName}:`, error);
    return {
      totalSize: 0,
      filesCount: 0
    };
  }
};

// Function to create a bucket
export const createBucket = async ({ bucketname, accessM }: CreateBucket): Promise<CreateBucketResponse> => {
  try {
    const response = await api.post<CreateBucketResponse>(`${bucketUrlPrefix}/${bucketname}`, {
      bucketname: bucketname,
      access: accessM,
    })
    return response.data
  } catch (error: any) {
    console.error('Ошибка при создании корзины:', error)
    return { message: undefined, bucketName: undefined, error: error.message }
  }
}

// Function to delete a bucket
export const deleteBucket = async ({ bucketname }: DeleteBucket): Promise<any> => {
  try {
    const response = await api.delete<any>(`${bucketUrlPrefix}/${bucketname}`)
    return response.data
  } catch (error: any) {
    console.error('Ошибка при удалении корзины:', error)
    return { message: undefined, error: error }
  }
}
