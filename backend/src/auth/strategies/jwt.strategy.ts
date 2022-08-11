import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants/constants';
import { UsersService } from 'src/models/users/users.service';
import { UserDto } from 'src/models/users/dto/user.dto';

// The jwt strategy checks if the token extracted from the request is a valid token.
// We create the token in AuthService -> login.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any): Promise<UserDto> {
    const user: UserDto = await this.userService.findOneById(payload.sub);
    
    return user;
  }
}