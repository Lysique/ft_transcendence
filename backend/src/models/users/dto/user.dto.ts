import { AvatarDto } from "src/models/avatars/dto/avatar.dto";
import { UserStatus } from "../entities/user.entity";
import { FriendDto } from "./friend.dto";

//  Dto class for User
export class UserDto {
    id: number;
    name: string;
    status: UserStatus;
    friends: FriendDto[];
    avatars: AvatarDto[];
    currentAvatar?: AvatarDto;
    twoFactAuth: boolean;
}