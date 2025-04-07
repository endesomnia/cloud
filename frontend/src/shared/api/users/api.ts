import { api } from '@shared/api/instance'
import { usersUrlPrefix } from '@src/shared/constant'

export interface UserStats {
  totalStorage: number;
  usedStorage: number;
  filesUploaded: number;
  filesDownloaded: number;
  filesDeleted: number;
  lastActive: string;
  fileTypes: {
    name: string;
    size: number;
    color: string;
  }[]; 
  activityData: number[];
}

interface GetUserStatsParams {
  userId: string;
}

interface UpdateUserParams {
  userId: string;
  userData: {
    name?: string;
    email?: string;
    password?: string;
    avatar?: string;
    settings?: any;
  };
}

export const getUserStats = async ({ userId }: GetUserStatsParams): Promise<UserStats | undefined> => {
  try {
    const response = await api.get<UserStats>(`${usersUrlPrefix}/${userId}/stats`);
    return response.data;
  } catch (error: any) {
    console.error('Ошибка при получении статистики пользователя:', error);
    return undefined;
  }
};

export const updateUser = async ({ userId, userData }: UpdateUserParams): Promise<any> => {
  try {
    const response = await api.patch(`${usersUrlPrefix}/${userId}`, userData);
    return response.data;
  } catch (error: any) {
    console.error('Ошибка при обновлении данных пользователя:', error);
    return { success: false, error };
  }
}; 