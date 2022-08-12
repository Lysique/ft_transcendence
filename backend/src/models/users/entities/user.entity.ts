import { Column, Entity, PrimaryColumn } from "typeorm";

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

    @Column()
    name: string;

    @Column({ default: UserStatus.Online })
    status: UserStatus;

    @Column()
    photoUrl: string;

    @Column({ default: false })
    twoFactAuth: boolean;

    @Column({ nullable: true })
    secret: string;
}