import { Connection, createConnection, Repository } from 'typeorm'
import { ChannelEntity } from '@model/Channel.entity'
import { MemberEntity } from '@model/Member.entity'
import { UserEntity } from '@model/User.entity'
import { Logger } from '@class/Logger'
import { PlaylistEntity } from '@model/Playlist.entity'

export let userRepository!: Repository<UserEntity>
export let memberRepository!: Repository<MemberEntity>
export let channelRepository!: Repository<ChannelEntity>
export let playlistRepository!: Repository<PlaylistEntity>

export class DB {
    constructor(url: string) {
        createConnection({
            type: 'postgres',
            url: url,
            entities: ['build/**/*.entity.js'],
            synchronize: true,
            logger: 'debug',
        }).then((connection: Connection) => {
            userRepository = connection.getRepository(UserEntity)
            memberRepository = connection.getRepository(MemberEntity)
            channelRepository = connection.getRepository(ChannelEntity)
            playlistRepository = connection.getRepository(PlaylistEntity)

            Logger.info('Успешное соеденение с базой данных')
        })
    }
}
