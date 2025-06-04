import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  Put,
} from '@nestjs/common';
import { Response } from 'express';
import { BucketService } from './bucket.service';
import { ApiBody } from '@nestjs/swagger';
import { CreateBucketDto } from './dto';

@Controller('buckets')
export class BucketController {
  constructor(private readonly BucketService: BucketService) {}

  @Get(":userId")
  @ApiBody({ type: CreateBucketDto })
  async listBuckets(@Param('userId') userId: string) {
    try {
      return await this.BucketService.listBuckets(userId);;
    } catch (error) {
      return error;
    }
  }

  @Post(':bucketname')
  @ApiBody({ type: CreateBucketDto })
  async createBucket(
    @Param('bucketname') bucketname: string,
    @Body('access') access: 'public' | 'private',
    @Body('userId') userId: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.BucketService.createBucket(bucketname, access, userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Delete(':bucketname')
  async deleteBucket(
    @Param('bucketname') bucketname: string,
    @Body('userId') userId: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.BucketService.deleteBucket(bucketname, userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Put(':oldBucketName/rename')
  async renameBucket(
    @Param('oldBucketName') oldBucketName: string,
    @Body('newBucketName') newBucketName: string,
    @Body('userId') userId: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.BucketService.renameBucket(oldBucketName, newBucketName, userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
