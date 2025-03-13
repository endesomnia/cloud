import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody } from '@nestjs/swagger';
import { CreateUserDto, GetUserByIdDto, VerifyUserDto } from './dto';
import { log } from 'console';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: GetUserByIdDto })
  async getUserByOd(@Body() getdsByIdData: { id: string }) {
    const result = await this.authService.getUserById(getdsByIdData);
    return result;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateUserDto })
  async registerUser(
    @Body() userData: { name: string; email: string; password: string },
  ) {
    const result = await this.authService.createUser(userData);
    return result;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: VerifyUserDto })
  async loginUser(@Body() loginData: { email: string; password: string }) {
    const result = await this.authService.verifyUser(loginData);
    return result;
  }
}
