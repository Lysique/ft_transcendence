import { Controller, Get, UseGuards, Req, Res, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { FortyTwoAuthGuard } from './guards/42-auth.guard';
import { Request, Response } from 'express';
import { UserDto } from 'src/models/users/dto/user.dto';
import { PhoneAuthGuard } from './guards/mail-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // This function is used to login thanks to the guard.
    @UseGuards(FortyTwoAuthGuard)
    @Get('login')
    async login(@Req() req: Request) {}
    
    // Function called by 42 strategy
    @UseGuards(FortyTwoAuthGuard)
    @Get('42/callback')
    async fortyTwoAuthCallback(
      @Req() req: Request,
      @Res({passthrough: true}) res: Response
      ) {
      
      // Find user or signup if does not exist
      const userDto: UserDto = await this.authService.getUser(req.user);
      
      //  Create and store jwt token to enable connection if 2fa is false
      if (userDto.twoFactAuth == true) {
        const accessToken = await this.authService.generateToken({ sub: userDto.id });
        res.cookie('jwt', accessToken, { httpOnly: true });
      
        return userDto;
      }

      //  Else redirect to other authentification
      else {
        const jwtToken = this.authService.generateToken({ id: userDto.id }, { expiresIn: '2m' });
        //  Send mail;
        return jwtToken;
      }
    }

    @UseGuards(PhoneAuthGuard)
    @Get('login/tfa')
    async TwoFactAuthLoginCallback(
      @Req() req: Request,
      @Res({passthrough: true}) res: Response
      ) {
      // Find user
      const userDto: UserDto = await this.authService.getUser(req.user);

      //  Create and store jwt token to enable connection
      const accessToken = await this.authService.generateToken({ sub: userDto.id });
      res.cookie('jwt', accessToken, { httpOnly: true });

      return userDto;
    }

    // Check if user is logged in and get user profile.
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async profile(@Req() req: Request) {
      const userDto: UserDto = await this.authService.getUser(req.user);

      return userDto;
    }
    
    // User logout
    @UseGuards(JwtAuthGuard)
    @Get('logout')
    async logout(@Res({passthrough: true}) response: Response) {
      response.clearCookie('jwt');
      return 'success';
    }
  }