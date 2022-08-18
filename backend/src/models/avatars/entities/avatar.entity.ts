import { User } from "src/models/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Avatar {
    @PrimaryGeneratedColumn()
    id: number;
        
    @ManyToOne(() => User, (user) => user.avatars, {cascade: true, onDelete: "CASCADE"})
    @JoinColumn()
    user: User;

    @OneToOne(() => User, (user) => user.avatar, {
        cascade: true, 
        onDelete: "CASCADE", 
        nullable: true,
    })
    @JoinColumn()
    current: User;

    @Column()
    data: String;
}