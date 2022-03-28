import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { MemberEntity } from '@model/Member.entity'

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
}
