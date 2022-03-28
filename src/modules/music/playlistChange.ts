import { MContext } from '@types'
import { buildEmbed, getArgs } from '@utils'
import { playlistRepository } from '@database'

export async function playlistChange(context: MContext) {
    const args = getArgs(context)

    const find = await playlistRepository.findOne({ title: args[0], ownerId: context.sender!.id })

    if (!find)
        return context.channel.send({
            embeds: [buildEmbed('Изменение плейлиста', 'Такой плейлист не найден. Проверьте указанное название')],
        })

    const songs = args.slice(1).filter(x => /http|https/.test(x))

    if (!songs.length)
        return context.channel.send({
            embeds: [
                buildEmbed(
                    'Изменение плейлиста',
                    'Не удалось изменить плейлист. Вы не указали список треков.\nВ качестве аргументов, мне нужны ссылки на треки (spotify, youtube, etc)'
                ),
            ],
        })

    const changes = []

    for (const song of songs) {
        if (find.songs.includes(song)) {
            find.songs = find.songs.filter(x => x !== song)
            changes.push({ name: 'Удаление трека', value: song, inline: true })
        } else {
            find.songs.push(song)
            changes.push({ name: 'Добавление трека', value: song, inline: true })
        }
    }

    await playlistRepository.save(find)
    return context.channel.send({ embeds: [buildEmbed('Изменение плейлиста', '', changes)] })
}
