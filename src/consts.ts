import {
    play,
    resume,
    pause,
    shuffle,
    skip,
    stop,
    volume,
    bind,
    role,
    staff,
    increase,
    decrease,
    synchronize,
    repeat,
    activate,
    deactivate,
    channels,
    prefix,
    changelogs,
    logs,
    jump,
} from '@module/index'
import { COMMAND_TYPE, ICommand, Roles } from '@types'
import { MessageEmbed } from 'discord.js'

export const errorEmbed = new MessageEmbed()
    .setTitle('Произошла ошибка')
    .setDescription('Не удалось воспроизвести песню')

export const commands: ICommand[] = [
    {
        aliases: ['play', 'играть'],
        role: Roles.Пользователь,
        type: COMMAND_TYPE.MUSIC,
        func: play,
    },
    {
        aliases: ['pause', 'пауза'],
        role: Roles.Пользователь,
        type: COMMAND_TYPE.MUSIC,
        func: pause,
    },
    {
        aliases: ['resume', 'продолжить', 'возобновить'],
        role: Roles.Пользователь,
        type: COMMAND_TYPE.MUSIC,
        func: resume,
    },
    {
        aliases: ['shuffle', 'перемешать'],
        role: Roles.Пользователь,
        type: COMMAND_TYPE.MUSIC,
        func: shuffle,
    },
    {
        aliases: ['skip', 'пропустить'],
        role: Roles.Пользователь,
        type: COMMAND_TYPE.MUSIC,
        func: skip,
    },
    {
        aliases: ['stop', 'остановить', 'стоп'],
        role: Roles.Пользователь,
        type: COMMAND_TYPE.MUSIC,
        func: stop,
    },
    {
        aliases: ['volume', 'громкость'],
        role: Roles.Пользователь,
        type: COMMAND_TYPE.MUSIC,
        func: volume,
    },
    {
        aliases: ['bind', 'привязать'],
        role: Roles.Администратор,
        type: COMMAND_TYPE.EVERY,
        func: bind,
    },
    {
        aliases: ['role', 'роль'],
        role: Roles.Пользователь,
        type: COMMAND_TYPE.MANAGEMENT,
        func: role,
    },
    {
        aliases: ['staff', 'админы'],
        role: Roles.Пользователь,
        type: COMMAND_TYPE.MANAGEMENT,
        func: staff,
    },
    {
        aliases: ['increase', 'повысить'],
        role: Roles.Создатель,
        type: COMMAND_TYPE.MANAGEMENT,
        func: increase,
    },
    {
        aliases: ['decrease', 'понизить'],
        role: Roles.Создатель,
        type: COMMAND_TYPE.MANAGEMENT,
        func: decrease,
    },
    {
        aliases: ['synchronize', 'синхронизация'],
        role: Roles.Администратор,
        type: COMMAND_TYPE.MANAGEMENT,
        func: synchronize,
    },
    {
        aliases: ['repeat', 'повтор'],
        role: Roles.Пользователь,
        type: COMMAND_TYPE.MUSIC,
        func: repeat,
    },
    {
        aliases: ['activate', 'активация'],
        role: Roles.Разработчик,
        type: COMMAND_TYPE.EVERY,
        func: activate,
    },
    {
        aliases: ['deactivate', 'деактивация'],
        role: Roles.Разработчик,
        type: COMMAND_TYPE.EVERY,
        func: deactivate,
    },
    {
        aliases: ['channels', 'каналы'],
        role: Roles.Разработчик,
        type: COMMAND_TYPE.MANAGEMENT,
        func: channels,
    },
    {
        aliases: ['prefix', 'префикс'],
        role: Roles.Администратор,
        type: COMMAND_TYPE.MANAGEMENT,
        func: prefix,
    },
    {
        aliases: ['changelogs', 'списки изменений'],
        role: Roles.Пользователь,
        type: COMMAND_TYPE.MANAGEMENT,
        func: changelogs,
    },
    {
        aliases: ['logs', 'логи'],
        role: Roles.Пользователь,
        type: COMMAND_TYPE.MUSIC,
        func: logs,
    },
    {
        aliases: ['jump', 'прыгнуть'],
        role: Roles.Пользователь,
        type: COMMAND_TYPE.MUSIC,
        func: jump,
    },
]
