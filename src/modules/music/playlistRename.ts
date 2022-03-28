import { MContext } from '@types'
import { buildEmbed, getArgs } from '@utils'
import { playlistRepository } from '@database'

export async function playlistRename(context: MContext) {
    const args = getArgs(context)

    const find = await playlistRepository.findOne({ ownerId: context.sender!.id, title: args[0] })
    const title = args.slice(1).join(' ')

    if (!find)
        return context.channel.send({
            embeds: [
                buildEmbed('Переименовывание плейлиста', 'Такой плейлист не найден. Проверьте указанное название'),
            ],
        })

    if (!title.length)
        return context.channel.send({
            embeds: [buildEmbed('Переименовывание плейлиста', 'Вы не указали новое название плейлиста')],
        })

    if (title.length > 16)
        return context.channel.send({
            embeds: [buildEmbed('Переименовывание плейлиста', 'Название плейлиста не может превышать 16 символов')],
        })

    if (args[0] === title)
        return context.channel.send({
            embeds: [
                buildEmbed('Переименовывание плейлиста', 'Вы указали текущее название плейлиста, в качестве нового'),
            ],
        })

    find.title = title
    await playlistRepository.save(find)

    return context.channel.send({
        embeds: [
            buildEmbed('Переименовывание плейлиста', 'Вы успешно изменили название плейлиста', [
                {
                    name: 'Старое название',
                    value: args[0],
                    inline: true,
                },
                {
                    name: 'Новое название',
                    value: find.title,
                    inline: true,
                },
            ]),
        ],
    })
}
