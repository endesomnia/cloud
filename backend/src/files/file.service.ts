import { Injectable, Inject } from '@nestjs/common';
import { log } from 'console';
import { Client, BucketItem } from 'minio';
import { MINIO_CONNECTION } from 'nestjs-minio';

@Injectable()
export class FileService {
  constructor(@Inject(MINIO_CONNECTION) private readonly minioClient: Client) {}

  // get file content in bucket/filename
  async getFile(bucketname: string, filename: string) {
    try {
      return this.minioClient.getObject(bucketname, filename);
    } catch (error) {
      throw new Error(`Error fetching file: ${error.message}`);
    }
  }

  // get files list in bucket
  async getFilesByBucket(bucketname: string): Promise<BucketItem[]> {
    return new Promise((resolve, reject) => {
      const objects: BucketItem[] = [];
      const stream = this.minioClient.listObjectsV2(bucketname);

      stream.on('data', (obj: BucketItem) => objects.push(obj));
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
  ): Promise<any> {
    const metaData = {
      'Content-Type': file.mimetype,
      'Content-Length': file.size,
    };

    try {
      await this.minioClient.putObject(
        bucketName,
        file.originalname,
        file.buffer,
        file.size,
        metaData,
      );
      return {
        message: 'File uploaded successfully',
        fileName: file.originalname,
        placedOn: bucketName,
      };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  // DELETE
  async deleteFile(bucketname: string, filename: string) {
    try {
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
