import { memberRepository, userRepository } from '@database'
import { MContext, Roles } from '@types'
import { buildEmbed } from '@utils'
import { EmbedField } from 'discord.js'

export async function staff(context: MContext) {
    const developer = [] as EmbedField[]
    const bot = []
    const botModeration = []
    const owner = []
    const admin = []

    const members = await memberRepository.find({ channelId: context.guild!.id })

    for (const member of members) {
        const { tag } = (await userRepository.findOne(member.userId))!

        if (member.role === Roles.Разработчик) developer.push({ name: tag, value: 'разработчик', inline: true })

        if (member.role === Roles.Бот) bot.push({ name: tag, value: 'бот', inline: true })

        if (member.role === Roles['Модератор бота'])
            botModeration.push({ name: tag, value: 'модератор бота', inline: true })

        if (member.role === Roles.Создатель) owner.push({ name: tag, value: 'создатель', inline: true })

        if (member.role === Roles.Администратор) admin.push({ name: tag, value: 'администратор', inline: true })
    }

    const fields = [] as EmbedField[]
    const empty = { name: '\u200b', value: '\u200b', inline: false } as EmbedField

    if (developer.length) fields.push(...developer)
    if (bot.length) fields.push(empty, ...bot)
    if (botModeration.length) fields.push(empty, ...botModeration)
    if (owner.length) fields.push(empty, ...owner)
    if (admin.length) fields.push(empty, ...admin)

    return context.channel.send({ embeds: [buildEmbed('Вот список всех управляющих каналом', '', fields)] })
}
