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

    async auth42(user: any) {
        var userDto: UserDto = await this.usersService.findOneById(user.id);

        //  If the user is not registered in our database, we create one.
        if (!userDto) {
            const createUserDto = new CreateUserDto;
            createUserDto.id = user.id;
            createUserDto.name = user.name;
            createUserDto.photoUrl = user.photoUrl;
            userDto = await this.usersService.create(createUserDto);
        }
        
        if (userDto.twoFactAuth == true) {
        }

        return this.login(user);
    }

    async login(user: any) {
        const payload = {
            sub: user.id 
        };

        const accessTokenCookie = this.jwtService.sign(payload);
 
        return accessTokenCookie;
    }
}