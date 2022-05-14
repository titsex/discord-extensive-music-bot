import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { MemberEntity } from '@model/Member.entity'
import { LogEntity } from '@model/Log.entity'

@Entity()
export class ChannelEntity {
    @PrimaryColumn()
    id!: string

    @Column()
    prefix!: string

    @Column()
    title!: string

    @Column()
    volume!: number

    @Column()
    activate!: boolean

    @Column()
    replyChatId!: string

    @Column()
    replyChatTitle!: string

    @OneToMany(() => MemberEntity, m => m.user, { eager: true })
    members!: MemberEntity[]

    @OneToMany(() => LogEntity, l => l.channel, { eager: true })
    logs!: LogEntity[]
}
