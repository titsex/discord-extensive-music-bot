import { MContext } from '@types'
import { buildEmbed, getArgs } from '@utils'

export async function prefix(context: MContext) {
    const args = getArgs(context)

    if (args.join('').length > 32)
        return context.channel.send({
            embeds: [
                buildEmbed(
                    'Ошибка при смене префикса',
                    'Зачем тебе такой большой префикс? Задолбаешься же писать команды..'
                ),
            ],
        })

    if (!args.length) context.chat!.prefix = ''
    else context.chat!.prefix = args.join('')

    return await context.channel.send({
        embeds: [
            buildEmbed(
                context.chat!.prefix ? 'Смена префикса' : 'Сброс префикса',
                context.chat!.prefix
                    ? `Вы успешно изменили префикс на ${context.chat!.prefix}`
                    : 'Вы успешно сбросили префикс и теперь команды будут реагировать на обычный текст'
            ),
        ],
    })
}
