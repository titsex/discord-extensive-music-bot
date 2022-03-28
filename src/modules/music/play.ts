import { TextChannel } from 'discord.js'
import { MContext } from '@types'
import { distube } from '@index'
import { buildEmbed, getArgs } from '@utils'
import { playlistRepository } from '@database'

export async function play(context: MContext) {
    const args = getArgs(context)

    if (!args.length)
        return context.channel.send({
            embeds: [buildEmbed('Вы не указали аргумент', 'Мне нужно название трека или его источник')],
        })

    const find = await playlistRepository.findOne({ title: args.join(' ') })

    if (find) {
        if (find.channelId !== context.guild!.id && !find.public)
            return context.channel.send({
                embeds: [
                    buildEmbed(
                        'Приватный плейлист',
                        'Автор плейлиста запретил проигрывать треки из него, вне канала, в котором он был создан'
                    ),
                ],
            })

        const playlist = await distube.createCustomPlaylist(find.songs, {
            member: context.member!,
            parallel: true,
            properties: { name: find.title },
        })

        await distube.play(context.member!.voice.channel!, playlist, {
            message: context,
            textChannel: context.guild!.channels.cache.get(context.chat!.replyChatId) as TextChannel,
            member: context.member!,
        })
    } else {
        for (const arg of args) {
            await distube.play(context.member!.voice.channel!, arg, {
                message: context,
                textChannel: context.guild!.channels.cache.get(context.chat!.replyChatId) as TextChannel,
                member: context.member!,
            })
        }
    }

    await distube.setVolume(context, context.chat!.volume)
}
