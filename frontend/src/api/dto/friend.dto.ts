import { AvatarDto } from "./avatar.dto";

export enum UserStatus {
    Online = 0,
    Offline = 1,
    InGame = 2,
}

export interface FriendDto {
    id: number;
    name: string;
    status: UserStatus;
    currentAvatar?: AvatarDto;
}