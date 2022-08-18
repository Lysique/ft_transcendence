import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { Avatar } from './entities/avatar.entity';

@Injectable()
export class AvatarsService {
  constructor(@InjectRepository(Avatar) private avatarRepository: Repository<Avatar>) {}

  public async create(createAvatarDto: CreateAvatarDto) {
      const avatar: Avatar = new Avatar();
      avatar.user = createAvatarDto.user;
      avatar.data = createAvatarDto.data;
  
      await this.avatarRepository.save(avatar);
  
      return avatar;
  }

  public async addCurrentAvatar(updateAvatarDto: UpdateAvatarDto)
  {
    const avatar = await this.avatarRepository.findOneBy({id: updateAvatarDto.id});
    avatar.current = updateAvatarDto.user;

    await this.avatarRepository.save(avatar);
  }

  findAll() {
    return `This action returns all avatars`;
  }

  findOne(id: number) {
    return `This action returns a #${id} avatar`;
  }

  remove(id: number) {
    return `This action removes a #${id} avatar`;
  }
}