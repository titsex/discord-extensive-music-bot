import { TextChannel } from 'discord.js'
import { MContext } from '@types'

export async function logs(context: MContext) {
    const channel = context.client.channels.cache.get(context.channelId!)! as TextChannel

    if (!context.chat?.logs.length) return channel.send(`Список логов чист.`)

    let result = ''

    for (let i = 0; i < context.chat.logs.length; i++) {
        const log = context.chat.logs[i]

        result += `${i + 1}. ${log.user?.tag || 'Пользователь'} запросил трек '${log.title}' - <${log.uri}>\n\n`
    }

    const messages = result.match(/[^]{1,2000}/g)

    if (!messages) return channel.send(`Ты колдун? Как ты этой ошибки добился?`)

    for (const message of messages) {
        await channel.send(message)
    }
}
