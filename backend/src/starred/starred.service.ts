import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StarredService {
  constructor(private prisma: PrismaService) {}

  async getStarredItems(userId: string) {
    return this.prisma.starredFile.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async addStarredItem(
    userId: string,
    bucketName: string,
    fileName: string,
    type: 'file' | 'folder',
  ) {
    // Проверяем, существует ли уже такой элемент
    const existingItem = await this.prisma.starredFile.findFirst({
      where: {
        userId,
        bucketName,
        fileName,
      },
    });

    // Если элемент уже существует, возвращаем его
    if (existingItem) {
      return existingItem;
    }

    // Иначе создаем новый
    return this.prisma.starredFile.create({
      data: {
        userId,
        bucketName,
        fileName,
        type,
      },
    });
  }

  async removeStarredItem(id: string, userId: string) {
    // Для безопасности убедимся, что элемент принадлежит пользователю
    return this.prisma.starredFile.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }

  async isItemStarred(userId: string, bucketName: string, fileName: string) {
    const item = await this.prisma.starredFile.findFirst({
      where: {
        userId,
        bucketName,
        fileName,
      },
    });
    
    return !!item;
  }
} 