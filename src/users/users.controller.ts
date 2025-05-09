import { Controller, Get, Post, Body, Param, Delete, Put, Res, UnauthorizedException, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly authService : AuthService) {}

  @Post('validarToken')
    async obtenerTareas( @Req() req: any) {
      let idUsuario = await this.authService.validateToken(req.cookies.access_token);
      if (!idUsuario) {
        return false;
      } else {
        return true;
      }
    }

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

  @Post('cerrarSesion')
  async cerrarSesion(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return true;
  }

  @Get('obtenerNombreUsuarioToken')
  async obtenerNombreUsuarioToken(@Req() req: any) {
    let idUsuario = await this.authService.validateToken(req.cookies.access_token);
    if (!idUsuario) {
      throw new UnauthorizedException('No autorizado');
    } else {
      return this.usersService.obtenerNombreUsuarioToken(idUsuario);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}
