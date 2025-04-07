import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { SharedController } from './shared.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SharedController],
  providers: [SharedService, PrismaService],
  exports: [SharedService],
})
export class SharedModule {} 