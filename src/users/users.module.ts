import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    EncryptionModule,
    AuthModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
