import { MContext } from '@types'
import { getArgs } from '@utils'
import { TextChannel } from 'discord.js'
import { distube } from '@index'

export async function repeat(context: MContext) {
    const channel = context.client.channels.cache.get(context.channelId!)! as TextChannel

    if (!channel.members.get(process.env.BOT_ID!)?.voice?.channelId)
        return context.channel.send(
            'Видимо трек играет у тебя в голове, раз ты решил поиграться с функцией повтора.\nP.S: Включи сначала музыку, а потом уже играйся с настройками.'
        )

    const args = getArgs(context)
    if (!args.length) return context.channel.send('Вы не указали аргумент.')

    const playlist = /playlist|плейлист/i.test(args[0])
    const song = /song|трек/i.test(args[0])
    const off = /выключить|off|выкл/i.test(args[0])

    if (!playlist && !song && !off)
        return context.channel.send(
            'Команда аргументом принимает "плейлист", "трек" или "выключить (выкл)".\nP.S: Не ссылку на трек или плейлист, а конкретно одно из этих трёх слов.'
        )

    distube.setRepeatMode(context, playlist ? 2 : off ? 0 : 1)
    return context.channel.send(`Режим повтора ${playlist ? 'плейлиста' : off ? 'отключен' : 'трека'}.`)
}
