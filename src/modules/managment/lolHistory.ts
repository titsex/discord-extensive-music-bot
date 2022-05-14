import { IChampion, MContext } from '@types'
import { TextChannel } from 'discord.js'
import { buildEmbed, generateEmbedLeagueMath, getArgs } from '@utils'
import { lolApi } from '@consts'
import { RegionGroups, Regions } from 'twisted/dist/constants'
import axios from 'axios'

export async function lolHistory(context: MContext) {
    const channel = context.client.channels.cache.get(context.channelId!)! as TextChannel

    const args = getArgs(context)
    const nickname = args[0] || context.member?.nickname

    if (!nickname)
        return await channel.send({
            embeds: [
                buildEmbed(
                    'Вы не указали nickname',
                    `Укажите первым аргументом nickname или установите его по команде ${context.chat?.prefix}nickname "ник"`
                ),
            ],
        })

    const championNotFoundError = buildEmbed('Чемпион не найден', 'Возможно Вы неверно указали свой nickname')

    try {
        const summoner = await lolApi.Summoner.getByName(nickname, Regions.RUSSIA)
        const puuid = summoner.response.puuid

        const matchList = await lolApi.MatchV5.list(puuid, RegionGroups.EUROPE)
        const lastMatch = matchList.response[0]

        const matchInfo = (await lolApi.MatchV5.get(lastMatch, RegionGroups.EUROPE)).response.info

        const matchTime = (matchInfo.gameDuration / 60).toFixed(1)

        const myTeam = matchInfo.teams[0]
        const enemyTeam = matchInfo.teams[1]

        const myTeamBans = []
        const enemyTeamBans = []

        const myTeamChampions = matchInfo.participants.filter(x => x.win === myTeam.win)
        const enemyTeamChampions = matchInfo.participants.filter(x => x.win === enemyTeam.win)

        const myTeamChampionsNames = []
        const enemyTeamChampionsNames = []

        const myTeamInfo: IChampion[] = []
        const enemyTeamInfo: IChampion[] = []

        const versions = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json')
        const version = versions.data[0]

        const champions = (
            await axios.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/ru_RU/champion.json`)
        ).data

        for (const champion in champions.data) {
            const item = champions.data[champion]

            if (myTeam.bans.find(x => x.championId === Number(item.key))) myTeamBans.push(item.name)
            if (enemyTeam.bans.find(x => x.championId === Number(item.key))) enemyTeamBans.push(item.name)

            if (myTeamChampions.find(x => x.championId === Number(item.key)))
                myTeamChampionsNames.push({
                    id: item.key,
                    name: item.name,
                })

            if (enemyTeamChampions.find(x => x.championId === Number(item.key)))
                enemyTeamChampionsNames.push({
                    id: item.key,
                    name: item.name,
                })
        }

        for (const item of myTeamChampions) {
            const find = myTeamChampionsNames.find(x => Number(x.id) === item.championId)

            if (find)
                myTeamInfo.push({
                    summoner: item.summonerName,
                    name: find.name,
                    position: item.teamPosition,
                    kills: item.kills,
                    gold: item.goldEarned,
                    deaths: item.deaths,
                    assists: item.assists,
                })
        }

        for (const item of enemyTeamChampions) {
            const find = enemyTeamChampionsNames.find(x => Number(x.id) === item.championId)

            if (find)
                enemyTeamInfo.push({
                    summoner: item.summonerName,
                    name: find.name,
                    position: item.teamPosition,
                    kills: item.kills,
                    gold: item.goldEarned,
                    deaths: item.deaths,
                    assists: item.assists,
                })
        }

        const myTOP = myTeamInfo.find(x => x.position === 'TOP') as IChampion
        const enemyTOP = enemyTeamInfo.find(x => x.position === 'TOP') as IChampion

        const myJungle = myTeamInfo.find(x => x.position === 'JUNGLE') as IChampion
        const enemyJungle = enemyTeamInfo.find(x => x.position === 'JUNGLE') as IChampion

        const myMiddle = myTeamInfo.find(x => x.position === 'MIDDLE') as IChampion
        const enemyMiddle = enemyTeamInfo.find(x => x.position === 'MIDDLE') as IChampion

        const myADK = myTeamInfo.find(x => x.position === 'BOTTOM') as IChampion
        const enemyADK = enemyTeamInfo.find(x => x.position === 'BOTTOM') as IChampion

        const mySupport = myTeamInfo.find(x => x.position === 'UTILITY') as IChampion
        const enemySupport = enemyTeamInfo.find(x => x.position === 'UTILITY') as IChampion

        return channel.send({
            embeds: [
                buildEmbed(
                    `Последний матч призывателя ${nickname} (${myTeam.win ? 'ПОБЕДА' : 'ПОРАЖЕНИЕ'})`,
                    `Матч длилися ${matchTime} минут`,
                    [
                        ...generateEmbedLeagueMath(
                            myTOP,
                            enemyTOP,
                            myJungle,
                            enemyJungle,
                            myMiddle,
                            enemyMiddle,
                            myADK,
                            enemyADK,
                            mySupport,
                            enemySupport
                        ),
                    ]
                ),
            ],
        })
    } catch (error: any) {
        return channel.send({ embeds: [championNotFoundError] })
    }
}
