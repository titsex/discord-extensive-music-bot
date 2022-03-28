import { TextChannel } from 'discord.js'
import { MContext } from '@types'
import { distube } from '@index'

export async function skip(context: MContext) {
    const channel = context.client.channels.cache.get(context.channelId!)! as TextChannel

    if (!channel.members.get(process.env.BOT_ID!)?.voice?.channelId)
        return context.channel.send(
            'Для начала, включите трек и добавьте в очередь еще парочку, а уже потом пропускайте.'
        )

    const queue = distube.queues.get(context)

    if (queue!.songs.length <= 1)
        return context.channel.send('Я бы мог пропустить, но дальше пропасть, треков в очереди нет, а падать не хочу.')

    await distube.skip(context)
}
