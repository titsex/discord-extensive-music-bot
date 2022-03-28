import { MContext } from '@types'
import { buildEmbed, getArgs } from '@utils'
import { playlistRepository } from '@database'

export async function playlistDelete(context: MContext) {
    const args = getArgs(context)

    const find = await playlistRepository.findOne({ title: args.join(' '), ownerId: context.sender!.id })

    if (!find)
        return context.channel.send({
            embeds: [buildEmbed('Удаление плейлиста', 'Такой плейлист не найден. Проверьте указанное название')],
        })

    await playlistRepository.delete(find.id)

    return context.channel.send({
        embeds: [buildEmbed('Удаление плейлиста', 'Вы успешно удалили плейлист')],
    })
}
