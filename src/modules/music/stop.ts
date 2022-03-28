import { TextChannel } from 'discord.js'
import { MContext } from '@types'
import { distube } from '@index'
import { buildEmbed } from '@utils'

export async function stop(context: MContext) {
    const channel = context.client.channels.cache.get(context.channelId!)! as TextChannel

    if (!channel.members.get(process.env.BOT_ID!)?.voice?.channelId)
        return context.channel.send('Да хватит пустоту выгонять, меня итак там нет...')

    await distube.stop(context)

    return await channel.send({
        embeds: [buildEmbed('Треков в очереди больше нет', 'Спасибо за прослушивание, мне пора уходить..')],
    })
}
