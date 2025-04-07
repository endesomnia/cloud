import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MinioModule } from './minio/minio.module';
import { AuthModule } from './auth/auth.module';
import { BucketModule } from './bucket/bucket.module';
import { FileModule } from './files/file.module';
import { StarredModule } from './starred/starred.module';
import { SharedModule } from './shared/shared.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [MinioModule, AuthModule, BucketModule, FileModule, StarredModule, SharedModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
