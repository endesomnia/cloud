import { Module } from '@nestjs/common';
import { NestMinioClientController } from './minio.controller';
import { NestMinioModule } from 'nestjs-minio';

@Module({
  controllers: [NestMinioClientController],
  imports: [
    NestMinioModule.register({
      isGlobal: true,
      endPoint: process.env.MINIO_HOST || '165.232.95.114',
      port: Number(process.env.MINIO_PORT) || 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY || 'minio_test',
      secretKey: process.env.MINIO_SECRET_KEY || 'password123',
    }),
  ],
})
export class NestMinioClientModule {}
