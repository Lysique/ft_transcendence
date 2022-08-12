import { Controller, Get, UseGuards, Req, Res, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { FortyTwoAuthGuard } from './guards/42-auth.guard';
import { Request, Response } from 'express';
import { UserDto } from 'src/models/users/dto/user.dto';
import { JwtTwoFactAuthGuard } from './guards/jwt-2fa.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // This function is used to login thanks to the guard.
    @UseGuards(FortyTwoAuthGuard)
    @Post('login')
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
      
      //  Create and store jwt token to enable connection
      const accessToken = await this.authService.generateToken({ sub: userDto.id });
      res.cookie('jwt', accessToken, { httpOnly: true });
    
      if (userDto.twoFactAuth == false) {
        return userDto;
      }
      return;
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
    @Post('logout')
    async logout(@Res({passthrough: true}) response: Response) {
      response.clearCookie('jwt');
      return 'success';
    }
    
    // Generate QrCode
    @UseGuards(JwtAuthGuard)
    @Get('2fa/generate')
    async generate(@Req() req: Request, @Res() res: Response) {
      
      //  Generate a new token // To change so it can verify if the setup is ok
      const user: UserDto = await this.authService.getUser(req.user);
      const accessToken = await this.authService.generateToken({
        sub: user.id,
        isTwoFactAuth: true
      });
      res.cookie('jwt', accessToken, { httpOnly: true });
      
      //  Generate the secret for the user and the qrCode
      const otpauthUrl = await this.authService.generateTwoFactAuthSecret(req.user);
      return this.authService.pipeQrCodeStream(res, otpauthUrl);
    }
    
    // Qr code auth
    @UseGuards(JwtTwoFactAuthGuard)
    @Post('2fa')
    async verifyTwoFactAuth(
      @Req() req: Request, 
      @Body() body, 
      @Res() res: Response
      ) {
      const isCodeValid = this.authService.verifyTwoFactAuth(body.twoFactAuth, req.user);

      if (!isCodeValid) {
        throw new UnauthorizedException('Wrong authentication code');
      }

      // Find user or signup if does not exist
      const userDto: UserDto = await this.authService.getUser(req.user);

      //  Create and store jwt token to enable connection
      const accessToken = await this.authService.generateToken({
        sub: userDto.id,
        isTwoFactAuth: true,
      });

      res.cookie('jwt', accessToken, { httpOnly: true });
      
      return userDto;
    }
  }