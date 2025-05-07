import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { Tarea } from './entities/tarea.entity';
import { Repository } from 'typeorm';
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
    let usuario = await this.usersService.findOneBy({ id: idUsuario });
    if (!usuario) {
      throw new ConflictException('Nombre de usuario ya registrado');
    }
    let tareas = await this.tareaRepository.find({ where : {usuario}});
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


  async borrar(idTarea: number) {
    return await this.tareaRepository.update(idTarea, { activo: false });
  }

  async completar(idTarea: number) {
    return await this.tareaRepository.update(idTarea, { fechaCompletado: new Date() });
  }

  update(id: number, updateTareaDto: UpdateTareaDto) {
    return `This action updates a #${id} tarea`;
  }
}
