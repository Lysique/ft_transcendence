import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/models/users/dto/user.dto';
import { UsersService } from 'src/models/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/models/users/dto/create-user.dto';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { Socket } from 'socket.io';
import { parse } from "cookie";
import { jwtConstants } from './constants/constants';
import { User } from 'src/models/users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async fetchUser(user: any): Promise<UserDto> {
        const userDto: UserDto | null = await this.usersService.findOneById(user.id);
        
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

    //  Generate jwt token
    async generateToken(payload: any, options: any = {}) {
        return this.jwtService.sign(payload, options);
    }

    //  Generate a secret and an url
    async generateTwoFactAuthSecret(user: any): Promise<any> {
        const secret = authenticator.generateSecret();
        await this.usersService.updateSecret(user.id, secret);
        
        const otpauthUrl = authenticator.keyuri(user.id.toString(), 'ft_transcendence', secret);

        return otpauthUrl;
    }

    //  Url to qr code
    async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
        return toFileStream(stream, otpauthUrl);
    }

    //  Verify qr code scan
    async verifyTwoFactAuth(code: string, user: any) {
        const secret = await this.usersService.getSecret(user.id);
        return authenticator.verify({ token: code, secret: secret })
    }

    async turnOnTfa(user: any) {
        await this.usersService.turnOnTfa(user.id);
    }

    public async getUserFromSocket(socket: Socket): Promise<UserDto | null> {
        const cookies = socket.handshake.headers.cookie;

        const token = parse(cookies)['jwt'];

        try {
            const sub = this.jwtService.verify(token);
            if (!sub) {
                return null;
            }
    
            const userDto: UserDto | null = await this.usersService.findOneById(sub.sub);
    
            return userDto;
        }
        catch {
            return null;
        }

    }
}