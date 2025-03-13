import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { BucketService } from './bucket.service';
import { ApiBody } from '@nestjs/swagger';
import { CreateBucketDto } from './dto';

@Controller('buckets')
export class BucketController {
  constructor(private readonly BucketService: BucketService) {}

  @Get()
  async listBuckets() {
    try {
      const buckets = await this.BucketService.listBuckets();
      return buckets;
    } catch (error) {
      return error;
    }
  }

  @Post(':bucketname')
  @ApiBody({ type: CreateBucketDto })
  async createBucket(
    @Param('bucketname') bucketname: string,
    @Body('access') access: 'public' | 'private',
    @Res() res: Response,
  ) {
    try {
      const result = await this.BucketService.createBucket(bucketname, access);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Delete(':bucketname')
  async deleteBucket(
    @Param('bucketname') bucketname: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.BucketService.deleteBucket(bucketname);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
