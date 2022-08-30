import { AvatarDto } from "src/models/avatars/dto/avatar.dto";
import { UserStatus } from "../entities/user.entity";

export class FriendDto {
    id: number;
    name: string;
    status: UserStatus;
    currentAvatar?: AvatarDto;
  }