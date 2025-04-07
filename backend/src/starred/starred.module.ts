import { Module } from '@nestjs/common';
import { StarredService } from './starred.service';
import { StarredController } from './starred.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [StarredController],
  providers: [StarredService, PrismaService],
  exports: [StarredService],
})
export class StarredModule {} 