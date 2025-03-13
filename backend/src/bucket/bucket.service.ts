import { Inject, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { log } from 'console';
import { Client } from 'minio';
import { MINIO_CONNECTION } from 'nestjs-minio';

@ApiTags('Buckets')
@Injectable()
export class BucketService {
  constructor(@Inject(MINIO_CONNECTION) private readonly minioClient: Client) {}

  async listBuckets() {
    return await this.minioClient.listBuckets();
  }

  async createBucket(bucketname: string, access: 'public' | 'private') {
    try {
      await this.minioClient.makeBucket(bucketname);

      const policy = access === 'public' ? 'public-read' : 'none';
      const generatedPolicy = this.generateBucketPolicy(bucketname, policy);

      await this.minioClient.setBucketPolicy(bucketname, generatedPolicy);
      return {
        message: 'bucket created successfully',
        bucketName: bucketname,
        error: undefined,
      };
    } catch (error) {
      return {
        error: error,
      };
    }
  }

  async deleteBucket(bucketname: string) {
    try {
      await this.minioClient.removeBucket(bucketname);
      return { message: 'bucket remove successfully', error: undefined };
    } catch (error) {
      return { message: undefined, error: error };
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
}
