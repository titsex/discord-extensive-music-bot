import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ChannelEntity } from '@model/Channel.entity'
import { UserEntity } from '@model/User.entity'
import { Roles } from '@types'

@Entity()
export class MemberEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ enum: Roles })
    role!: Roles

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user!: UserEntity

    @Column('bigint')
    userId!: string

    @ManyToOne(() => ChannelEntity, c => c.members)
    @JoinColumn({ name: 'channelId' })
    channel!: ChannelEntity

    @Column('bigint')
    channelId!: string
}
