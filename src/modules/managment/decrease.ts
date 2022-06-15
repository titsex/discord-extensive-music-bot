import { MContext, Roles } from '@types'
import { buildEmbed, getArgs, getIds } from '@utils'
import { userRepository } from '@database'
import { EmbedField } from 'discord.js'

export async function decrease(context: MContext) {
    let args = getArgs(context)

    if (!args.length)
        return context.channel.send({ embeds: [buildEmbed('Ты собираешься понижать самого себя?..', '')] })

    args = args[0].split(' ')
    const ids = getIds(args)

    if (!ids.length)
        return context.channel.send({
            embeds: [
                buildEmbed(
                    'Вы не указали аргумент',
                    'В качестве аргумента, мне нужно упоминание пользователей, которых требуется понизить'
                ),
            ],
        })

    const fields = [] as EmbedField[]

    for (const id of ids) {
        const member = context.chat?.members.find(x => x.userId === id)
        const user = await userRepository.findOneBy({ id: member!.userId })

        if (!member) {
            fields.push({
                name: `${user!.tag}`,
                value: 'не могу вспомнить',
                inline: true,
            })

            continue
        }

        if (context.sender!.role! <= member.role) {
            fields.push({
                name: `${user!.tag}`,
                value: 'не может быть понижен',
                inline: true,
            })

            continue
        }

        if (member.role === Roles.Пользователь) {
            fields.push({
                name: `${user!.tag}`,
                value: 'итак рядовой пользователь',
                inline: true,
            })

            continue
        }

        member.role = Roles.Пользователь

        fields.push({
            name: `${user!.tag}`,
            value: 'понижен',
            inline: true,
        })
    }

    return context.channel.send({ embeds: [buildEmbed('', '', fields)] })
}
