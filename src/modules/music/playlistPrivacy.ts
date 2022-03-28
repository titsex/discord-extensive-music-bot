import { MContext } from '@types'
import { buildEmbed, getArgs } from '@utils'
import { playlistRepository } from '@database'

export async function playlistPrivacy(context: MContext) {
    const args = getArgs(context)

    const find = await playlistRepository.findOne({ ownerId: context.sender!.id, title: args.join(' ') })

    if (!find)
        return context.channel.send({
            embeds: [
                buildEmbed('Конфиденциальность плейлиста', 'Такой плейлист не найден. Проверьте указанное название'),
            ],
        })

    find.public = !find.public
    await playlistRepository.save(find)

    return context.channel.send({
        embeds: [
            buildEmbed(
                'Конфиденциальность плейлиста',
                `Теперь ваш плейлист ${find.public ? 'публичный' : 'приватный'}`
            ),
        ],
    })
}
