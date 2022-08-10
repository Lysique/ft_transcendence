import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserStatus {
    Online = 0,
    Offline = 1,
    InGame = 2,
}

//  User table
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    pseudo: string;

    @Column()
    status: UserStatus;
}