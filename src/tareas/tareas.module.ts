import { Module } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { TareasController } from './tareas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tarea } from './entities/tarea.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tarea, User]),
    AuthModule,
  ],
  controllers: [TareasController],
  providers: [TareasService],
})
export class TareasModule {}
