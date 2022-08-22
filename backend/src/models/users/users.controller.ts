import { Controller, Get, Post, Body, Param, Delete, HttpCode, UseInterceptors, UploadedFile, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { AvatarDto } from '../avatars/dto/avatar.dto';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //  Create a new user
  @Post()
  public async create(@Body() createUserDto: CreateUserDto) {
    const resp = await this.usersService.create(createUserDto);

    return resp;
  }

  // Check if user is logged in and get user profile.
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: Request) {
    const user: any = req.user;
    const userDto: UserDto = await this.usersService.findOneById(user.id);
    
    return userDto;
  }

  // Create a new avatar for the user
  @Post('/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  public async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request
  ) {
    const user: any = req.user;
    const userDto: UserDto = await this.usersService.findOneById(user.id);
    await this.usersService.addAvatar(userDto, file.buffer);

    const avatarDto: AvatarDto | null = await this.usersService.getCurrentAvatar(userDto);

    return avatarDto;
  }

  // Get the current user's avatar
  @Get('/avatar')
  @UseGuards(JwtAuthGuard)
  public async getCurrentAvatar(@Req() req: Request) {
    const user: any = req.user;
    const userDto = await this.usersService.findOneById(user.id);
    
    const avatarDto: AvatarDto | null = await this.usersService.getCurrentAvatar(userDto);

    return avatarDto;
  }

  // Set the current user's avatar
  @Post('/avatar/:id')
  @UseGuards(JwtAuthGuard)
  public async updateCurrentAvatar(
    @Req() req: Request,
    @Param('id') id: number
    ) {
    const user: any = req.user;
    const userDto = await this.usersService.findOneById(user.id);
    
    const avatarDto: AvatarDto = await this.usersService.updateCurrentAvatar(userDto, id);

    return avatarDto;
  }

  // Get all user's avatars
  @Get('/avatars')
  @UseGuards(JwtAuthGuard)
  public async getAllAvatars(@Req() req: Request) {
    const user: any = req.user;
    const userDto = await this.usersService.findOneById(user.id);
    
    const avatarDto: AvatarDto[] | null = await this.usersService.getAllAvatars(userDto);

    return avatarDto;
  }

  // Remove one avatar. Not in avatar controller to prevent circular depedency.
  @Delete('/avatar/:id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  public async removeAvatar(
    @Param('id') avatarId: number,
    @Req() req: Request
    ) {
    const user: any = req.user;
    await this.usersService.removeAvatar(avatarId, user.id);
  }

  @Delete(':id')
  @HttpCode(204)
  public async removeUser(@Param('id') id: string) {
    this.usersService.removeUser(+id);
  }
}
