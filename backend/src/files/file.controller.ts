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
} from '@nestjs/common';
import { Response } from 'express';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody } from '@nestjs/swagger';
import { MoveFileDto, RenameFileDto } from './dto/dto';
import { log } from 'console';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':bucketname')
  async getFilesByBucket(
    @Param('bucketname') bucketname: string,
    @Res() res: Response,
  ) {
    try {
      const files = await this.fileService.getFilesByBucket(bucketname);
      res.json(files);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Get(':bucketname/:filename')
  async getFileByBucketAndName(
    @Param('bucketname') bucketname: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const fileStream = await this.fileService.getFile(bucketname, filename);
      fileStream.pipe(res);
    } catch (error) {
      res.status(500).send(`Error downloading file: ${error.message}`);
    }
  }

  @Post(':bucketname')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('bucketname') bucketname: string,
  ) {
    if (!file) {
      throw new Error('File is required');
    }
    try {
      const result = await this.fileService.uploadFile(bucketname, file);
      return result;
    } catch (error) {
      return { error: error };
    }
  }

  @Post('/move/:bucketname/:filename')
  @ApiBody({ type: MoveFileDto })
  async moveFile(
    @Param('bucketname') bucketname: string,
    @Param('filename') filename: string,
    @Body('targetBucket') targetBucket: string,
    @Res() res: Response,
  ) {
    if (!bucketname || !targetBucket || !filename) {
      res.status(500).json({
        error:
          'missing one of 3 required argument: oldbucket, targetbucket and filename',
      });
    }
    try {
      const result = await this.fileService.moveFile(
        bucketname,
        targetBucket,
        filename,
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Post('/rename/:bucketname/:filename')
  @ApiBody({ type: RenameFileDto })
  async renameFile(
    @Param('bucketname') bucketname: string,
    @Param('filename') filename: string,
    @Body('newFilename') newFilename: string,
    @Res() res: Response,
  ) {
    log(bucketname, filename, newFilename);
    try {
      const result = await this.fileService.renameFile(
        bucketname,
        filename,
        newFilename,
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Delete(':bucketname/:filename')
  async deleteFileByBucketAndName(
    @Param('bucketname') bucketname: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const response = await this.fileService.deleteFile(bucketname, filename);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
