import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'name of user', required: true })
  name: string;

  @ApiProperty({ description: 'user password', required: true })
  password: string;

  @ApiProperty({ description: 'user email', required: true })
  email: string;
}

export class VerifyUserDto {
  @ApiProperty({ description: 'user password', required: true })
  password: string;

  @ApiProperty({ description: 'user email', required: true })
  email: string;
}

export class GetUserByIdDto {
  @ApiProperty({ description: 'user Id', required: true })
  userId: string;
}
