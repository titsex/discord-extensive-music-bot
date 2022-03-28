import { MContext } from '@types'
import { buildEmbed, getArgs } from '@utils'
import { playlistRepository } from '@database'

export async function playlistCreate(context: MContext) {
    const args = getArgs(context)

    const playlist = await playlistRepository.create()

    if (args[0].length > 16)
        return context.channel.send({
            embeds: [buildEmbed('Создание плейлиста', 'Название плейлиста не может превышать 16 символов')],
        })

    playlist.title = args[0]
    playlist.ownerId = context.sender!.id

    const songs: Set<string> = new Set()

    args.slice(1)
        .filter(x => /http|https/.test(x))
        .map(item => songs.add(item))

    playlist.songs = Array.from(songs)

    if (!playlist.songs.length)
        return context.channel.send({
            embeds: [
                buildEmbed(
                    'Создание плейлиста',
                    'Не удалось создать плейлист. Вы не указали список треков.\nВ качестве аргументов, мне нужны ссылки на треки (spotify, youtube, etc)'
                ),
            ],
        })

    if (await playlistRepository.findOne({ title: playlist.title, ownerId: context.sender!.id }))
        return context.channel.send({
            embeds: [buildEmbed('Создание плейлиста', 'Такое имя плейлиста уже существует')],
        })

    await playlistRepository.save(playlist)

    return context.channel.send({
        embeds: [
            buildEmbed('Создание плейлиста', 'Вы успешно создали плейлист', [
                {
                    name: 'Название',
                    value: playlist.title,
                    inline: true,
                },
                {
                    name: 'Количество треков',
                    value: `${playlist.songs.length}`,
                    inline: true,
                },
            ]),
        ],
    })
}
