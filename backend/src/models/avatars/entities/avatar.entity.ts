import { User } from "src/models/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Avatar {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user) => user.avatar)
    user: User;

    @Column()
    photoUrl: string;
}