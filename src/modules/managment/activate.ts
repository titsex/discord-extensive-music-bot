import { MContext } from '@types'
import { buildEmbed } from '@utils'
import { channelRepository } from '@database'

export async function activate(context: MContext) {
    const text = buildEmbed(context.chat!.activate ? 'Канал уже активирован' : 'Вы успешно активировали канал', '')

    context.chat!.activate = true
    await channelRepository.save(context.chat!)

    return context.channel.send({ embeds: [text] })
}
