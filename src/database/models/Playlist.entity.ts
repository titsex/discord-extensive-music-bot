import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity } from '@model/User.entity'
import { ChannelEntity } from '@model/Channel.entity'

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

    @ManyToOne(() => ChannelEntity)
    @JoinColumn({ name: 'channelId' })
    channel!: ChannelEntity

    @Column()
    channelId!: string

    @Column()
    public!: boolean

    @Column('simple-array')
    songs!: string[]
}
