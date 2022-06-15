import { MContext } from '@types'
import { TextChannel } from 'discord.js'
import { buildEmbed } from '@utils'

export async function bind(context: MContext) {
    const channel = context.client.channels.cache.get(context.channelId!)! as TextChannel

    const text = buildEmbed(
        context.chat!.replyChatId === channel.id
            ? 'Текущий текстовый канал итак предназначен для команд бота'
            : 'Текстовый канал успешно привязан и может использоваться только для взаимодействия с ботом',
        ''
    )

    context.chat!.replyChatId = channel.id
    context.chat!.replyChatTitle = channel.name

    return await context.channel.send({ embeds: [text] })
}
