import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'Имя пользователя', required: false })
  name?: string;

  @ApiProperty({ description: 'Email пользователя', required: false })
  email?: string;

  @ApiProperty({ description: 'Пароль пользователя', required: false })
  password?: string;

  @ApiProperty({ description: 'Аватар пользователя', required: false })
  avatar?: string;

  @ApiProperty({ description: 'Настройки пользователя', required: false })
  settings?: Record<string, any>;
} 