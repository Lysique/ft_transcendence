import { Avatar } from "src/models/avatars/entities/avatar.entity";
import { Column, Entity,  OneToMany, PrimaryColumn } from "typeorm";

export enum UserStatus {
    Online = 0,
    Offline = 1,
    InGame = 2,
}

//  User table
@Entity()
export class User {
    @PrimaryColumn()
    id: number;

    @Column({ unique: true, nullable: true })
    name: string;

    @Column({ default: UserStatus.Online })
    status: UserStatus;

    @Column("int", { array: true })
    friendsId: number[];
    
    @OneToMany(() => Avatar, (avatar) => avatar.user, { eager: true })
    avatars: Avatar[];

    @Column({ nullable: true })
    currentAvatarData: string;

    @Column({ nullable: true })
    currentAvatarId: number;

    @Column()
    twoFactAuth: boolean;

    @Column({ nullable: true })
    secret: string;
}