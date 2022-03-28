import { MContext } from '@types'
import { TextChannel } from 'discord.js'
import { distube } from '@index'
import { getArgs } from '@utils'
import { channelRepository } from '@database'

export async function volume(context: MContext) {
    const channel = context.client.channels.cache.get(context.channelId!)! as TextChannel

    if (!channel.members.get(process.env.BOT_ID!)?.voice?.channelId)
        return context.channel.send(
            'Прежде чем сделать меня тише или громче, ты сначала включи какой-нибудь трек и оцени текущий уровень.'
        )

    let args = getArgs(context)
    if (!args.length) return context.channel.send('Укажите аргументом процент, на который нужно сменить громкость')

    args = args[0].split(' ')

    if (/сбросить|reset/i.test(args[0])) {
        context.chat!.volume = 50
        await channelRepository.save(context.chat!)

        return context.channel.send('Вы успешно сбросили настройки громкости до стандартных 50%')
    }

    const volume = Number(args[0])
    if (isNaN(volume)) return context.channel.send('Данная команда аргументом принимает число.')

    if (volume > 100 || volume < 0)
        return context.channel.send('Громкость может быть от 0 до 100 процентов. Не более, не менее.')

    if (/всегда|always/i.test(args[1])) {
        context.chat!.volume = volume
        await channelRepository.save(context.chat!)

        return context.channel.send(`Вы успешно изменили стандартную громкость треков на ${volume}%`)
    }

    await distube.setVolume(context, volume)
    return context.channel.send(`Громкость трека установлена на ${volume}%`)
}
