import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
