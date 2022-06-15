import { TextChannel } from 'discord.js'
import { MContext } from '@types'
import { distube } from '@index'
import { buildEmbed, getArgs } from '@utils'

export async function play(context: MContext) {
    const args = getArgs(context)

    if (!args.length)
        return context.channel.send({
            embeds: [buildEmbed('Вы не указали аргумент', 'Мне нужно название трека или его источник')],
        })

    for (const arg of args) {
        await distube.play(context.member!.voice.channel!, arg, {
            message: context,
            textChannel: context.guild!.channels.cache.get(context.chat!.replyChatId) as TextChannel,
            member: context.member!,
        })
    }

    await distube.setVolume(context, context.chat!.volume)
}
