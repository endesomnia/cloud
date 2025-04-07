import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SharedService {
  constructor(private prisma: PrismaService) {}

  async getSharedWithUser(userId: string) {
    return this.prisma.sharedFile.findMany({
      where: {
        sharedToId: userId,
      },
      include: {
        sharedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getSharedByUser(userId: string) {
    return this.prisma.sharedFile.findMany({
      where: {
        sharedById: userId,
      },
      include: {
        sharedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async shareFile(
    bucketName: string,
    fileName: string,
    sharedById: string,
    sharedToId: string,
  ) {
    // Проверяем, существует ли уже такой элемент
    const existingShare = await this.prisma.sharedFile.findFirst({
      where: {
        bucketName,
        fileName,
        sharedById,
        sharedToId,
      },
    });

    // Если элемент уже существует, возвращаем его
    if (existingShare) {
      return existingShare;
    }

    // Иначе создаем новый
    return this.prisma.sharedFile.create({
      data: {
        bucketName,
        fileName,
        sharedById,
        sharedToId,
      },
      include: {
        sharedBy: {
          select: {
            name: true,
            email: true,
          },
        },
        sharedTo: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async removeShare(id: string, userId: string) {
    // Для безопасности убедимся, что элемент принадлежит пользователю
    return this.prisma.sharedFile.deleteMany({
      where: {
        id,
        OR: [
          { sharedById: userId },
          { sharedToId: userId }
        ],
      },
    });
  }

  async isFileSharedWithUser(bucketName: string, fileName: string, userId: string) {
    const share = await this.prisma.sharedFile.findFirst({
      where: {
        bucketName,
        fileName,
        sharedToId: userId,
      },
    });
    
    return !!share;
  }
} 