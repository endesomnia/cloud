import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Bucket } from '../api';
import { S } from 'node_modules/framer-motion/dist/types.d-B50aGbjN';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDisplayFileName = (fullName?: string, userId?: string): string => {
  if (!fullName) return '';
  if (userId && fullName.startsWith(userId + '_')) {
    return fullName.substring(userId.length + 1);
  }
  return fullName;
};

export const getDisplayBucketName = (fullName?: string, userId?: string): string => {
  if (!fullName) return '';
  if (userId && fullName.startsWith(userId + '-')) {
    return fullName.substring(userId.length + 1);
  }
  return fullName;
};

export const findSystemBucketName = (displayName: string, buckets: Bucket[], userId: string) => {
  const found = buckets.find(bucket =>
    getDisplayBucketName(bucket.name, userId) === displayName
  )
  return found ? found.name : displayName
}