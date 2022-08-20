import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { CreateAvatarDto } from './dto/create-avatar.dto';

@Controller('avatars')
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  @Post()
  public async create(@Body() createAvatarDto: CreateAvatarDto) {
    const resp = await this.avatarsService.create(createAvatarDto);

    return resp;
  }

  @Get()
  findAll() {
    return this.avatarsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.avatarsService.findOne(+id);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string) {
    this.avatarsService.remove(+id);
  }
}
