import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity } from '@model/User.entity'

@Entity()
export class PlaylistEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'ownerId' })
    owner!: UserEntity

    @Column()
    ownerId!: string

    @Column('simple-array')
    songs!: string[]
}
