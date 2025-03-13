import { ApiProperty } from '@nestjs/swagger';

export class MoveFileDto {
  @ApiProperty({ description: 'Name of the target bucket', required: true })
  targetBucket: string;
}

export class RenameFileDto {
  @ApiProperty({ description: 'New file name', required: true })
  newFilename: string;
}
