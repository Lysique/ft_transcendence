import { Request, Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { FortyTwoAuthGuard } from './guards/42-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // This function is used to login thanks to the guard.
    @UseGuards(FortyTwoAuthGuard)
    @Get('login')
    async login(@Request() req) { }
    
    // Function called by 42 strategy
    @UseGuards(FortyTwoAuthGuard)
    @Get('42/callback')
    async loginCallback(@Request() req) {
      return this.authService.login(req.user);
    }

    // Check if user is logged in.
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async profile(@Request() req) { 
      return req.user;
    }
  }
