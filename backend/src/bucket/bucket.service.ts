import { Inject, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Client } from 'minio';
import { MINIO_CONNECTION } from 'nestjs-minio';

@ApiTags('Buckets')
@Injectable()
export class BucketService {
  constructor(@Inject(MINIO_CONNECTION) private readonly minioClient: Client) {}

  async listBuckets(userId?: string) {
    const allBuckets = await this.minioClient.listBuckets();

    if (!userId) return allBuckets;
    (allBuckets);
    return allBuckets.filter((bucket: any) => bucket.name.startsWith(userId + '-'));
  }

  async createBucket(bucketname: string, access: 'public' | 'private', userId?: string) {
    try {
      const realBucketName = userId ? `${userId}-${bucketname}` : bucketname;
      await this.minioClient.makeBucket(realBucketName);

      const policy = access === 'public' ? 'public-read' : 'none';
      const generatedPolicy = this.generateBucketPolicy(realBucketName, policy);

      await this.minioClient.setBucketPolicy(realBucketName, generatedPolicy);
      return {
        message: 'bucket created successfully',
        bucketName: realBucketName,
        error: undefined,
      };
    } catch (error) {
      return {
        message: undefined,
        bucketName: undefined,
        error: error.message || error.code || error.name || 'Unknown error creating bucket',
      };
    }
  }

  async deleteBucket(bucketname: string, userId?: string) {
    try {
      const realBucketName = userId ? `${userId}-${bucketname}` : bucketname;
      await this.minioClient.removeBucket(realBucketName);
      return { message: 'bucket remove successfully', error: undefined };
    } catch (error) {
      return { message: undefined, error: error.message || error.code || error.name || 'Unknown error deleting bucket' };
    }
  }

  private generateBucketPolicy(bucketName: string, policyType: string): string {
    if (policyType === 'public-read') {
      return JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: `arn:aws:s3:::${bucketName}/*`,
          },
        ],
      });
    } else {
      return JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Deny',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: `arn:aws:s3:::${bucketName}/*`,
          },
        ],
      });
    }
  }

  async renameBucket(oldBucketName: string, newBucketName: string, userId?: string) {
    const realOldBucketName = userId ? `${userId}-${oldBucketName}` : oldBucketName;
    const realNewBucketName = userId ? `${userId}-${newBucketName}` : newBucketName;

    try {
      await this.minioClient.makeBucket(realNewBucketName);
      const policy = this.generateBucketPolicy(realNewBucketName, 'none');
      await this.minioClient.setBucketPolicy(realNewBucketName, policy);

      const objectsStream = this.minioClient.listObjects(realOldBucketName, '', true);
      const objectsToCopy: string[] = [];
      for await (const obj of objectsStream) {
        objectsToCopy.push(obj.name);
      }

      for (const objectName of objectsToCopy) {
        await this.minioClient.copyObject(realNewBucketName, objectName, `${realOldBucketName}/${objectName}`);
      }

      await this.minioClient.removeObjects(realOldBucketName, objectsToCopy);
      await this.minioClient.removeBucket(realOldBucketName);

      return {
        message: 'Bucket renamed successfully',
        oldBucketName: realOldBucketName,
        newBucketName: realNewBucketName,
        error: undefined,
      };
    } catch (error) {
      try {
        await this.minioClient.removeBucket(realNewBucketName);
      } catch (cleanupError) {
        console.error(`Failed to cleanup new bucket ${realNewBucketName} after rename error:`, cleanupError);
      }
      return {
        message: undefined,
        error: error.message || error.code || error.name || 'Unknown error renaming bucket',
      };
    }
  }
}
