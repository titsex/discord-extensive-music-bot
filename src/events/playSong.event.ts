import { Queue, Song } from 'distube'
import { buildEmbed } from '@utils'
import { logRepository } from '@database'

export async function playSong(queue: Queue, song: Song) {
    const messages = (await queue.textChannel?.messages.fetch())!.map(item => item)

    const embed = buildEmbed(`Играет трек от ${song?.user?.tag || 'пользователя'}`, '', [
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
    ]).setThumbnail(song.thumbnail!)

    const match = messages.findIndex(item => !item.author.bot)
    const sorted = messages.slice(0, match)

    if (sorted && sorted.length) {
        return await queue.textChannel!.messages.edit(sorted[0], { embeds: [embed] })
    }

    const logs = await logRepository.find({ channelId: queue.id })

    if (logs.length === 30) await logRepository.delete(logs[0])

    const log = await logRepository.create()

    if (song.user) log.userId = song.user.id

    log.title = song.name!
    log.uri = song.url!
    log.channelId = queue.id

    await logRepository.save(log)
    return await queue.textChannel!.send({ embeds: [embed] })
}
