import { Column, Entity, PrimaryColumn } from 'typeorm'
import { ACCOUNT_TYPES } from '@types'

@Entity()
export class UserEntity {
    @PrimaryColumn('bigint')
    id!: string

    @Column()
    tag!: string

    @Column({ enum: ACCOUNT_TYPES })
    accountType!: ACCOUNT_TYPES
}
