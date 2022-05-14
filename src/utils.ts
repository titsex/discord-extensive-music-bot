import { EmbedField, MessageEmbed } from 'discord.js'
import { distance } from 'fastest-levenshtein'
import { IChampion, ICommand, MContext } from '@types'
import { commands } from '@consts'

export function getCommand(context: MContext) {
    if (!context.content.startsWith(context.chat!.prefix)) return

    const text = context.content.slice(context.chat!.prefix.length)
    const cmds: Array<ICommand & { distance: number; str: string }> = []

    for (const key in commands) {
        for (const alias of commands[key].aliases) {
            const wordCount = alias.split(' ').length
            let str = ''

            const splited = text.split(' ')

            for (let i = 0; i < wordCount; i++) {
                str += `${splited[i]} `
            }
            str = str.substring(0, str.length - 1)
            const dist = distance(alias, str)

            if (dist <= alias.length / 2) {
                const cmd = commands[key]
                cmds.push({
                    ...{ ...cmd, key },
                    str,
                    distance: dist,
                })
            }
        }
    }

    if (cmds.length) {
        cmds.sort((a, b) => {
            if (a.distance > b.distance) return 1
            else if (a.distance === b.distance) return 0
            return -1
        })

        context.content = text.replace(cmds[0].str, '').trim()
        return cmds[0]
    }

    return
}

export function getArgs(context: MContext) {
    return context.content.split('\n')
}

export function getIds(args: string[]) {
    const ids = new Set()

    for (let i = 0; i < args.length; i++) {
        const arg = args[i]
        const match = arg.match(/<@!(\d+)?>/i)

        if (match) {
            args[i] = ''
            ids.add(match[1])
        }
    }

    return Array.from(ids)
}

export function buildEmbed(title: string, description: string, fields?: EmbedField | EmbedField[]) {
    const embed = new MessageEmbed()

    if (title) embed.setTitle(title)
    if (description) embed.setDescription(description)

    embed.setColor('RANDOM')

    if (fields) {
        if (Array.isArray(fields)) {
            for (const field of fields) {
                embed.addField(field.name, field.value, field.inline)
            }
        } else {
            embed.addField(fields.name, fields.value, fields.inline)
        }
    }

    return embed
}

export function generateEmbedLeagueMath(
    myTOP: IChampion,
    enemyTOP: IChampion,
    myJungle: IChampion,
    enemyJungle: IChampion,
    myMiddle: IChampion,
    enemyMiddle: IChampion,
    myADK: IChampion,
    enemyADK: IChampion,
    mySupport: IChampion,
    enemySupport: IChampion
) {
    return [
        {
            name: `${myTOP.summoner} - ${myTOP!.name} (${myTOP.position})`,
            value: `💀 ${myTOP!.kills} ☠ ${myTOP!.deaths} ⚔ ${myTOP!.assists}\n💰 ${myTOP.gold}`,
            inline: true,
        },
        {
            name: '\u200b',
            value: '\u200b',
            inline: true,
        },
        {
            name: `${enemyTOP.summoner} - ${enemyTOP!.name} (${enemyTOP.position})`,
            value: `💀 ${enemyTOP!.kills} ☠ ${enemyTOP!.deaths} ⚔ ${enemyTOP!.assists}\n💰 ${enemyTOP.gold}`,
            inline: true,
        },
        {
            name: '\u200b',
            value: '\u200b',
            inline: false,
        },
        {
            name: `${myJungle.summoner} - ${myJungle!.name} (${myJungle.position})`,
            value: `💀 ${myJungle!.kills} ☠ ${myJungle!.deaths} ⚔ ${myJungle!.assists}\n💰 ${myJungle.gold}`,
            inline: true,
        },
        {
            name: '\u200b',
            value: '\u200b',
            inline: true,
        },
        {
            name: `${enemyJungle.summoner} - ${enemyJungle!.name} (${enemyJungle.position})`,
            value: `💀 ${enemyJungle!.kills} ☠ ${enemyJungle!.deaths} ⚔ ${enemyJungle!.assists}\n💰 ${
                enemyJungle.gold
            }`,
            inline: true,
        },
        {
            name: '\u200b',
            value: '\u200b',
            inline: false,
        },
        {
            name: `${myMiddle.summoner} - ${myMiddle!.name} (${myMiddle.position})`,
            value: `💀 ${myMiddle!.kills} ☠ ${myMiddle!.deaths} ⚔ ${myMiddle!.assists}\n💰 ${myMiddle.gold}`,
            inline: true,
        },
        {
            name: '\u200b',
            value: '\u200b',
            inline: true,
        },
        {
            name: `${enemyMiddle.summoner} - ${enemyMiddle!.name} (${enemyMiddle.position})`,
            value: `💀 ${enemyMiddle!.kills} ☠ ${enemyMiddle!.deaths} ${enemyMiddle!.assists}\n💰 ${enemyMiddle.gold}`,
            inline: true,
        },
        {
            name: '\u200b',
            value: '\u200b',
            inline: false,
        },
        {
            name: `${myADK.summoner} - ${myADK!.name} (${myADK.position})`,
            value: `💀 ${myADK!.kills} ☠ ${myADK!.deaths} ⚔ ${myADK!.assists}\n💰 ${myADK.gold}`,
            inline: true,
        },
        {
            name: '\u200b',
            value: '\u200b',
            inline: true,
        },
        {
            name: `${enemyADK.summoner} - ${enemyADK!.name} (${enemyADK.position})`,
            value: `💀 ${enemyADK!.kills} ☠ ${enemyADK!.deaths} ⚔ ${enemyADK!.assists}\n💰 ${enemyADK.gold}`,
            inline: true,
        },
        {
            name: '\u200b',
            value: '\u200b',
            inline: false,
        },
        {
            name: `${mySupport.summoner} - ${mySupport!.name} (${mySupport.position})`,
            value: `💀 ${mySupport!.kills} ☠ ${mySupport!.deaths} ⚔ ${mySupport!.assists}\n💰 ${mySupport.gold}`,
            inline: true,
        },
        {
            name: '\u200b',
            value: '\u200b',
            inline: true,
        },
        {
            name: `${enemySupport.summoner} - ${enemySupport!.name} (${mySupport.position})`,
            value: `💀 ${enemySupport!.kills} ☠ ${enemySupport!.deaths} ⚔ ${enemySupport!.assists}\n💰 ${
                enemySupport.gold
            }`,
            inline: true,
        },
    ]
}
