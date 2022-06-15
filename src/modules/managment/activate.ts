import { MContext } from '@types'
import { buildEmbed } from '@utils'

export async function activate(context: MContext) {
    const text = buildEmbed(context.chat!.activate ? 'Канал уже активирован' : 'Вы успешно активировали канал', '')

    context.chat!.activate = true

    return context.channel.send({ embeds: [text] })
}
