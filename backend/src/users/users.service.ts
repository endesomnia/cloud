import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        totalStorage: true,
        usedStorage: true,
        filesUploaded: true,
        filesDownloaded: true,
        filesDeleted: true,
        lastActive: true,
        fileTypeStats: true,
        activityData: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      totalStorage: user.totalStorage,
      usedStorage: user.usedStorage,
      filesUploaded: user.filesUploaded,
      filesDownloaded: user.filesDownloaded,
      filesDeleted: user.filesDeleted,
      lastActive: user.lastActive.toISOString(),
      fileTypes: user.fileTypeStats || [
        { name: 'Изображения', size: 0, color: '#4F46E5' },
        { name: 'Документы', size: 0, color: '#10B981' },
        { name: 'Видео', size: 0, color: '#F59E0B' },
        { name: 'Другое', size: 0, color: '#6D28D9' },
      ],
      activityData: user.activityData || Array(7).fill(0),
    };
  }

  async updateUser(userId: string, userData: Partial<User>) {
    const updateData: Prisma.UserUpdateInput = {};
    
    if (userData.name !== undefined) updateData.name = userData.name;
    if (userData.email !== undefined) updateData.email = userData.email;
    if (userData.password !== undefined) updateData.password = userData.password;
    if (userData.avatar !== undefined) updateData.avatar = userData.avatar;
    if (userData.settings !== undefined) updateData.settings = userData.settings as any;
    
    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  async incrementFileUploaded(userId: string, fileSize: number, fileType: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    // Конвертация из байт в гигабайты
    const sizeInGB = fileSize / (1024 * 1024 * 1024);
    
    // Обновление типов файлов
    let fileTypeStats = user.fileTypeStats as any[] || [
      { name: 'Изображения', size: 0, color: '#4F46E5' },
      { name: 'Документы', size: 0, color: '#10B981' },
      { name: 'Видео', size: 0, color: '#F59E0B' },
      { name: 'Другое', size: 0, color: '#6D28D9' },
    ];

    // Определение типа файла
    let fileTypeCategory = 'Другое';
    if (/^image\//.test(fileType)) {
      fileTypeCategory = 'Изображения';
    } else if (/^video\//.test(fileType)) {
      fileTypeCategory = 'Видео';
    } else if (/^application\/(pdf|msword|vnd\.openxmlformats|vnd\.ms-excel)/.test(fileType) || 
               /^text\//.test(fileType)) {
      fileTypeCategory = 'Документы';
    }

    // Обновляем статистику по типу файла
    fileTypeStats = fileTypeStats.map((type) => {
      if (type.name === fileTypeCategory) {
        return { ...type, size: type.size + sizeInGB };
      }
      return type;
    });

    // Обновление данных об активности
    const activityData = user.activityData as number[] || Array(7).fill(0);
    const today = new Date().getDay();
    activityData[today] = (activityData[today] || 0) + 1;

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        filesUploaded: { increment: 1 },
        usedStorage: { increment: sizeInGB },
        lastActive: new Date(),
        fileTypeStats: fileTypeStats,
        activityData: activityData,
      },
    });
  }

  async incrementFileDownloaded(userId: string) {
    // Обновление данных об активности
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    const activityData = user.activityData as number[] || Array(7).fill(0);
    const today = new Date().getDay();
    activityData[today] = (activityData[today] || 0) + 1;

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        filesDownloaded: { increment: 1 },
        lastActive: new Date(),
        activityData: activityData,
      },
    });
  }

  async incrementFileDeleted(userId: string, fileSize: number, fileType: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    // Конвертация из байт в гигабайты
    const sizeInGB = fileSize / (1024 * 1024 * 1024);
    
    // Обновление типов файлов
    let fileTypeStats = user.fileTypeStats as any[] || [
      { name: 'Изображения', size: 0, color: '#4F46E5' },
      { name: 'Документы', size: 0, color: '#10B981' },
      { name: 'Видео', size: 0, color: '#F59E0B' },
      { name: 'Другое', size: 0, color: '#6D28D9' },
    ];

    // Определение типа файла
    let fileTypeCategory = 'Другое';
    if (/^image\//.test(fileType)) {
      fileTypeCategory = 'Изображения';
    } else if (/^video\//.test(fileType)) {
      fileTypeCategory = 'Видео';
    } else if (/^application\/(pdf|msword|vnd\.openxmlformats|vnd\.ms-excel)/.test(fileType) || 
               /^text\//.test(fileType)) {
      fileTypeCategory = 'Документы';
    }

    // Обновляем статистику по типу файла
    fileTypeStats = fileTypeStats.map((type) => {
      if (type.name === fileTypeCategory) {
        const newSize = Math.max(0, type.size - sizeInGB); // не допускаем отрицательных значений
        return { ...type, size: newSize };
      }
      return type;
    });

    // Обновление данных об активности
    const activityData = user.activityData as number[] || Array(7).fill(0);
    const today = new Date().getDay();
    activityData[today] = (activityData[today] || 0) + 1;

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        filesDeleted: { increment: 1 },
        usedStorage: { decrement: sizeInGB },
        lastActive: new Date(),
        fileTypeStats: fileTypeStats,
        activityData: activityData,
      },
    });
  }
}
