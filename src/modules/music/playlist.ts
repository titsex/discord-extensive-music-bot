import { MContext } from '@types'
import { buildEmbed, getArgs } from '@utils'
import { playlistRepository } from '@database'

export async function playlist(context: MContext) {
    const args = getArgs(context)

    const find = await playlistRepository.findOne({ ownerId: context.sender!.id, title: args.join(' ') })

    if (!find)
        return context.channel.send({
            embeds: [buildEmbed('Список треков плейлиста', 'Такой плейлист не найден. Проверьте указанное название')],
        })

    const fields = []

    for (const song of find.songs) {
        fields.push({ name: 'ссылка', value: song, inline: true })
    }

    if (fields.length > 10) fields.length = 10

    return context.channel.send({
        embeds: [buildEmbed('Список треков плейлиста', 'Вот первые треки из вашего плейлиста', fields)],
    })
}
