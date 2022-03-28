import { TextChannel } from 'discord.js'
import { MContext } from '@types'
import { distube } from '@index'

export async function resume(context: MContext) {
    const channel = context.client.channels.cache.get(context.channelId!)! as TextChannel

    if (!channel.members.get(process.env.BOT_ID!)?.voice?.channelId)
        return context.channel.send('Зачем снимать паузу, если бот даже не состоит в голосовом канале?')

    await distube.resume(context)
}
