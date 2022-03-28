import { Playlist, Queue } from 'distube'
import { buildEmbed } from '@utils'

export async function addList(queue: Queue, playlist: Playlist) {
    const embed = buildEmbed(`${playlist?.user?.tag || 'Пользователь'} добавил в очередь целый плейлист`, '', [
        {
            name: 'Название плейлиста',
            value: playlist.name,
            inline: true,
        },
        {
            name: 'Всего треков в плейлисте',
            value: playlist.source === 'youtube' && playlist.url ? `${playlist.songs.length}` : '∞ (лень считать)',
            inline: true,
        },
    ])

    return queue.textChannel!.send({ embeds: [embed] })
}
