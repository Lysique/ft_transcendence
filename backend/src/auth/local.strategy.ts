import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/models/users/dto/user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({nameField:'string'});
  }

  async validate(username: string, password: string): Promise<any> {
    const user: UserDto = await this.authService.validateUser();
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}