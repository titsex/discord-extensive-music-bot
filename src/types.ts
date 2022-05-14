import { ChannelEntity } from '@model/Channel.entity'
import { UserEntity } from '@model/User.entity'
import { GuildMember, Message } from 'discord.js'
import { MatchV5DTOs } from 'twisted/dist/models-dto'
import Position = MatchV5DTOs.Position

export interface MContext extends Message {
    chat?: ChannelEntity
    sender?: UserEntity & { role?: Roles }
}

export interface MGuild extends GuildMember {
    chat?: ChannelEntity
    sender?: UserEntity & { role?: Roles }
}

export enum COLORS {
    NONE = '\x1b[0',
    CYAN = '\x1b[36',
    PINK = '\x1b[35',
    RED = '\x1b[31',
    GREEN = '\x1b[32',
    YELLOW = '\x1b[33',
}

export enum COLOR_TYPES {
    NONE = 'm',
    BOLD = ';1m',
    ITALIC = ';3m',
}

export enum NODE_ENV {
    PRODUCTION = 'production',
    DEBUG = 'development',
}

export enum LogLevel {
    ALL,
    DEBUG,
    WARN,
    INFO,
    ERROR,
}

export enum Roles {
    'Пользователь' = 0,
    'Администратор' = 1,
    'Создатель' = 2,
    'Модератор бота' = 3,
    'Бот' = 4,
    'Разработчик' = 5,
}

export enum ACCOUNT_TYPES {
    'Обычный' = 0,
    'Золотой' = 1,
    'Платиновый' = 2,
    'Бот' = 3,
    'Разработчик' = 4,
}

export enum COMMAND_TYPE {
    MUSIC = 'MUSIC',
    MANAGEMENT = 'MANAGEMENT',
    EVERY = 'EVERY',
}

export interface IChampion {
    summoner: string
    name: string
    position: Position
    kills: number
    deaths: number
    assists: number
    gold: number
}

export interface ICommand {
    role: Roles
    aliases: string[]
    type: COMMAND_TYPE
    func: Function
}
