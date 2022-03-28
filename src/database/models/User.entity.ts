import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { ACCOUNT_TYPES } from '@types'
import { PlaylistEntity } from '@model/Playlist.entity'

@Entity()
export class UserEntity {
    @PrimaryColumn()
    id!: string

    @Column()
    tag!: string

    @OneToMany(() => PlaylistEntity, p => p.owner)
    playlists!: PlaylistEntity[]

    @Column({ enum: ACCOUNT_TYPES })
    accountType!: ACCOUNT_TYPES
}
