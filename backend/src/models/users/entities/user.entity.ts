import { Avatar } from "src/models/avatars/entities/avatar.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";

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

    @Column({ unique: true })
    name: string;

    @Column({ default: UserStatus.Online })
    status: UserStatus;

    @OneToOne(() => Avatar, (avatar) => avatar.current, { nullable: true, eager: true })
    avatar: Avatar;
    
    @OneToMany(() => Avatar, (avatar) => avatar.user, { nullable: true, eager: true })
    avatars: Avatar[];

    @Column()
    twoFactAuth: boolean;

    @Column({ nullable: true })
    secret: string;
}