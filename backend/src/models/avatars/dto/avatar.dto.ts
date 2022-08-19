import { User } from "src/models/users/entities/user.entity";

export class AvatarDto {
    id: number;
    user: User;
    data: string;
}