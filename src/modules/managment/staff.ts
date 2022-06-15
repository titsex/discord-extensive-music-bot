import { MContext, Roles } from '@types'
import { buildEmbed } from '@utils'
import { EmbedField } from 'discord.js'

export async function staff(context: MContext) {
    const developer = [] as EmbedField[]
    const bot = []
    const botModeration = []
    const owner = []
    const admin = []

    for (const member of context.chat!.members) {
        if (member.role === Roles.Разработчик)
            developer.push({ name: member.user?.tag, value: 'разработчик', inline: true })

        if (member.role === Roles.Бот) bot.push({ name: member.user?.tag, value: 'бот', inline: true })

        if (member.role === Roles['Модератор бота'])
            botModeration.push({ name: member.user?.tag, value: 'модератор бота', inline: true })

        if (member.role === Roles.Создатель) owner.push({ name: member.user?.tag, value: 'создатель', inline: true })

        if (member.role === Roles.Администратор)
            admin.push({ name: member.user?.tag, value: 'администратор', inline: true })
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
