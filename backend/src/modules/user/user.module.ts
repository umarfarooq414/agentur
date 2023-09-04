import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryConfigService } from '@config/cloudinaryConfig';
import { Documents } from './entities/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Documents]), AuthModule],
  controllers: [UserController],
  providers: [UserService, CloudinaryConfigService],
})
export class UserModule {}
