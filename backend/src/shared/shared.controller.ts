import { Controller, Get, Post, Delete, Body, Param, Res, HttpStatus, UseFilters } from '@nestjs/common';
import { Response } from 'express';
import { SharedService } from './shared.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('shared')
@Controller('shared')
export class SharedController {
  constructor(private readonly sharedService: SharedService) {}

  @Get('to/:userId')
  async getSharedWithUser(@Param('userId') userId: string, @Res() res: Response) {
    try {
      const sharedItems = await this.sharedService.getSharedWithUser(userId);
      return res.json(sharedItems);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to get shared items',
        error: error.message,
      });
    }
  }

  @Get('by/:userId')
  async getSharedByUser(@Param('userId') userId: string, @Res() res: Response) {
    try {
      const sharedItems = await this.sharedService.getSharedByUser(userId);
      return res.json(sharedItems);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to get shared by user items',
        error: error.message,
      });
    }
  }

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        bucketName: { type: 'string' },
        fileName: { type: 'string' },
        sharedById: { type: 'string' },
        sharedToId: { type: 'string' },
      },
    },
  })
  async shareFile(
    @Body() body: { bucketName: string; fileName: string; sharedById: string; sharedToId: string },
    @Res() res: Response,
  ) {
    try {
      const { bucketName, fileName, sharedById, sharedToId } = body;
      const sharedItem = await this.sharedService.shareFile(
        bucketName,
        fileName,
        sharedById,
        sharedToId,
      );
      return res.status(HttpStatus.CREATED).json(sharedItem);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to share file',
        error: error.message,
      });
    }
  }

  @Delete(':id/:userId')
  async removeShare(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Res() res: Response,
  ) {
    try {
      await this.sharedService.removeShare(id, userId);
      return res.status(HttpStatus.OK).json({
        message: 'Shared file removed successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to remove shared file',
        error: error.message,
      });
    }
  }

  @Get('check/:bucketName/:fileName/:userId')
  async isFileSharedWithUser(
    @Param('bucketName') bucketName: string,
    @Param('fileName') fileName: string,
    @Param('userId') userId: string,
    @Res() res: Response,
  ) {
    try {
      const isShared = await this.sharedService.isFileSharedWithUser(bucketName, fileName, userId);
      return res.json({ isShared });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to check if file is shared',
        error: error.message,
      });
    }
  }
} 