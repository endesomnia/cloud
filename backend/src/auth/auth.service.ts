import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createUser(data: { name: string; email: string; password: string }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return {
        status: '409', // Conflict
        message: 'user_already_exists',
      };
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    const token = this.jwtService.sign({ userId: user.id, email: user.email });

    return {
      message: 'user_created_successfully',
      user,
      token,
    };
  }

  async verifyUser(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return {
        status: '404',
        message: 'user_doesnt_exists',
      };
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return {
        status: '401',
        message: 'invalid_credentials',
      };
    }

    const token = this.jwtService.sign({ userId: user.id, email: user.email });

    return {
      message: 'user_verified',
      user,
      token,
    };
  }

  async getUserById(data: { id: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.id },
    });

    if (!user) {
      return {
        status: '404',
        message: 'User doesnt exist',
      };
    }

    return {
      message: 'User find sucess',
      user,
    };
  }
}
