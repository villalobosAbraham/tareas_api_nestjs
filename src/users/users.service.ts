import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { EncryptionService } from 'src/encryption/encryption.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly encryptionService: EncryptionService, // Asegúrate de importar y proporcionar el servicio de cifrado
  ) {}

  async create(createUserDto: CreateUserDto) {
    let user = await this.userRepository.findOneBy({ correo: createUserDto.correo });
    if (user) {
      throw new ConflictException('Correo ya registrado');
    }

    let userByUsername = await this.userRepository.findOneBy({ usuario: createUserDto.usuario });
    if (userByUsername) {
      throw new ConflictException('Nombre de usuario ya registrado');
    }

    let passwordHash = await this.encryptionService.hashPassword(createUserDto.password);
    let nuevoUsuario =  this.userRepository.create({
      ...createUserDto,
      password: passwordHash,
    });

    try {
      let usuarioCreado = await this.userRepository.save(nuevoUsuario);
      return !!usuarioCreado?.id;
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      return false;
    }
  }

  async login(loginUserDto: LoginUserDto) {
    let user = await this.userRepository.findOneBy({ correo: loginUserDto.correo });
    if (!user) {
      return false;
    }
    let isPasswordValid = await this.encryptionService.comparePassword(loginUserDto.password, user.password);
    if (!isPasswordValid) {
      return false;
    }

    return user.id;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
