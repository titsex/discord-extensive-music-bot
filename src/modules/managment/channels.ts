import { channelRepository } from '@database'
import { EmbedField } from 'discord.js'
import { buildEmbed } from '@utils'
import { MContext } from '@types'

export async function channels(context: MContext) {
    const list = await channelRepository.find()

    const text = buildEmbed(
        'Список всех каналов в базе данных',
        '',
        list.map(
            channel =>
                ({
                    name: channel.title,
                    value: channel.activate ? 'активирован' : 'не активирован',
                    inline: true,
                } as EmbedField)
        )
    )

    return context.channel.send({ embeds: [text] })
}
