import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { Tarea } from './entities/tarea.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TareasService {

  constructor(
    @InjectRepository(Tarea)
    private tareaRepository: Repository<Tarea>,

    @InjectRepository(User)
    private usersService : Repository<User>,
  ) {}

  async create(createTareaDto: CreateTareaDto, idUsuario: number) {
    try {
      let tarea = this.tareaRepository.create({
        ...createTareaDto,
        usuario: { id: idUsuario },
      });
      let tareaCreada = await this.tareaRepository.save(tarea);
      return !!tareaCreada?.id;
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      return false;
    }
  }

  async obtenerTareas(idUsuario) {
    let usuario = await this.usersService.findOneBy({ id: idUsuario , activo: true});
    if (!usuario) {
      throw new ConflictException('Nombre de usuario ya registrado');
    }
    let tareas = await this.tareaRepository.find({ 
      where : {
        usuario,
        activo: true,
      },
      select: ['id', 'tarea', 'descripcion', 'fechaCompletado'],
      order: { id: 'ASC' },
    });
    return tareas;
  }

  async obtenerTareasPendientes(idUsuario) {
    let usuario = await this.usersService.findOneBy({ id: idUsuario , activo: true});
    if (!usuario) {
      throw new ConflictException('Nombre de usuario ya registrado');
    }
    let tareas = await this.tareaRepository.find({ 
      where: {
        usuario: { id: idUsuario },
        fechaCompletado: IsNull(),
        activo: true,
      },
      select: ['id', 'tarea', 'descripcion', 'fechaCompletado'],
      order: { id: 'ASC' },
    });
    return tareas;
  }

  async obtenerTareasCompletadas(idUsuario) {
    let usuario = await this.usersService.findOneBy({ id: idUsuario , activo: true});
    if (!usuario) {
      throw new ConflictException('Nombre de usuario ya registrado');
    }
    let tareas = await this.tareaRepository.find({ 
      where: {
        usuario: { id: idUsuario },
        fechaCompletado: Not(IsNull()),
        activo: true,
      }
    });
    return tareas;
  }

  async obtenerTarea(idTarea: number, idUsuario: number) {
    let tarea = await this.tareaRepository.findOne({ 
      where: {
        id: idTarea,
        usuario: { id: idUsuario }, 
      }
    });
    if (!tarea) {
      throw new NotFoundException('Tarea no encontrada');
    }
    return tarea;
  }


  async borrar(idTarea: number): Promise<boolean> {
  try {
    let result = await this.tareaRepository.update(idTarea, { activo: false });
    if (result.affected == 0) {
        return false;
      } else {
        return true;
      } // Devuelve true si se actualizó al menos un registro
  } catch (error) {
    console.error('Error al borrar la tarea:', error);
    return false;
  }
}

  async completar(idTarea: number): Promise<boolean> {
    try {
      const result = await this.tareaRepository.update(idTarea, { fechaCompletado: new Date() });
      if (result.affected == 0) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error('Error al completar la tarea:', error);
      return false;
    }
  }

  update(id: number, updateTareaDto: UpdateTareaDto) {
    return `This action updates a #${id} tarea`;
  }
}
