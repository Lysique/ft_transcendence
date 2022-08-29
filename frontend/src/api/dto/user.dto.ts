import { AvatarDto } from "./avatar.dto";
import { FriendDto } from "./friend.dto";

export enum UserStatus {
    Online = 0,
    Offline = 1,
    InGame = 2,
}

export interface UserDto {
    id: number;
    name: string;
    status: UserStatus;
    friends?: FriendDto[];
    blocked?: FriendDto[];
    currentAvatar?: AvatarDto;
    avatars?: AvatarDto[];
    twoFactAuth: boolean;
}