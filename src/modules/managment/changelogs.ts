import { MContext } from '@types'
import { buildEmbed } from '@utils'

export async function changelogs(context: MContext) {
    return context.channel.send({
        embeds: [
            buildEmbed('История изменений', 'Ниже указаны источники, где можно посмотреть историю обновлений', [
                {
                    name: 'VK Group',
                    value: 'https://vk.com/ditoxmusic',
                    inline: true,
                },
                {
                    name: 'TG Channel',
                    value: 'https://t.me/ditoxmusic',
                    inline: true,
                },
            ]),
        ],
    })
}
