import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/models/users/dto/user.dto';
import { UsersService } from 'src/models/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/models/users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async login(user: any) {
        const payload = { 
            name: user.username, 
            sub: user.id 
        };

        const userDto: UserDto = await this.usersService.findOneById(user.id);
        if (!userDto) {
            const createUserDto = new CreateUserDto;
            createUserDto.id = user.id;
            createUserDto.name = user.name;
            createUserDto.photoUrl = user.photoUrl;
            this.usersService.create(createUserDto);
        }
        
        return {
          access_token: this.jwtService.sign(payload),
        };
    }
}
