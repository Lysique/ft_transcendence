import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/models/users/dto/user.dto';
import { UsersService } from 'src/models/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/models/users/dto/create-user.dto';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async getUser(user: any): Promise<UserDto> {
        let userDto: UserDto = await this.usersService.findOneById(user.id);

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

        const userDto = await this.usersService.create(createUserDto);

        return userDto;
    }

    //  Generate jwt token
    async generateToken(payload: any, options: any = {}) {
        return this.jwtService.sign(payload, options);
    }

    //  Generate a secret and an url
    async generateTwoFactAuthSecret(user: any): Promise<any> {
        const secret = authenticator.generateSecret();
        
        const otpauthUrl = authenticator.keyuri(user.id.toString(), 'ft_transcendence', secret);
        
        await this.usersService.update(user.id, { twoFactAuth: true, secret: secret });
        return otpauthUrl;
    }

    //  Url to qr code
    async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
        return toFileStream(stream, otpauthUrl);
    }

    //  Verify qr code scan
    async verifyTwoFactAuth(code: string, user: any) {
        return authenticator.verify({ token: code, secret: user.secret })
    }
}