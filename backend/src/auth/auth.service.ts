import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createUser(data: { name: string; email: string; password: string }) {
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
      message: 'User successfully created',
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
        message: 'User doesnt exist',
      };
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return {
        status: '401',
        message: 'Invalid Credentials',
      };
    }

    const token = this.jwtService.sign({ userId: user.id, email: user.email });

    return {
      message: 'User verified',
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
