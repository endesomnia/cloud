import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MoveFileDto, RenameFileDto } from './dto/dto';
import { log } from 'console';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':bucketname/:filename')
  @ApiParam({ name: 'bucketname', description: 'Name of your bucket' })
  @ApiParam({ name: 'filename', description: 'Name of your file' })
  @ApiQuery({ name: 'userId', description: 'ID пользователя для статистики', required: false })
  async getFile(
    @Param('bucketname') bucketname: string,
    @Param('filename') filename: string,
    @Query('userId') userId: string,
    @Res() res: Response,
  ) {
    try {
      const fileStream = await this.fileService.getFile(bucketname, filename, userId);
      const headers = {
        'Content-Disposition': `attachment; filename=${filename}`,
      };
      res.writeHead(200, headers);
      fileStream.pipe(res);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  @Get(':bucketname')
  @ApiParam({ name: 'bucketname', description: 'Name of your bucket' })
  @ApiQuery({ name: 'userId', description: 'ID пользователя для фильтрации', required: false })
  getFiles(@Param('bucketname') bucketname: string, @Query('userId') userId: string) {
    return this.fileService.getFilesByBucket(bucketname, userId);
  }

  @Post(':bucketname')
  @ApiParam({ name: 'bucketname', description: 'Name of your bucket' })
  @ApiQuery({ name: 'userId', description: 'ID пользователя для статистики', required: false })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('bucketname') bucketname: string,
    @Query('userId') userId: string,
  ) {
    if (!file) {
      throw new Error('File is required');
    }
    try {
      const result = await this.fileService.uploadFile(bucketname, file, userId);
      return result;
    } catch (error) {
      return { error: error };
    }
  }

  @Post('/move/:bucketname/:filename')
  @ApiParam({ name: 'bucketname', description: 'Name of your current bucket' })
  @ApiParam({ name: 'filename', description: 'Name of your file to move' })
  @ApiBody({ type: MoveFileDto })
  async moveFile(
    @Param('bucketname') bucketname: string,
    @Param('filename') filename: string,
    @Body() moveFileDto: MoveFileDto,
  ) {
    if (!bucketname || !moveFileDto.targetBucket || !filename) {
      throw new Error('Missing one of 3 required arguments: oldbucket, targetbucket and filename');
    }
    try {
      const result = await this.fileService.moveFile(
        bucketname,
        moveFileDto.targetBucket,
        filename,
      );
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('/rename/:bucketname/:filename')
  @ApiParam({ name: 'bucketname', description: 'Name of your bucket' })
  @ApiParam({ name: 'filename', description: 'Name of your file to rename' })
  @ApiBody({ type: RenameFileDto })
  async renameFile(
    @Param('bucketname') bucketname: string,
    @Param('filename') filename: string,
    @Body() renameFileDto: RenameFileDto,
  ) {
    log(bucketname, filename, renameFileDto.newFilename);
    try {
      const result = await this.fileService.renameFile(
        bucketname,
        filename,
        renameFileDto.newFilename,
      );
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Delete(':bucketname/:filename')
  @ApiParam({ name: 'bucketname', description: 'Name of your bucket' })
  @ApiParam({ name: 'filename', description: 'Name of your file to delete' })
  @ApiQuery({ name: 'userId', description: 'ID пользователя для статистики', required: false })
  async deleteFile(
    @Param('bucketname') bucketname: string,
    @Param('filename') filename: string,
    @Query('userId') userId: string,
  ) {
    try {
      const response = await this.fileService.deleteFile(bucketname, filename, userId);
      return response;
    } catch (error) {
      return { error: error.message };
    }
  }
}
