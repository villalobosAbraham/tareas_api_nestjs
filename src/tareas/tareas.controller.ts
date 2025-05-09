import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService, private readonly authService : AuthService) {}

  @Get()
  async obtenerTareas( @Req() req: any) {
    let idUsuario = await this.authService.validateToken(req.cookies.access_token);
    if (!idUsuario) {
      throw new UnauthorizedException('No autorizado');
    } else {
      return this.tareasService.obtenerTareas(idUsuario);
    }
  }

  @Get('obtenerTareasPendientes')
  async obtenerTareasPendientes( @Req() req: any) {
    let idUsuario = await this.authService.validateToken(req.cookies.access_token);
    if (!idUsuario) {
      throw new UnauthorizedException('No autorizado');
    } else {
      return this.tareasService.obtenerTareasPendientes(idUsuario);
    }
  }

  @Get('obtenerTareasCompletadas')
  async obtenerTareasCompletadas( @Req() req: any) {
    let idUsuario = await this.authService.validateToken(req.cookies.access_token);
    if (!idUsuario) {
      throw new UnauthorizedException('No autorizado');
    } else {
      return this.tareasService.obtenerTareasCompletadas(idUsuario);
    }
  }

  @Post('crear')
  async create(@Body() createTareaDto: CreateTareaDto, @Req() req: any) {
    let idUsuario = await this.authService.validateToken(req.cookies.access_token);
    if (!idUsuario) {
      throw new UnauthorizedException('No autorizado');
    } else {
      return this.tareasService.create(createTareaDto, Number(idUsuario));
    }
  }

  @Patch ('borrar/:id')
  async borrar(@Param('id') idTarea: number, @Req() req: any) {
    let idUsuario = await this.authService.validateToken(req.cookies.access_token);
    if (!idUsuario) {
      throw new UnauthorizedException('No autorizado');
    } else {
      return this.tareasService.borrar(Number(idTarea));
    }
  }

  @Patch ('completar/:id')
  async completar(@Param('id') idTarea: number, @Req() req: any) {
    let idUsuario = await this.authService.validateToken(req.cookies.access_token);
    if (!idUsuario) {
      throw new UnauthorizedException('No autorizado');
    } else {
      return this.tareasService.completar(Number(idTarea));
    }
  }

  @Get(':id')
  async obtenerTarea(@Param('id') idTarea: number, @Req() req: any) {
    let idUsuario = await this.authService.validateToken(req.cookies.access_token);
    if (!idUsuario) {
      throw new UnauthorizedException('No autorizado');
    }
    return this.tareasService.obtenerTarea(idTarea, idUsuario);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTareaDto: UpdateTareaDto) {
    return this.tareasService.update(+id, updateTareaDto);
  }
}
