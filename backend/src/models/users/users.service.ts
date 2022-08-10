import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User, UserStatus } from './entities/user.entity';

@Injectable()
export class UsersService {

  //  This creates a Repository of the User instance for the UsersService class
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  //  Utility method to get dto object from entity
  private entityToDto(user: User): UserDto {
    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.status = user.status;
    userDto.pseudo = user.pseudo;

    return userDto;
  }

  public async create(createUserDto: CreateUserDto) {

    //  Create user entity based on userDto
    const user: User = new User();
    user.pseudo = createUserDto.pseudo;
    user.status = UserStatus.Online;

    await this.userRepository.save(user);

    //  Create a UserDto (!= CreateUserDto) to return
    const userDto = this.entityToDto(user);
    return userDto;
  }

  public async findAll() {
    const users: User[] = await this.userRepository.find();

    const usersDto: UserDto[] = users.map(x => this.entityToDto(x));

    return usersDto;
  }
  
  public async findOne(id: number) {
    const user: User = await this.userRepository.findOneBy({ id: id});

    if (!user) throw new NotFoundException(`User with id ${id} was not found`)
  
    const userDto: UserDto = this.entityToDto(user);
  
    return userDto;
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {
    const user: User = await this.userRepository.findOneBy({ id: id});

    if (!user) throw new NotFoundException(`User with id ${id} was not found`)

    //  Check which variable are asked to be modified
    user.pseudo = updateUserDto.pseudo || user.pseudo;
    user.status = updateUserDto.status || user.status;

    await this.userRepository.save(user);

    const userDto: UserDto = this.entityToDto(user);

    return userDto;
  }

  public async remove(id: number) {
    const user: User = await this.userRepository.findOneBy({ id: id});

    if (!user) throw new NotFoundException(`User with id ${id} was not found`)

    await this.userRepository.remove(user);
  }
}
