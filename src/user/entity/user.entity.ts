import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name: `users`
})
export class User {

    @PrimaryColumn()
    id        : number

    @Column({
        length:63
    })
    name      : string

    @Column({
        unique: true
    })
    email     : string

    @Column()
    password  : string

    @Column()
    role      : number

    @CreateDateColumn()
    createdAt : string

    @UpdateDateColumn()
    updatedAt : string
}