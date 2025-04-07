import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
