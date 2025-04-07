import { Controller, Get, Post, Delete, Body, Param, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { StarredService } from './starred.service';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('starred')
@Controller('starred')
export class StarredController {
  constructor(private readonly starredService: StarredService) {}

  @Get(':userId')
  async getStarredItems(@Param('userId') userId: string, @Res() res: Response) {
    try {
      const starredItems = await this.starredService.getStarredItems(userId);
      return res.json(starredItems);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to get starred items',
        error: error.message,
      });
    }
  }

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        bucketName: { type: 'string' },
        fileName: { type: 'string' },
        type: { type: 'string', enum: ['file', 'folder'] },
      },
    },
  })
  async addStarredItem(
    @Body() body: { userId: string; bucketName: string; fileName: string; type: 'file' | 'folder' },
    @Res() res: Response,
  ) {
    try {
      const { userId, bucketName, fileName, type } = body;
      const starredItem = await this.starredService.addStarredItem(
        userId,
        bucketName,
        fileName,
        type,
      );
      return res.status(HttpStatus.CREATED).json(starredItem);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to add starred item',
        error: error.message,
      });
    }
  }

  @Delete(':id/:userId')
  async removeStarredItem(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Res() res: Response,
  ) {
    try {
      await this.starredService.removeStarredItem(id, userId);
      return res.status(HttpStatus.OK).json({
        message: 'Starred item removed successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to remove starred item',
        error: error.message,
      });
    }
  }

  @Get(':userId/:bucketName/:fileName')
  async isItemStarred(
    @Param('userId') userId: string,
    @Param('bucketName') bucketName: string,
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    try {
      const isStarred = await this.starredService.isItemStarred(userId, bucketName, fileName);
      return res.json({ isStarred });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to check if item is starred',
        error: error.message,
      });
    }
  }
} 