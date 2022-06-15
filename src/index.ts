import { config } from 'dotenv'
config()

import { COMMAND_TYPE, MContext, Roles } from '@types'
import { extendContext, validate, saveContext, setCyberCutletRole } from '@getters'
import SoundCloudPlugin from '@distube/soundcloud'
import { playSong } from '@event/playSong.event'
import { buildEmbed, getCommand } from '@utils'
import { addSong } from '@event/addSong.event'
import { addList } from '@event/addList.event'
import { YtDlpPlugin } from '@distube/yt-dlp'
import SpotifyPlugin from '@distube/spotify'
import { Client, Intents } from 'discord.js'
import { Logger } from '@class/Logger'
import { errorEmbed } from '@consts'
import { DisTube } from 'distube'
import { DB } from '@database'
import { finish } from '@event/finish.event'

new DB()

export const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MEMBERS,
    ],
})

export const distube = new DisTube(client, {
    nsfw: true,
    leaveOnEmpty: true,
    leaveOnFinish: true,
    youtubeDL: false,
    leaveOnStop: true,
    emptyCooldown: 1,
    plugins: [new YtDlpPlugin(), new SpotifyPlugin(), new SoundCloudPlugin()],
})

distube.on('addSong', async (queue, song) => await addSong(queue, song))
distube.on('playSong', async (queue, song) => await playSong(queue, song))
distube.on('addList', async (queue, playlist) => await addList(queue, playlist))
distube.on('finish', async queue => await finish(queue))
distube.on('error', async (queue, error) => console.log(error))
distube.on('searchCancel', async queue => queue.channel.send({ embeds: [errorEmbed] }))
distube.on('searchInvalidAnswer', async queue => queue.channel.send({ embeds: [errorEmbed] }))
distube.on('searchNoResult', async queue => queue.channel.send({ embeds: [errorEmbed] }))

client.on('message', async (context: MContext) => {
    if (context.author.bot) return

    await extendContext(context)
    await setCyberCutletRole(context)
    const command = getCommand(context)

    if (!(await validate(context, command))) return

    if (command) {
        if (command.type === COMMAND_TYPE.MUSIC && !context.member?.voice?.channelId) {
            const text = buildEmbed(
                'Присоединитесь к голосовому каналу',
                'Музыкальные команды можно использовать только будучи в голосовом канале.'
            )

            context.channel.send({ embeds: [text] })

            return
        }

        if (command.role > context.sender!.role!) {
            const text = buildEmbed(
                'Недостаточно прав для применения этой команды',
                `Эту команду могут использовать только пользователи с ролью [${Roles[
                    command.role
                ].toLowerCase()}] и выше`
            )

            context.channel.send({ embeds: [text] })

            return
        }

        try {
            await command.func(context)
        } catch (error) {
            Logger.error('Ошибка при выполнении команды', command.aliases, error)
            context.channel.send({ embeds: [buildEmbed('Произошла ошибка', 'Не удалось выполнить команду')] })
        } finally {
            await saveContext(context)
        }
    }
})

client.on('ready', () => Logger.info('Бот успешно запущен'))
client.login(process.env.TOKEN!).then(() => [])
