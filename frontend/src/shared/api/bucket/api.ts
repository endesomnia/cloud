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
  userId: string
}
export interface DeleteBucket {
  bucketname: string
  userId: string
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

export interface RenameBucket {
  oldBucketName: string;
  newBucketName: string;
  userId: string;
}

export interface RenameBucketResponse {
  message: string | undefined;
  error: string | undefined;
}

// Function to fetch buckets
export const listBuckets = async (userId: string): Promise<Bucket[]> => {
  try {
    const response = await api.get<Bucket[]>(`${bucketUrlPrefix}/${userId}`)
    return response.data
  } catch (error) {
    console.error('Ошибка при получении корзин:', error)
    return []
  }
}

// Function to fetch buckets with size information
export const listBucketsWithSize = async (userId: string): Promise<BucketWithSize[]> => {
  try {
    const bucketsResponse = await api.get<Bucket[]>(`${bucketUrlPrefix}/${userId}`);
    const buckets = bucketsResponse.data;

    if (!Array.isArray(buckets)) {
      console.error('Error: bucketsResponse.data is not an array:', buckets);
      return [];
    }

    const bucketsWithSize = await Promise.all(
      buckets.map(async (bucket) => {
        const bucketSize = await getBucketSize(bucket.name, userId);
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
export const getBucketSize = async (bucketName: string, userId: string): Promise<{ totalSize: number, filesCount: number }> => {
  try {
    const files = await getFilesByBucket({ bucketname: bucketName, userId });
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
export const createBucket = async ({ bucketname, accessM, userId }: CreateBucket): Promise<CreateBucketResponse> => {
  try {
    const response = await api.post<CreateBucketResponse>(`${bucketUrlPrefix}/${bucketname}`, {
      bucketname: bucketname,
      access: accessM,
      userId: userId,
    })
    return response.data
  } catch (error: any) {
    console.error('Ошибка при создании корзины:', error)
    return { message: undefined, bucketName: undefined, error: error.message }
  }
}

// Function to delete a bucket
export const deleteBucket = async ({ bucketname, userId }: DeleteBucket): Promise<any> => {
  try {
    const response = await api.delete<any>(`${bucketUrlPrefix}/${bucketname}`, { data: { userId } })
    return response.data
  } catch (error: any) {
    console.error('Ошибка при удалении корзины:', error)
    return { message: undefined, error: error }
  }
}

// Function to rename a bucket
export const renameBucket = async ({ oldBucketName, newBucketName, userId }: RenameBucket): Promise<RenameBucketResponse> => {
  try {
    const response = await api.put<RenameBucketResponse>(`${bucketUrlPrefix}/${oldBucketName}/rename`, {
      newBucketName,
      userId,
    });
    return response.data;
  } catch (error: any) {
    console.error('Ошибка при переименовании корзины:', error);
    return { message: undefined, error: error.message };
  }
};
