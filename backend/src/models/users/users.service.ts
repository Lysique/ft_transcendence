import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvatarsService } from '../avatars/avatars.service';
import { AvatarDto } from '../avatars/dto/avatar.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FriendDto } from './dto/friend.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  //  This creates a Repository of the User instance for the UsersService class
  constructor(
    private httpService: HttpService,
    private avatarService: AvatarsService,
    @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

  private entityToFriendDto(user: User) {
    const friendDto = new FriendDto();

    friendDto.id = user.id;
    friendDto.name = user.name;
    friendDto.status = user.status;
    friendDto.currentAvatar = user.currentAvatarId? {id: user.currentAvatarId, data:user.currentAvatarData} : null;

    return friendDto;
  }

  //  Utility method to get dto object from entity
  private entityToDto(user: User): UserDto {
    const userDto = new UserDto();

    userDto.id = user.id;
    userDto.name = user.name;
    userDto.status = user.status;
    userDto.friends = user.friends? user.friends.map(x => this.entityToFriendDto(x)): [];
    userDto.currentAvatar = user.currentAvatarId? {id: user.currentAvatarId, data:user.currentAvatarData} : null;
    userDto.twoFactAuth = user.twoFactAuth;

    return userDto;
  }

  //  Create a user.
  public async create(createUserDto: CreateUserDto) {

    //  Create user entity based on createUserDto
    const user: User = new User();
    user.id = createUserDto.id;
    user.name = createUserDto.name;

    try {
      await this.userRepository.save(user);
    }
    catch(error) {
      user.name = null;
      await this.userRepository.save(user);
    }

    const userDto = this.entityToDto(user);
    const imageData: Buffer = await this.downloadImage(createUserDto.photoUrl);
    await this.addAvatar(userDto, imageData);
    
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
  
  //  Find all users.
  public async findAll() {
    const users: User[] = await this.userRepository.find();

    const usersDto: UserDto[] = users.map(x => this.entityToDto(x));

    return usersDto;
  }
  
  //  Find one user by id.
  public async findOneById(id: number) {
    const user: User = await this.userRepository.findOneBy({ id: id });
    
    if (!user) {
      return null;
    }

    const userDto: UserDto = this.entityToDto(user);

    return userDto;
  }

  public async updateName(id: number, name: string) {
    const user: User = await this.userRepository.findOneBy({ id: id });

    user.name = name;
    try {
      await this.userRepository.save(user);
    }
    catch(error) {
      return null;
    }

    const userDto: UserDto = this.entityToDto(user);
    return userDto;
  }

  public async addFriend(userId: number, friendId: number) {
    const user: User = await this.userRepository.findOneBy({ id: userId });
    const friend: User = await this.userRepository.findOneBy({ id: friendId });

    if (userId !== friendId) {
      if (user.friends) {
        user.friends.push(friend);
      }
      else {
        user.friends = [friend];
      }
      await this.userRepository.save(user);
    }

    const userDto: UserDto = this.entityToDto(user);
    return userDto;
  }

  public async updateSecret(id: number, secret: string) {
    const user: User = await this.userRepository.findOneBy({ id: id });
    user.secret = secret;
    await this.userRepository.save(user); 
  }

  public async getSecret(id: number) {
    const user: User = await this.userRepository.findOneBy({ id: id });
    return user.secret;
  }

  public async turnOnTfa(id: number) {
    const user: User = await this.userRepository.findOneBy({ id: id });
    user.twoFactAuth = true;
    await this.userRepository.save(user);
  }

  public async turnOffTfa(id: number) {
    const user: User = await this.userRepository.findOneBy({ id: id });
    user.twoFactAuth = false;
    await this.userRepository.save(user);
  }

  public async addAvatar(userDto: UserDto, data: Buffer)
  {
    const user = await this.userRepository.findOneBy({id : userDto.id})
    
    const avatarDto: AvatarDto = await this.avatarService.create({
      user: user,
      data: data.toString('base64')
    });

    await this.updateCurrentAvatar(userDto, avatarDto.id);

    return avatarDto;
  }

  public async updateCurrentAvatar(userDto: UserDto, avatarId: number) {
    const avatarDto: AvatarDto = await this.avatarService.findOneById(avatarId);

    const user = await this.userRepository.findOneBy({id: userDto.id});
    user.currentAvatarData = avatarDto.data;
    user.currentAvatarId = avatarDto.id;
    await this.userRepository.save(user);

    return avatarDto;
  };

  public async getAllAvatars(userDto: UserDto) {
    const user = await this.userRepository.findOneBy({id: userDto.id});

    if (user.avatars.length == 0) {
      return null;
    }

    const avatarDto: AvatarDto[] = user.avatars.map(x => this.avatarService.entityToDto(x));

    return avatarDto;
  };

  public async removeAvatar(avatarId: number, userId: number) {
    await this.avatarService.remove(avatarId);

    const user = await this.userRepository.findOneBy({id: userId});

    if (user.currentAvatarId == avatarId) {
      user.currentAvatarId = null;
      user.currentAvatarData = null;
      await this.userRepository.save(user);
    }
  }

}
