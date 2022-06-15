import { buildEmbed, getArgs, getIds } from '@utils'
import { MContext, Roles } from '@types'
import { userRepository } from '@database'
import { EmbedField } from 'discord.js'

export async function increase(context: MContext) {
    let args = getArgs(context)
    if (!args.length) context.channel.send({ embeds: [buildEmbed('Ты собираешься повышать самого себя?..', '')] })

    args = args[0].split(' ')
    const ids = getIds(args)

    if (!ids.length)
        return context.channel.send({
            embeds: [
                buildEmbed(
                    'Вы не указали аргумент',
                    'В качестве аргумента, мне нужно упоминание пользователей, которых требуется повысить'
                ),
            ],
        })

    const fields = [] as EmbedField[]

    for (const id of ids) {
        const member = context.chat?.members.find(x => x.user === id)
        const user = await userRepository.findOneBy({ id: member!.userId })

        if (!member) {
            fields.push({
                name: `${user!.tag}`,
                value: 'не могу вспомнить',
                inline: true,
            })

            continue
        }

        if (member.role >= Roles.Администратор) {
            fields.push({
                name: `${user!.tag}`,
                value: 'не нуждается в повышении',
                inline: true,
            })

            continue
        }

        member.role = Roles.Администратор

        fields.push({
            name: `${user!.tag}`,
            value: 'повышен',
            inline: true,
        })
    }

    return context.channel.send({ embeds: [buildEmbed('', '', fields)] })
}
