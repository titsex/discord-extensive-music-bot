import { Repository } from 'typeorm'
import { ChannelEntity } from '@model/Channel.entity'
import { MemberEntity } from '@model/Member.entity'
import { UserEntity } from '@model/User.entity'
import { Logger } from '@class/Logger'
import { LogEntity } from '@model/Log.entity'
import datasource from './dbconfig'

export let logRepository!: Repository<LogEntity>
export let userRepository!: Repository<UserEntity>
export let memberRepository!: Repository<MemberEntity>
export let channelRepository!: Repository<ChannelEntity>

export class DB {
    constructor() {
        datasource
            .initialize()
            .then(connection => {
                logRepository = connection.getRepository(LogEntity)
                userRepository = connection.getRepository(UserEntity)
                memberRepository = connection.getRepository(MemberEntity)
                channelRepository = connection.getRepository(ChannelEntity)

                Logger.info('Успешное соеденение с базой данных')
            })
            .catch(Logger.error)
    }
}
