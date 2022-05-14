import { TextChannel } from 'discord.js'
import { MContext } from '@types'
import { memberRepository, userRepository } from '@database'
import { buildEmbed } from '@utils'

export async function gamers(context: MContext) {
    const channel = context.client.channels.cache.get(context.channelId!)! as TextChannel

    const members = await memberRepository.find({ channelId: context.guildId! })

    let result = ''

    for (const member of members) {
        const user = await userRepository.findOne({ id: member.userId })

        if (!user?.name && !member.nickname) continue

        result += `\n<@${member.userId}>${user?.name ? ` (${user.name})` : ''}${
            member.nickname ? ` - ${member.nickname}` : ''
        }`
    }

    if (!result.length)
        return await channel.send({ embeds: [buildEmbed('Список пуст', 'Не нашлось ников и имён членов канала')] })

    const messages = result.match(/[^]{1,2000}/g)

    if (!messages) return channel.send(`Ты колдун? Как ты этой ошибки добился?`)

    for (const message of messages) {
        await channel.send(message)
    }
}
