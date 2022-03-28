import { MContext } from '@types'
import { syncChannel } from '@getters'
import { buildEmbed } from '@utils'

export async function synchronize(context: MContext) {
    const send = await context.channel.send({
        embeds: [buildEmbed('Выполняется синхронизация', 'Пожалуйста, подождите - это может занять некоторое время')],
    })

    try {
        await syncChannel(context)
        await context.channel.send({ embeds: [buildEmbed('Синхронизация успешно выполнена', '')] })
    } catch (error) {
        await context.channel.send({ embeds: [buildEmbed('Не удалось выполнить синхронизацию', '')] })
    }

    return await context.channel.messages.delete(send)
}
