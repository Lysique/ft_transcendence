import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvatarsService } from '../avatars/avatars.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  //  This creates a Repository of the User instance for the UsersService class
  constructor(
    private avatarService: AvatarsService,
    @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

  //  Utility method to get dto object from entity
  private entityToDto(user: User): UserDto {
    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.name = user.name;
    userDto.status = user.status;
    userDto.twoFactAuth = user.twoFactAuth;
    userDto.secret = user.secret;

    return userDto;
  }

  //  Create a user.
  public async create(createUserDto: CreateUserDto) {

    //  Create user entity based on userDto
    const user: User = new User();
    user.id = createUserDto.id;
    user.name = createUserDto.name;
    user.twoFactAuth = false;
  
    await this.userRepository.save(user);
    //  Create a UserDto (!= CreateUserDto) to return
    const userDto = this.entityToDto(user);

    return userDto;
  }

  public async addAvatar(userDto: UserDto, data: Buffer)
  {
    const user = await this.userRepository.findOneBy({id : userDto.id})
    
    const avatar = await this.avatarService.create({
      user:user, 
      data: data.toString('base64')
    });
    this.avatarService.addCurrentAvatar({id : avatar.id, user: user});
  }

  //  Find all users.
  public async findAll() {
    const users: User[] = await this.userRepository.find();

    const usersDto: UserDto[] = users.map(x => this.entityToDto(x));

    return usersDto;
  }
  
  //  Find one user by id.
  public async findOneById(id: number) {
    const user: User = await this.userRepository.findOneBy({ id: id });

    if (!user) return null;
  
    const userDto: UserDto = this.entityToDto(user);

    return userDto;
  }

  //  Update user infos.
  public async update(id: number, updateUserDto: UpdateUserDto) {
    const user: User = await this.userRepository.findOneBy({ id: id});

    if (!user) throw new NotFoundException(`User with id ${id} was not found`);

    //  Modify user variables.
    user.name = updateUserDto.name || user.name;
    user.status = updateUserDto.status || user.status;
    user.secret = updateUserDto.secret || user.secret;
    user.twoFactAuth = updateUserDto.twoFactAuth || user.twoFactAuth;

    await this.userRepository.save(user);

    const userDto: UserDto = this.entityToDto(user);

    return userDto;
  }

  //  Delete user.
  public async remove(id: number) {
    const user: User = await this.userRepository.findOneBy({ id: id});

    if (!user) throw new NotFoundException(`User with id ${id} was not found`);

    await this.userRepository.remove(user);
  }
}
