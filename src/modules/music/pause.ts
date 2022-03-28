import { TextChannel } from 'discord.js'
import { MContext } from '@types'
import { distube } from '@index'

export async function pause(context: MContext) {
    const channel = context.client.channels.cache.get(context.channelId!)! as TextChannel

    if (!channel.members.get(process.env.BOT_ID!)?.voice?.channelId)
        return context.channel.send('Если ты не вкурсе, то бот прямо сейчас не проигрывает музыку.')

    await distube.pause(context)
}
