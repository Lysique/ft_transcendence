import { Injectable } from '@nestjs/common';
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

  public async create(createUserDto: CreateUserDto) {

    //  Create user entity based on userDto
    const user: User = new User();
    user.pseudo = createUserDto.pseudo;
    user.status = UserStatus.Online;

    await this.userRepository.save(user);

    //  Create a UserDto (!= CreateUserDto) to return
    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.status = user.status;
    userDto.pseudo = user.pseudo;

    return userDto;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
