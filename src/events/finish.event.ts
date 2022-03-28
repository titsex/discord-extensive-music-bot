import { Queue } from 'distube'
import { buildEmbed } from '@utils'

export async function finish(queue: Queue) {
    return await queue.textChannel!.send({
        embeds: [buildEmbed('Треков в очереди больше нет', 'Спасибо за прослушивание, мне пора уходить..')],
    })
}
