import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseInterceptors, UploadedFile, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { AvatarDto } from '../avatars/dto/avatar.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //  Create a new user
  @Post()
  public async create(@Body() createUserDto: CreateUserDto) {
    const resp = await this.usersService.create(createUserDto);

    return resp;
  }

  @Post('/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  public async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request
  ) {
    const user: any = req.user;
    const userDto = await this.usersService.findOneById(user.id);
    await this.usersService.addAvatar(userDto, file.buffer);

    const avatarDto: AvatarDto | null = await this.usersService.getCurrentAvatar(userDto);

    if (avatarDto == null) {
      return null;
    }

    return avatarDto.data;
  }

  @Get('/avatar')
  @UseGuards(JwtAuthGuard)
  public async getCurrentAvatar(@Req() req: Request) {
    const user: any = req.user;
    const userDto = await this.usersService.findOneById(user.id);
    
    const avatarDto: AvatarDto | null = await this.usersService.getCurrentAvatar(userDto);

    if (avatarDto == null) {
      return null;
    }

    return avatarDto.data;
  }

  @Get('/avatars')
  @UseGuards(JwtAuthGuard)
  public async getAllAvatars(@Req() req: Request) {
    const user: any = req.user;
    const userDto = await this.usersService.findOneById(user.id);
    
    const avatarDto: AvatarDto[] | null = await this.usersService.getAllAvatars(userDto);

    if (avatarDto == null) {
      return null;
    }

    return avatarDto.map(x => x.data);
  }

  @Get()
  public async findAll() {
    const resp = await this.usersService.findAll();
    
    return resp;
  }
  
  @Get('/:id')
  public async findOne(@Param('id') id: number) {
    const resp = await this.usersService.findOneById(id);
  
    return resp;
  }
  
  @Patch(':id')
  public async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const resp = await this.usersService.update(id, updateUserDto);
  
    return resp;
  }

  @Delete(':id')
  @HttpCode(204)
  public async remove(@Param('id') id: string) {
    this.usersService.remove(+id);
  }
}
