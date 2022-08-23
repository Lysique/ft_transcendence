import { Controller, Get, Post, Body, Param, Delete, HttpCode, UseInterceptors, UploadedFile, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { AvatarDto } from '../avatars/dto/avatar.dto';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Check if user is logged in and get user profile.
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async profile(@Req() req: Request) {
    const user: any = req.user;
    const userDto: UserDto = await this.usersService.findOneById(user.id);
    
    const {secret, ...rest} = userDto;

    return rest;
  }
  
  // Update name
  @Post('/updateName')
  @UseGuards(JwtAuthGuard)
  public async updateName(
    @Req() req: Request,
    @Body() body: any
    ) {
      const user: any = req.user;
      const userDto: UserDto | null = await this.usersService.updateName(user.id, body.name);

      const {secret, ...rest} = userDto;

      return rest;
  }

  @Post('/turnOffTfa')
  @UseGuards(JwtAuthGuard)
  public async turnOffTfa(
    @Req() req: Request,
  ) {
    const user: any = req.user;
    await this.usersService.turnOffTfa(user.id);

    const userDto: UserDto = await this.usersService.findOneById(user.id);
    const {secret, ...rest} = userDto;

    return rest;
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

    const {secret, ...rest} = userDto;

    return rest;
  }

  // Set the current user's avatar
  @Post('/avatar/:id')
  @UseGuards(JwtAuthGuard)
  public async updateCurrentAvatar(
    @Req() req: Request,
    @Param('id') avatarId: number
    ) {
    const user: any = req.user;
    const userDto = await this.usersService.findOneById(user.id);
    
    await this.usersService.updateCurrentAvatar(userDto, avatarId);

    const {secret, ...rest} = userDto;

    return rest;
  }

  // Get all user's avatars
  @Get('/avatars')
  @UseGuards(JwtAuthGuard)
  public async getAllAvatars(@Req() req: Request) {
    const user: any = req.user;
    const userDto = await this.usersService.findOneById(user.id);
    
    const avatarDtos: AvatarDto[] | null = await this.usersService.getAllAvatars(userDto);

    return avatarDtos;
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
}
