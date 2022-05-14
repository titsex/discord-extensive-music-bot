import { MContext } from '@types'
import { TextChannel } from 'discord.js'
import { buildEmbed, getArgs } from '@utils'
import { memberRepository } from '@database'

export async function nickname(context: MContext) {
    const channel = context.client.channels.cache.get(context.channelId!)! as TextChannel

    const args = getArgs(context)

    if (!args[0].length)
        return await channel.send({ embeds: [buildEmbed('Вы не указали аргумент', 'Укажите Ваш nickname')] })

    if (args.join(' ').length > 100)
        return await channel.send({
            embeds: [buildEmbed('Слишком длинный аргумент', 'Nickname не должен превышать 100 символов')],
        })

    const member = await memberRepository.findOne({ channelId: channel.guildId!, userId: context.sender!.id })

    member!.nickname = args.join(' ')
    await memberRepository.save(member!)

    return await context.channel.send({
        embeds: [buildEmbed('Вы успешно изменили свой nickname', `Теперь Ваш nickname - [${member!.nickname}]`)],
    })
}
