import { Module } from '@nestjs/common';
import { BucketController } from './bucket.controller';
import { BucketService } from './bucket.service';

@Module({
  providers: [BucketService],
  controllers: [BucketController],
})
export class BucketModule {}
