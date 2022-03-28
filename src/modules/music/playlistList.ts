import { MContext } from '@types'
import { playlistRepository } from '@database'
import { buildEmbed } from '@utils'

export async function playlistList(context: MContext) {
    const find = await playlistRepository.find({ ownerId: context.sender!.id })

    if (!find.length)
        return context.channel.send({
            embeds: [
                buildEmbed(
                    'Список плейлистов',
                    'У вас нет плейлистов. Чтобы создать плейлист, используйте команду [playlist create | плейлист создать]'
                ),
            ],
        })

    const list = []

    for (const playlist of find) {
        list.push({ name: 'Название', value: playlist.title, inline: true })
        list.push({ name: 'Количество треков', value: `${playlist.songs.length}`, inline: true })
        list.push({ name: '\u200b', value: '\u200b', inline: false })
    }

    list.pop()

    return context.channel.send({ embeds: [buildEmbed('Список плейлистов', '', list)] })
}
