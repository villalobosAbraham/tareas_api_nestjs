import { Controller, Get, Post, Body, Param, Delete, Put, Res, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly authService : AuthService) {}

  @Post('registrar')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginuserDto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    let id = await this.usersService.login(loginuserDto);
    if (!id) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    let token = await this.authService.generateToken(Number(id));

    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 3600000, // 1 hora
    });
    return true;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
