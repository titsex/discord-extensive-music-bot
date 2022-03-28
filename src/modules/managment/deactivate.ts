import { MContext } from '@types'
import { buildEmbed, getArgs } from '@utils'
import { channelRepository } from '@database'

export async function deactivate(context: MContext) {
    const args = getArgs(context)

    if (!args.length)
        return context.channel.send({
            embeds: [
                buildEmbed(
                    'Вы не указали аргумент',
                    'Мне аргументом нужен канал, который нужно деактивировать. Чтобы узнать список каналов, используйте "/каналы"'
                ),
            ],
        })

    const find = await channelRepository.findOne({ title: args.join(' ') })
    if (!find) return context.channel.send({ embeds: [buildEmbed('Канал не был найден', '')] })

    find.activate = false
    await channelRepository.save(find)

    return context.channel.send({ embeds: [buildEmbed('Канал успешно деактивирован', '')] })
}
