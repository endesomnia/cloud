import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId/stats')
  @ApiParam({ name: 'userId', description: 'ID пользователя' })
  async getUserStats(@Param('userId') userId: string) {
    const stats = await this.usersService.getUserStats(userId);
    if (!stats) {
      return { message: 'Пользователь не найден' };
    }
    return stats;
  }

  @Patch(':userId')
  @ApiParam({ name: 'userId', description: 'ID пользователя' })
  @ApiBody({ type: UpdateUserDto })
  async updateUser(
    @Param('userId') userId: string,
    @Body() userData: UpdateUserDto,
  ) {
    try {
      const updatedUser = await this.usersService.updateUser(userId, userData);
      return { 
        message: 'Данные пользователя обновлены',
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
        }
      };
    } catch (error) {
      return { 
        message: 'Ошибка при обновлении пользователя',
        error: error.message 
      };
    }
  }
}
