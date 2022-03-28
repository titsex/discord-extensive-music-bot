import { TextChannel } from 'discord.js'
import { MContext } from '@types'
import { distube } from '@index'

export async function shuffle(context: MContext) {
    const channel = context.client.channels.cache.get(context.channelId!)! as TextChannel

    if (!channel.members.get(process.env.BOT_ID!)?.voice?.channelId)
        return context.channel.send('Что Вы пытаетесь перемешать? Бот даже не состоит в голосовом канале...')

    const queue = distube.queues.get(context)

    if (queue!.songs.length <= 1)
        return context.channel.send('У Вас в очереди не более одного трека, какой смысл перемешивать?')

    await distube.shuffle(context)
}
