import { MContext, Roles } from '@types'
import { buildEmbed } from '@utils'

export async function role(context: MContext) {
    return context.channel.send({ embeds: [buildEmbed('Ваша роль в этом канале', `${Roles[context.sender!.role!]}`)] })
}
