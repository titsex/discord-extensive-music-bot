import { Queue, Song } from 'distube'
import { buildEmbed } from '@utils'

export async function addSong(queue: Queue, song: Song) {
    const messages = (await queue.textChannel?.messages.fetch())!.map(item => item)

    const embed = buildEmbed(
        `${song?.user?.tag || 'Пользователь'} запросил трек`,
        'Песня добавлена в очередь и будет проиграна в скором времени',
        [
            {
                name: 'Название',
                value: song.name!,
                inline: false,
            },
            {
                name: 'Продолжительность',
                value: song.formattedDuration!,
                inline: true,
            },
            {
                name: 'Позиция в очереди',
                value: `${queue.songs.length}`,
                inline: true,
            },
        ]
    ).setThumbnail(song.thumbnail!)

    const match = messages.findIndex(item => !item.author.bot)
    const sorted = messages.slice(0, match)

    const find = sorted.find(m => m.embeds.find(item => /запросил/i.test(item.title!)))

    if (sorted.length && find) {
        return await queue.textChannel!.messages.edit(find, { embeds: [embed] })
    }

    return queue.textChannel!.send({ embeds: [embed] })
}
