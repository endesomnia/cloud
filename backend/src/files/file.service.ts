import { Injectable, Inject } from '@nestjs/common';
import { Client, BucketItem } from 'minio';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { UsersService } from '../users/users.service';

@Injectable()
export class FileService {
  constructor(
    @Inject(MINIO_CONNECTION) private readonly minioClient: Client,
    private readonly usersService: UsersService,
  ) {}

  // get file content in bucket/filename
  async getFile(bucketname: string, filename: string, userId?: string) {
    try {
      // Увеличиваем счетчик скачиваний, если указан userId
      if (userId) {
        await this.usersService.incrementFileDownloaded(userId);
      }
      
      return this.minioClient.getObject(bucketname, filename);
    } catch (error) {
      throw new Error(`Error fetching file: ${error.message}`);
    }
  }

  // get files list in bucket
  async getFilesByBucket(bucketname: string, userId?: string): Promise<BucketItem[]> {
    return new Promise((resolve, reject) => {
      const objects: BucketItem[] = [];
      const stream = this.minioClient.listObjectsV2(bucketname);

      stream.on('data', (obj: BucketItem) => {
        if (!userId || obj?.name?.startsWith(userId + '_')) {
          objects.push(obj);
        }
      });
      stream.on('end', () => resolve(objects));
      stream.on('error', (error) =>
        reject(new Error(`Error fetching file: ${error.message}`)),
      );
    });
  }

  // UPLOAD
  async uploadFile(
    bucketName: string,
    file: Express.Multer.File,
    userId?: string,
  ): Promise<any> {
    const metaData = {
      'Content-Type': file.mimetype,
      'Content-Length': file.size,
      'userId': userId || '',
    };
    try {
      const fileName = userId ? `${userId}_${file.originalname}` : file.originalname;
      await this.minioClient.putObject(
        bucketName,
        fileName,
        file.buffer,
        file.size,
        metaData,
      );
      // Обновляем статистику пользователя, если указан userId
      if (userId) {
        await this.usersService.incrementFileUploaded(userId, file.size, file.mimetype);
      }
      return {
        message: 'File uploaded successfully',
        fileName: fileName,
        placedOn: bucketName,
      };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  // DELETE
  async deleteFile(bucketname: string, filename: string, userId?: string) {
    try {
      // Если передан userId, нужно получить информацию о файле для обновления статистики
      if (userId) {
        try {
          const stat = await this.minioClient.statObject(bucketname, filename);
          await this.usersService.incrementFileDeleted(
            userId,
            stat.size,
            stat.metaData['Content-Type'] || '',
          );
        } catch (statError) {
          console.error('Error getting file stats:', statError);
          // Продолжаем удаление даже если не удалось получить статистику
        }
      }
      
      await this.minioClient.removeObject(bucketname, filename);
      return { message: 'File remove successfully' };
    } catch (error) {
      throw new Error(`Error remove file: ${error.message}`);
    }
  }

  // move file to new bucket
  async moveFile(
    sourceBucket: string,
    targetBucket: string,
    filename: string,
  ): Promise<any> {
    try {
      await this.minioClient.copyObject(
        targetBucket,
        filename,
        `${sourceBucket}/${filename}`,
      );
      // delete old file
      await this.minioClient.removeObject(sourceBucket, filename);
      return {
        message: 'File moved successfully',
        fileName: filename,
        placedOn: sourceBucket,
      };
    } catch (error) {
      throw new Error(`Failed to move file: ${error.message}`);
    }
  }

  // rename file
  async renameFile(
    bucketName: string,
    oldFileName: string,
    newFileName: string,
  ) {
    try {
      await this.minioClient.copyObject(
        bucketName,
        newFileName,
        `${bucketName}/${oldFileName}`,
      );

      await this.minioClient.removeObject(bucketName, oldFileName);

      return {
        message: 'File renamed successfully',
        fileName: newFileName,
      };
    } catch (error) {
      console.error(`Error during file rename: ${error.message}`);
      throw new Error(`Failed to rename file: ${error.message}`);
    }
  }
}