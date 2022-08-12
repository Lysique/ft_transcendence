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

    async getUser(user: any): Promise<UserDto> {
        var userDto: UserDto = await this.usersService.findOneById(user.id);

        //  If the user is not registered in our database, we create one.
        if (!userDto) {
            userDto = await this.signup(user);
        }
        
        return userDto;
    }

    //  Create a new user in database.
    async signup(user: any): Promise<UserDto> {
        const createUserDto = new CreateUserDto;

        createUserDto.id = user.id;
        createUserDto.name = user.name;
        createUserDto.photoUrl = user.photoUrl;

        const userDto = await this.usersService.create(createUserDto);

        return userDto;
    }

    async generateToken(payload: any, options: any = {}) {
        return this.jwtService.sign(payload, options);
    }
}