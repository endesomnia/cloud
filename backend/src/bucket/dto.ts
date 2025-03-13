import { ApiProperty } from '@nestjs/swagger';

export class CreateBucketDto {
  @ApiProperty({ description: 'Name of the target bucket', required: true })
  access: string;
}
