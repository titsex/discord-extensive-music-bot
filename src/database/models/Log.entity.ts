import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ChannelEntity } from '@model/Channel.entity'
import { UserEntity } from '@model/User.entity'

@Entity()
export class LogEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => ChannelEntity, c => c.members)
    @JoinColumn({ name: 'channelId' })
    channel!: ChannelEntity

    @Column('bigint', { nullable: true })
    channelId!: string

    @Column()
    title!: string

    @Column()
    uri!: string

    @ManyToOne(() => UserEntity, { nullable: true, eager: true })
    @JoinColumn({ name: 'userId' })
    user?: UserEntity

    @Column('bigint', { nullable: true })
    userId?: string
}
