import { MContext } from '@types'
import { TextChannel } from 'discord.js'
import { distube } from '@index'
import { getArgs } from '@utils'

export async function jump(context: MContext) {
    const channel = context.client.channels.cache.get(context.channelId!)! as TextChannel

    if (!channel.members.get(process.env.BOT_ID!)?.voice?.channelId)
        return context.channel.send(
            'Для начала, включите трек и добавьте в очередь еще парочку, а уже потом прыгай, кролик недоделанный'
        )

    const args = getArgs(context)

    const position = args.join('').replace(/\s/gi, '').trim()
    if (!/^\d+$/i.test(position)) return context.channel.send('Аргумент должен быть числом.')

    const queue = distube.queues.get(context)

    try {
        await queue!.jump(Number(position) - 1)
    } catch (error) {
        return context.channel.send('Трека по такой позиции нет.')
    }
}
