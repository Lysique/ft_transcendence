import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createWriteStream } from 'fs';
import { Repository } from 'typeorm';
import { AvatarsService } from '../avatars/avatars.service';
import { AvatarDto } from '../avatars/dto/avatar.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  //  This creates a Repository of the User instance for the UsersService class
  constructor(
    private avatarService: AvatarsService,
    private httpService: HttpService,
    @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

  //  Utility method to get dto object from entity
  private entityToDto(user: User): UserDto {
    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.name = user.name;
    userDto.status = user.status;
    userDto.currentAvatarId = user.currentAvatarId;
    userDto.twoFactAuth = user.twoFactAuth;
    userDto.secret = user.secret;

    return userDto;
  }

  //  Create a user.
  public async create(createUserDto: CreateUserDto) {

    //  Create user entity based on createUserDto
    const user: User = new User();
    user.id = createUserDto.id;
    user.name = createUserDto.name;
    user.twoFactAuth = false;

    await this.userRepository.save(user);

    const userDto = this.entityToDto(user);
    const imageData: Buffer = await this.downloadImage(createUserDto.photoUrl);
    this.addAvatar(userDto, imageData);

    return userDto;
  }

  public async downloadImage(url : string) {

  const response = await this.httpService.axiosRef({
        url: url,
        method: 'GET',
        responseType: 'arraybuffer'
    });

    return Buffer.from(response.data, 'binary');
  }

  public async addAvatar(userDto: UserDto, data: Buffer)
  {
    const user = await this.userRepository.findOneBy({id : userDto.id})
    
    const avatarDto: AvatarDto = await this.avatarService.create({
      user: user,
      data: data.toString('base64')
    });

    if (userDto.currentAvatarId == null) {
      const userDto: UserDto = this.entityToDto(user);
      await this.addCurrentAvatar(avatarDto, userDto);
    }
  }

  public async addCurrentAvatar(avatarDto: AvatarDto, userDto: UserDto) {
    const user = await this.userRepository.findOneBy({id: userDto.id});

    user.currentAvatarId = avatarDto.id;

    await this.userRepository.save(user);
  };

  public async getCurrentAvatar(userDto: UserDto) {
    const user = await this.userRepository.findOneBy({id: userDto.id});

    if (user.currentAvatarId == null) {
      return null;
    }
    const avatarDto: AvatarDto = await this.avatarService.findOneById(user.currentAvatarId);

    return avatarDto;
  };

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
