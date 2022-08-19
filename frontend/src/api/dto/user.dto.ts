export enum UserStatus {
    Online = 0,
    Offline = 1,
    InGame = 2,
}

export interface UserDto {
    id: number;
    name: string;
    status: UserStatus;
    secret: string;
    twoFactAuth: boolean;
}