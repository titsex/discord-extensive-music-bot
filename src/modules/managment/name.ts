import { MContext } from '@types'
import { TextChannel } from 'discord.js'
import { buildEmbed, getArgs } from '@utils'
import { userRepository } from '@database'

export async function name(context: MContext) {
    const channel = context.client.channels.cache.get(context.channelId!)! as TextChannel

    const args = getArgs(context)

    if (!args[0].length)
        return await channel.send({ embeds: [buildEmbed('Вы не указали аргумент', 'Укажите Ваше имя')] })

    if (args.join(' ').length > 100)
        return await channel.send({
            embeds: [buildEmbed('Слишком длинный аргумент', 'Это что за имя такое, превышающее 100 символов?')],
        })

    context.sender!.name = args.join(' ')
    await userRepository.save(context.sender!)

    return await context.channel.send({
        embeds: [buildEmbed('Вы успешно изменили своё имя', `Теперь Вас зовут "${context.sender!.name}"`)],
    })
}
