import { UserStatus } from "../entities/user.entity";

//  Dto class for User
export class UserDto {
    id: number;
    name: string;
    status: UserStatus;
    secret: string;
    twoFactAuth: boolean;
}